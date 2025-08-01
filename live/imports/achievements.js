import { ANSI } from "./ANSI";

// Class for fetching all achievements
export class Achievements {
  #ns;
  #json;
  /** @param {NS} ns */
  constructor(ns) {
    this.#ns = ns;
  }

  /** Attempts to fetch the achievements from Github; updates `this.#json` if successful.
   * @returns {Promise<Boolean>} `true` if successful, `false` otherwise
   */
  async update_from_web() {
    const URL =
      "https://raw.githubusercontent.com/bitburner-official/bitburner-src/refs/heads/dev/src/Achievements/AchievementData.json";
    try {
      this.#ns.tprint(`${ANSI.fg.cyan}Fetching from github...${ANSI.reset}`);
      let response = await fetch(URL);
      if (!response.ok) {
        this.#ns.alert(`${response.status}: ${response.statusText}`);
      }

      let out = await response.json();
      this.#json = out.achievements;
      let data = JSON.stringify(out.achievements);
      this.#ns.rm("data/achievements.txt", "home");
      this.#ns.write("data/achievements.txt", data, "w");
      this.#ns.tprint(`${ANSI.fg.green}Fetched!${ANSI.reset}`)
      return true;
    } catch (err) {
      this.#ns.tprint(`${ANSI.fg.red}Failed to fetch:\n${err}${ANSI.reset}`)
      this.#ns.alert(`ERROR: ${err}`);
      return false;
    }
  }

  update_from_file() {
    let json = JSON.parse(this.#ns.read("data/achievements.txt"));
    this.#json = json;
  }
  get json() {
    return this.#json;
  }
  /** @returns {Set<String>} Set of all possible achievements. */
  get all() {
    let list = [];
    this.update_from_file();
    for (let item in this.#json) {
      list.push(item);
    }
    let all = new Set(list.sort((a, b) => a.localeCompare(b)));
    return all;
  }

  /** @returns {Set<String>} Set of all unlocked achievements. */
  get unlocked() {
    //! return this.#ns.singularity.getUnlockedAchievements()
    let doc = globalThis["document"];
    let list = [];
    for (let item of doc.achievements) {
      list.push(item);
    }
    let unlocked = new Set(list.sort((a, b) => a.localeCompare(b)));
    return unlocked;
  }

  /** @returns {Set<String>} Set of all locked achievements */
  get locked() {
    return this.all.difference(this.unlocked);
  }

  /** Returns whether we can try to get this achievement
   * @param {Number} node Node required for the given achievement.
   * @param {String} achievement_name Name of achievement to check for.
   * @returns {Boolean} `true` if achievement not got and on the right node.
   */
  node_check(node, achievement_name) {
    let on_correct_node = this.#ns.getResetInfo().currentNode == node;
    let achievement_is_locked = this.locked.has(achievement_name);
    if (on_correct_node && achievement_is_locked) {
      this.#ns.print(
        `${ANSI.fg.magenta}Bitnode ${node} detected - ${achievement_name}${ANSI.reset}`
      );
      return true;
    } else {
      return false;
    }
  }
}

/** @param {NS} ns */
export async function main(ns) {
  let achievements = new Achievements(ns);
  await achievements.update_from_web();
  let message = "";
  message += "\n===LOCKED===\n";
  for (let item of achievements.locked) {
    message += `${item} | ${achievements.json[item].Description}\n`;
  }
  message += "\n===UNLOCKED===\n";
  for (let item of achievements.unlocked) {
    message += `${item} | ${achievements.json[item].Description}\n`;
  }
  ns.alert(message);
}
