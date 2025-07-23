// Class for fetching all achievements
export class Achievements {
	/** @param {NS} ns */
	constructor(ns) {
		this.ns = ns;
		this.json;
	};

	/** Attempts to fetch the achievements from Github; updates `this.json` if successful. */
	async update_from_web() {
		const URL = "https://raw.githubusercontent.com/bitburner-official/bitburner-src/85094d4fb46926aafd31c534cc973697e8c0a492/src/Achievements/AchievementData.json";
		try {
			let response = await fetch(URL);
			if (!response.ok) { this.ns.alert(`${response.status}: ${response.statusText}`) };
			out = await response.json();
			this.json = out
		} catch (err) { this.ns.alert(`ERROR: ${err}`) };
		data = JSON.stringify(out);
		this.ns.rm("achievements.txt", "home");
		this.ns.write("achievements.txt", data, w);
	};

	update_from_file() {
		let json = JSON.parse(this.ns.read("achievements.txt"));
		this.json = json
	}

	/** @returns {Set<String>} Set of all possible achievements. */
	get all() {
		let list = [];
		for (let item of this.json.achievements) { list.push(item.ID) };
		all = new Set(list.sort((a, b) => a.localeCompare(b)));
		return all;
	};

	/** @returns {Set<String>} Set of all unlocked achievements. */
	get unlocked() {
		//! return this.ns.singularity.getUnlockedAchievements()
		let doc = globalThis["document"]
		let list = []
		for (let achieve of doc.achievements) { list.add(achieve) }
		let unlocked = new Set(list.sort((a, b) => a.localeCompare(b)))
		return unlocked
	}

	/** @returns {Set<String>} Set of all locked achievements */
	get locked() { return this.all.difference(this.unlocked) }

};

/** @param {NS} ns */
export async function main(ns) {
	let achieves = new Achievements(ns);
	achieves.update_from_web();
	ns.tprint("ALL");
	ns.tprint(achieves.all);
	ns.tprint("UNLOCKED");
	ns.tprint(achieves.unlocked);
	ns.tprint("LOCKED");
	ns.tprint(achieves.locked);
}