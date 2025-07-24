import { ANSI } from "../imports/ANSI";

const MODULES_PATH = "modules/";

export { MODULES_PATH };

export class AllModules {
    /** @param {NS} ns  */
    constructor(ns) {
        this.ns = ns;
    };
    /** @returns {Array<Module>} */
    get list() { return this.ns.ls("home", MODULES_PATH).map((a) => new Module(this.ns,a)) }
};

export class Module {
    #enabled = true;
    #pid = null;
    /** Instances a Module and enables it by default
     * @param {NS} ns 
     * @param {String} filename 
     */
    constructor(ns,filename) {
        this.ns = ns;
        this.filename = filename;
        this.shortname = filename.replace(MODULES_PATH, "");
    };
    /** @returns {Boolean} Gets the state of the module */
    get enabled() { return this.#enabled };
    /** @returns {Number} Script Ram cost */
    get ram(){return this.ns.getScriptRam(this.filename,"home")};
    /** Enables the module */
    enable() { this.#enabled = true };
    /** Disables the module */
    disable() { this.#enabled = false };
    /** @returns {Number|null} */
    get pid() {
        if (this.ns.isRunning(this.#pid)) { return this.#pid }
        else { this.#pid = null; return this.#pid };
    };
    /** Tries to run the module
     * @returns {Promise<Boolean>} `true` if started
     */
    async run_module() {
        if (!this.enabled) { return false }; // Don't run
        if (this.ns.isRunning(this.#pid)) { return false }; // Already running
        while (this.ram > this.ns.getServerMaxRam() - this.ns.getServerUsedRam()){await this.ns.asleep(1000)} // If not enough RAM, wait
        this.ns.tprint(`${ANSI.fg.magenta}Running ${this.shortname}...${ANSI.reset}`)
        let result = ns.run(this.filename); // Try to start
        if (result == 0) { this.#pid = null;this.ns.tprint(`${ANSI.fg.red}Something went wrong trying to run ${this.shortname}.${ANSI.reset}`); return false }; // Failed to start so remove pid
        this.#pid = result; // update pid
        return true; // success
    };
};
/** Disables the given module
 * @param {AllModules} all_modules AllModules Object
 * @param {String} module Short name of module e.g. "gang.js"
 * @returns {Boolean} 
 */
export function disable_module(all_modules,module){
    all_modules.find(item => item.shortname == module).disable();
};