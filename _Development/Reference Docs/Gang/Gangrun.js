/** @param {NS} ns */
//Made by Monty Yardley
const ASCEND_MULT = 1.6487212707;
const MIN_POWER = 2500;
const MONEY_MULT = 0.08334;
const JUSTICE_CHANCE = 0.0008;
const TRAINING_CHANCE = 0.25;
const MIN_WIN_CHANCE = 0.8;
// Use caution while editing constants below this comment.
const MAX_MEMBERS = 12;
const SLEEP_TIME = 5010;
const EQUIPS = ["Baseball Bat", "Katana", "Glock 18C", "P90C", "Steyr AUG", "AK-47", "M15A10 Assault Rifle"
	, "AWM Sniper Rifle", "Bulletproof Vest", "Full Body Armor", "Liquid Body Armor", "Graphene Plating Armor"
	, "Ford Flex V20", "ATX1070 Superbike", "Mercedes-Benz S9001", "White Ferrari", "NUKE Rootkit"
	, "Soulstealer Rootkit", "Demon Rootkit", "Hmap Node", "Jack the Ripper", "Bionic Arms", "Bionic Legs"
	, "Bionic Spine", "BrachiBlades", "Nanofiber Weave", "Synthetic Heart", "Synfibril Muscle", "BitWire"
	, "Neuralstimulator", "DataJack", "Graphene Bone Lacings"];
const GANG_FACTION = "Slum Snakes";
const ENEMY_FACTIONS = ["Tetrads", "The Syndicate", "The Dark Army", "Speakers for the Dead"
	, "NiteSec", "The Black Hand"];

export async function main(ns) {
	ns.disableLog("ALL");
	while (await ns.sleep(SLEEP_TIME)) {
		let gangActive = startGang(ns);
		karmaLog(ns, gangActive);
		if (gangActive === false) continue;
		const GANG = new Gang(ns);
		GANG.runGang();
	}
}

function startGang(ns) {
	if (!ns.gang.inGang()) return ns.gang.createGang(GANG_FACTION);
	return true;
}
function karmaLog(ns, gangActive) {
	if (gangActive) return true;
	let karma = Math.floor(-(ns.heart.break()));
	ns.clearLog();
	ns.print("Faction: " + GANG_FACTION)
	ns.print("Bad Karma: " + karma + "/54000");
	return false;
}

class Member {
	constructor(ns, g, name) {
		this.ns = ns;
		this.g = g;
		this.name = name;
		this.player = this.ns.getPlayer();
		this.memberInfo = this.g.getMemberInformation(this.name);
		this.strength = Math.min(this.memberInfo.str, this.memberInfo.def, this.memberInfo.dex, this.memberInfo.agi);
	}
	setStartupTask(numMembers) {
		if (this.strength < 150) return this.g.setMemberTask(this.name, "Train Combat");
		if (numMembers < 6) return this.g.setMemberTask(this.name, "Mug People");
		if (this.strength < 800) return this.g.setMemberTask(this.name, "Train Combat");
		if (numMembers < 10) return this.g.setMemberTask(this.name, "Terrorism");
		if (this.strength < MIN_POWER) return this.g.setMemberTask(this.name, "Train Combat");
		return this.g.setMemberTask(this.name, "Terrorism");
	}
	setTask(winChance, territory) {
		let random = Math.random();
		if (this.strength <= MIN_POWER) return this.g.setMemberTask(this.name, "Train Combat");
		if (random < JUSTICE_CHANCE) return this.g.setMemberTask(this.name, "Vigilante Justice");
		if (random < TRAINING_CHANCE) return this.g.setMemberTask(this.name, "Train Combat");
		if (territory < 1) {
			if (winChance < MIN_WIN_CHANCE) return this.g.setMemberTask(this.name, "Territory Warfare");
			if (random < winChance) return this.g.setMemberTask(this.name, "Human Trafficking");
			if (winChance < 1) return this.g.setMemberTask(this.name, "Territory Warfare");
		}
		return this.g.setMemberTask(this.name, "Human Trafficking");
	}
	ascend() {
		let result = this.g.getAscensionResult(this.name);
		if (result) {
			let lowestMulti = Math.min(result.str, result.def, result.dex, result.agi);
			if (lowestMulti > ASCEND_MULT) {
				this.g.ascendMember(this.name);
			}
		}
	}
	buyEquipment() {
		for (let equip of EQUIPS) {
			let money = this.player.money * MONEY_MULT;
			let cost = this.ns.gang.getEquipmentCost(equip);
			if (cost > money) continue;
			this.g.purchaseEquipment(this.name, equip);
		}
	}
}

class Gang {
	constructor(ns) {
		this.ns = ns;
		this.g = this.ns.gang;
		this.gangInfo = this.g.getGangInformation();
		this.memberNames = this.g.getMemberNames();
		this.memberCount = this.memberNames.length;
		this.territory = this.gangInfo.territory;
	}
	memberObjects() {
		let members = [];
		for (let member of this.memberNames) {
			members.push(new Member(this.ns, this.g, member));
		}
		return members;
	}
	war() {
		if (this.gangInfo.territory == 1) {
			this.g.setTerritoryWarfare(0);
			return 1;
		}
		let winChance = 1;
		for (let faction of ENEMY_FACTIONS) {
			let tempChance = this.g.getChanceToWinClash(faction)
			if (winChance > tempChance) {
				winChance = tempChance;
			}
		}
		if (winChance > MIN_WIN_CHANCE) {
			this.g.setTerritoryWarfare(1);
		} else {
			this.g.setTerritoryWarfare(0);
		}
		return winChance;
	}
	recruitMembers() {
		return this.g.recruitMember("Bro #" + this.memberCount);
	}
	runGang() {
		let members = this.memberObjects();
		var winChance = this.war();
		for (let member of members) {
			member.ascend();
			if (this.memberCount < MAX_MEMBERS) {
				member.setStartupTask(this.memberCount);
			} else {
				member.setTask(winChance, this.gangInfo.territory)
			}
			member.buyEquipment();
		}
		if (this.recruitMembers()) return;
	}
}