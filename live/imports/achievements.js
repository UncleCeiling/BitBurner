import { ANSI } from "./ANSI";

// Class for fetching all achievements
export class Achievements {
	/** @param {NS} ns */
	constructor(ns) {
		this.ns = ns;
		this.json;
	};

	/** Attempts to fetch the achievements from Github; updates `this.json` if successful.
	 * @returns {Promise<Boolean>} `true` if successful, `false` otherwise
	 */
	async update_from_web() {
		const URL = "https://raw.githubusercontent.com/bitburner-official/bitburner-src/refs/heads/dev/src/Achievements/AchievementData.json";
		try {
			this.ns.tprint(`${ANSI.fg.cyan}Fetching from github...${ANSI.reset}`)
			let response = await fetch(URL);
			if (!response.ok) { this.ns.alert(`${response.status}: ${response.statusText}`) };

			let out = await response.json();
			this.json = out;
			let data = JSON.stringify(out);
			this.ns.rm("data/achievements.txt", "home");
			this.ns.write("data/achievements.txt", data, "w");
			return true;
		} catch (err) { this.ns.alert(`ERROR: ${err}`); return false };
	};

	update_from_file() {
		let json = JSON.parse(this.ns.read("data/achievements.txt"));
		this.json = json
	}

	/** @returns {Set<String>} Set of all possible achievements. */
	get all() {
		let list = [];
		this.update_from_file();
		for (let key in this.json.achievements) { list.push(this.json.achievements[key].ID) };
		let all = new Set(list.sort((a, b) => a.localeCompare(b)));
		return all;
	};

	/** @returns {Set<String>} Set of all unlocked achievements. */
	get unlocked() {
		//! return this.ns.singularity.getUnlockedAchievements()
		let doc = globalThis["document"]
		let list = []
		for (let achieve of doc.achievements) { list.push(achieve) }
		let unlocked = new Set(list.sort((a, b) => a.localeCompare(b)))
		return unlocked
	}

	/** @returns {Set<String>} Set of all locked achievements */
	get locked() { return this.all.difference(this.unlocked) }

	/** Returns whether we can try to get this achievement
	 * @param {Number} node Node required for the given achievement.
	 * @param {String} achievement_name Name of achievement to check for.
	 * @returns {Boolean} `true` if achievement not got and on the right node.
	 */
	node_check(node, achievement_name) {
		let on_correct_node = this.ns.getResetInfo().currentNode == node
		let achievement_is_locked = !this.locked.has(achievement_name)
		if (on_correct_node && achievement_is_locked) {
			this.ns.print(`${ANSI.fg.magenta}Bitnode ${node} detected - ${achievement_name}${ANSI.reset}`);
			return true;
		} else { return false };
	};
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