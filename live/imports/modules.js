import { ANSI } from "../imports/ANSI";

const MODULES_PATH = "modules/";
export { MODULES_PATH };

export class Module {
  #enabled = true;
  #pid = 0;
  #ns;
  #filename;
  #shortname;
  /** Instances a Module and enables it by default
   * @param {NS} ns
   * @param {String} filename
   */
  constructor(ns, filename) {
    this.#ns = ns;
    this.#filename = filename;
    this.#shortname = filename.replace(MODULES_PATH, "");
  }
  /** @returns {String} Gets the filename of the module */
  get filename() {
    return this.#filename;
  }
  /** @returns {String} Gets the short name of the module */
  get shortname() {
    return this.#shortname;
  }
  /** @returns {Boolean} Gets the state of the module */
  get enabled() {
    return this.#enabled;
  }
  /** @returns {Number} Script Ram cost */
  get ram() {
    return this.#ns.getScriptRam(this.#filename, "home");
  }
  /** Enables the module */
  enable() {
    this.#enabled = true;
  }
  /** Disables the module */
  disable() {
    this.#enabled = false;
  }
  /** @returns {Number} */
  get pid() {
    if (this.#ns.isRunning(this.#filename, "home")) {
      return this.#pid;
    } else {
      this.#pid = 0;
      return this.#pid;
    }
  }
  /** Tries to run the module
   * @returns {Promise<Boolean>} `true` if started
   */
  async run_module() {
    if (!this.enabled) {
      return false;
    } // Don't run
    if (
      this.ram >
      this.#ns.getServerMaxRam("home") -
        this.#ns.getScriptRam("main.js", "home")
    ) {
      return false;
    }
    if (this.pid != 0 && this.#ns.isRunning(this.#filename, "home")) {
      this.#ns.print(
        `${ANSI.fg.cyan}Skipping ${this.#shortname}...${ANSI.reset}`
      );
      return false;
    } // Already running
    while (
      this.ram >
      this.#ns.getServerMaxRam("home") - this.#ns.getServerUsedRam("home")
    ) {
      this.#ns.print(
        `${ANSI.fg.yellow}${
          this.shortname
        } waiting for RAM to clear ${this.#ns.getServerUsedRam(
          "home"
        )}/${this.#ns.getServerMaxRam("home")}${ANSI.reset}`
      );
      await this.#ns.asleep(1000);
    } // If not enough RAM, wait
    // this.#ns.tprint(`${ANSI.fg.magenta}Running ${this.shortname}...${ANSI.reset}`);
    this.#ns.print(
      `${ANSI.fg.green}Running ${this.#shortname}...${ANSI.reset}`
    );

    let result = this.#ns.run(this.#filename); // Try to start
    if (result == 0) {
      this.#pid = null;
      this.#ns.tprint(
        `${ANSI.fg.red}Something went wrong trying to run ${this.#shortname}.${
          ANSI.reset
        }`
      );
      return false;
    } // Failed to start so remove pid
    this.#pid = result; // update pid
    return true; // success
  }
}

/** Returns an array of `Module` objects describing the scripts in `modules/`.
 * @param {NS} ns
 * @returns {Array<Module>} Array of `Module` objects, representing scripts in the `modules/` folder
 */
export function all_modules(ns) {
  return ns.ls("home", MODULES_PATH).map((a) => new Module(ns, a));
}

/** Disables the given module
 * @param {Array<Module>} all_modules
 * @param {String} module Short name of module e.g. "gang.js"
 * @returns {Boolean}
 */
export function disable_module(all_modules, module) {
  for (let mod of all_modules) {
    if (mod.shortname == module) {
      mod.disable();
    }
  }
}

/** @param {NS} ns  */
export async function main(ns) {
  let modules = all_modules(ns);
  let message = "";
  for (let module of modules) {
    message += `${module.enabled ? "⭕" : "❌"} | ${ns.formatRam(
      module.ram,
      1
    )} | ${module.shortname}\n`;
  }
  ns.alert(message);
}
