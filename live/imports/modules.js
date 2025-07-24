const MODULES_PATH = "modules/";

export { MODULES_PATH };

export class AllModules {
    /** @param {NS} ns  */
    constructor(ns) {
        this.ns = ns;
    };
    /** @returns {Array<Module>} */
    get list() { return this.ns.ls("home", MODULES_PATH).map((a) => new Module(a)) }
};

export class Module {
    #enabled = true;
    #pid = null;
    /** Instances a Module and enables it by default
     * @param {String} filename 
     */
    constructor(filename) {
        this.filename = filename;
        this.shortname = filename.replace(MODULES_PATH, "");
    };
    /** @returns {Boolean} Gets the state of the module */
    get enabled() { return this.#enabled };
    /** Enables the module */
    enable() { this.#enabled = true };
    /** Disables the module */
    disable() { this.#enabled = false };
    /** @returns {Number|null} */
    get pid() {
        if (isRunning(this.#pid)) { return this.#pid }
        else { this.#pid = null; return this.#pid };
    };
    /** Tries to run the module
     * @returns {Boolean} `true` if started
     */
    run_module() {
        if (!this.enabled) { return false }; // Don't run
        if (isRunning(this.#pid)) { return false }; // Already running
        let result = ns.run(this.filename); // Try to start
        if (result == 0) { this.#pid = null; return false }; // Failed to start so remove pid
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