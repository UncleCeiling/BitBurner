import { ANSI } from "imports/ANSI";
import { Achievements } from "imports/achievements";
import { AllModules, disable_module } from "imports/modules";
import * as svr from "imports/servers";
/** @param {NS} ns */
export async function main(ns) {
    ns.disableLog("ALL");
    const DATA_PATH = "data/";

    // Check arg for break-time and apply
    const ARGUMENT = ns.args[0];
    var break_secs = 30;
    let arg_present = ARGUMENT != null;
    if (arg_present) {
        let invalid_arg_type = typeof ARGUMENT != Number;
        let invalid_arg_value = ARGUMENT < 1;
        if (invalid_arg_type || invalid_arg_value) {
            ns.tprint(`${ANSI.fg.red}${ARGUMENT} is not a valid argument (must be an integer >= 1)${ANSI.reset}`);
            return;
        } else {
            break_secs = Math.round(ARGUMENT);
        };
    };

    // Kill all scripts
    ns.killall("home", true);

    // Clear all data files
    let data_files = ns.ls("home", DATA_PATH);
    for (let file of data_files) { if (ns.rm(file, "home")) { ns.print(`Deleted ${file}`) } };

    // Create Achievements data
    let achieves = new Achievements(ns);
    let achieve_update_success = await achieves.update_from_web();
    if (!achieve_update_success) { ns.tprint(`${ANSI.fg.red}Failed to fetch achievements...${ANSI.reset}`) };

    // Disable appropriate achievements
    let modules = new AllModules(ns).list; // Generate module objects in array
    /** 
     * @param {Number} node 
     * @param {String} achievement 
     * @param {String} module 
     * @param {Achievements} achievements 
     * @param {AllModules} modules 
     */
    function module_check(node, achievement, module) {
        if (achieves.node_check(node, achievement)) {
            disable_module(modules, module);
        };
    };
    module_check(2, "CHALLENGE_BN2", "gang");
    module_check(3, "CHALLENGE_BN3", "corp.js");
    module_check(6, "CHALLENGE_BN6", "bladeburner.js");
    module_check(7, "CHALLENGE_BN7", "bladeburner.js");
    module_check(8, "CHALLENGE_BN8", "stocks.js");
    module_check(9, "CHALLENGE_BN9", "hacknet.js");
    module_check(10, "CHALLENGE_BN10", "sleeves.js");
    module_check(13, "CHALLENGE_BN13", "stanek.js");
    module_check(14, "CHALLENGE_BN14", "ipvgo.js");

    // Forever
    while (true) {
        svr.write_map(ns);
        svr.server_stats(ns);
        achieves.update_from_file();
        for (let module of modules.sort(() => Math.random() - 0.5)) { // In a random order
            await module.run_module() // Try to run the module
            await ns.asleep(1000); // Pause
        };
        ns.print(`${ANSI.fg.cyan}Taking a break for ${break_secs} seconds.${ANSI.reset}`);
        ns.tprint(`${ANSI.fg.magenta}Taking a break for ${break_secs} seconds.${ANSI.reset}`);
        await ns.asleep(break_secs * 1000);
        ns.clearLog();
    };
};