export class Exe {
  #ns;
  #skill_req;
  #name;
  /** Creates an instance of an Exe object
   * @param {NS} ns
   * @param {String} name
   * @param {Number} skill_req
   */
  constructor(ns, name, skill_req) {
    this.#ns = ns;
    this.#skill_req = skill_req;
    this.#name = name;
  }
  /** @returns {String} Filename of the `.exe`. */
  get name() {
    return this.#name;
  }
  /** @returns {Number} Required hacking skill to create the `.exe`. */
  get skill_req() {
    let output = this.#skill_req - this.#ns.getPlayer().skills.intelligence / 2;
    output = output >= 0 ? output : 0;
    return output;
  }
  /** @returns {Boolean} `true` if the `.exe` exists in a complete state. */
  get exists() {
    if (!this.#ns.fileExists(this.name, "home")) {
      return false;
    }
    let filename = this.#ns.ls("home", this.name)[0];
    if (filename.includes("INC")) {
      return false;
    }
    return true;
  }
}

/** Returns a Set of `Exe` objects containing all possible `.exe` files.
 * @param {NS} ns
 * @returns {Set<Exe>}
 */
export function all_exes(ns) {
  const DETAILS = {
    "b1t_flum3.exe": 0,
    "NUKE.exe": 1,
    "AutoLink.exe": 25,
    "BruteSSH.exe": 50,
    "DeepscanV1.exe": 75,
    "ServerProfiler.exe": 75,
    "FTPCrack.exe": 100,
    "relaySMTP.exe": 250,
    "DeepscanV2.exe": 400,
    "HTTPWorm.exe": 500,
    "SQLInject.exe": 750,
    "Formulas.exe": 1000,
  };
  return new Set(
    Object.entries(DETAILS)
      .map(([a, b]) => new Exe(ns, a, b))
      .sort((a, b) => a.skill_req - b.skill_req)
  );
}

/** @param {NS} ns  */
export async function main(ns) {
  let exes = all_exes(ns);
  let message = "";
  for (let exe of exes) {
    let check = exe.exists ? "✅" : "❌";
    let req = String(exe.skill_req).padStart(4);
    message = message.concat(`${check}|${req}|${exe.name}\n`);
  }
  ns.alert(message);
}
