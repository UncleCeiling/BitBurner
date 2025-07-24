import { ANSI } from "imports/ANSI";
import { Achievements } from "imports/achievements";
import { AllModules, disable_module } from "imports/modules";
import * as util from "imports/servers";
/** @param {NS} ns */
export async function main(ns) {
    ns.disableLog("ALL");
    const DATA_PATH = "data/"

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

    // Clear all data files
    let data_files = ns.ls("home", DATA_PATH);
    for (let file of data_files) { if (ns.rm(file, "home")) { ns.print(`Deleted ${file}`) } };

    // Create Achievements data
    let achieves = new Achievements(ns);
    let achieve_update_success = await achieves.update_from_web();
    if (!achieve_update_success) { ns.tprint(`${ANSI.fg.red}Failed to fetch achievements...${ANSI.reset}`) };

    // TODO Implement modules properly with achievements
    let modules = new AllModules(ns).list; // Generate module objects in array
    /** 
     * @param {Number} node 
     * @param {String} achievement 
     * @param {String} module 
     * @param {Achievements} achievements 
     * @param {AllModules} modules 
     */
    function module_check(node, achievement, module){
        if (achieves.node_check(node,achievement)){
            disable_module(modules,module);
        };
    };
    module_check(2,"CHALLENGE_BN2","gang");
    module_check(3,"CHALLENGE_BN3","corp.js");
    module_check(6,"CHALLENGE_BN6","bladeburner.js");
    module_check(7,"CHALLENGE_BN7","bladeburner.js");
    module_check(8,"CHALLENGE_BN8","stocks.js");
    module_check(9,"CHALLENGE_BN9","hacknet.js");
    module_check(10,"CHALLENGE_BN10","sleeves.js");
    module_check(13,"CHALLENGE_BN13","stanek.js");
    module_check(14,"CHALLENGE_BN14","ipvgo.js");

    for (let mod of modules){
        ns.tprint(mod.filename,mod.enabled)
    }
    ns.tprint(ns.getResetInfo().currentNode)
    return


    // Forever
    while (true) {
        util.write_map(ns);
        util.server_stats(ns);
        achieves.update_from_file();
        for (let module of modules.sort(Math.random() < 0.5)) { // In a random order
            if (module.run_module()) { ns.tprint(`${ANSI.fg.cyan}Running ${module.shortname} module...${ANSI.reset}`) }; // Try to run the module
            await ns.asleep(1000); // Pause
        };
    };

    // OLD
    while (true) {
        await queue(); // Run scripts in `queue/` folder
        ns.print(`${ANSI.fg.magenta}Taking a break for ${break_secs} seconds.${ANSI.reset}`);
        await ns.asleep(break_secs * 1000); // Pause for a bit

        async function queue() {
            var scripts = ns.ls('home', QUEUE_LOC)// Fetch scripts and flag from queue
            ns.print(`${ANSI.fg.cyan}Found ${scripts.length} scripts.${ANSI.reset}`)
            for (let script of scripts.sort(() => Math.random() - 0.5)) { // For shuffled
                if (ns.isRunning(script)) { continue }// Skip script if already running
                ns.print(`Script:${ns.getScriptRam(script)}\nServerMax:${ns.getServerMaxRam("home")}\nServerUsed:${ns.getServerUsedRam("home")}\nServerFree:${ns.getServerMaxRam("home") - ns.getServerUsedRam("home")}`)
                while (ns.getScriptRam(script) > (ns.getServerMaxRam("home") - ns.getServerUsedRam("home"))) { await ns.asleep(1000) }
                ns.tprint(`${ANSI.fg.magenta}${ANSI.font.underline}Running ${script.replace(QUEUE_LOC, '')}${ANSI.reset}`)
                ns.run(script)
                await ns.asleep(1000) // Give it a second
            }
        }

        function server_stats() {
            ns.rm('server_stats.txt'); // Remove old file
            var servers = new util.AllServers(ns).purchased; // Get servers
            if (servers.length <= 0) {
                ns.tprint(`${ANSI.fg.yellow}No Purchased Servers${ANSI.reset}`); return;
            }; // Can't map what doesn't exist
            let data = servers.map((a) => `${a.name}: ${ns.formatRam(a.details.maxRam)}`); // Turn servers into string to add to file
            ns.write('server_stats.txt', data.join('\n'), 'w'); // Write new file
            ns.tprint(`${ANSI.fg.magenta}Wrote ${data.length} lines to 'server_stats.txt'${ANSI.reset}`);
        };

        function write_achievements() {
            ns.rm("achievements.txt") // Remove old file
            let doc = globalThis["document"]
            let list = []
            for (let achieve of doc.achievements) { list.push(achieve) }
            let data = list.sort((a, b) => a.localeCompare(b)).join("\n") // Sort and join the entries with newlines
            ns.write("achievements.txt", data, "w") // Write new file
        }
    }
}