import { ANSI } from "imports/ANSI"
import * as util from "imports/utils"
/** @param {NS} ns */
export async function main(ns) {
    ns.disableLog("ALL")
    const QUEUE_LOC = 'queue/'
    const ARGUMENT = ns.args[0]
    var break_secs = 10
    if (ARGUMENT != null && typeof ARGUMENT != Number) { ns.tprint(`${ANSI.fg.red}${ARGUMENT} is not a valid argument (must be an integer > 0)${ANSI.reset}`); return } else if (ARGUMENT != null && ARGUMENT > 0) { break_secs = ARGUMENT } // Set break time if set
    ns.rm("mines.txt")
    ns.rm("miners.txt")
    while (true) {
        if (!ns.fileExists("b1t_flum3.exe", "home")) { ns.singularity.createProgram("b1t_flum3.exe", true); await ns.singularity.getCurrentWork().completion }
        if (!ns.fileExists("NUKE.exe", "home")) { ns.singularity.createProgram("NUKE.exe", true); await ns.singularity.getCurrentWork().completion }
        util.write_map(ns)
        server_stats()
        achievements()
        await queue() // Run scripts in `queue/` folder
        ns.print(`${ANSI.fg.magenta}Taking a break for ${break_secs} seconds.${ANSI.reset}`)
        await ns.asleep(break_secs * 1000)// Pause for a bit

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
            ns.rm('server_stats.txt') // Remove old file
            var servers = ns.getPurchasedServers() // Get servers
            if (servers.length <= 0) { ns.tprint(`${ANSI.fg.yellow}No Purchased Servers${ANSI.reset}`); return } // Can't map what doesn't exist
            let data = servers.map((a) => `${ns.getServer(a).hostname}: ${ns.getServer(a).maxRam.toLocaleString()} GB`) // Turn servers into string to add to file
            ns.write('server_stats.txt', data.join('\n'), 'w') // Write new file
            ns.tprint(`${ANSI.fg.magenta}Wrote ${data.length} lines to 'server_stats.txt'${ANSI.reset}`)
        }

        function achievements() {
            ns.rm("achievements.txt") // Remove old file
            let doc = globalThis["document"]
            let list = []
            for (let achieve of doc.achievements) { list.push(achieve) }
            let data = list.sort((a, b) => a.localeCompare(b)).join("\n") // Sort and join the entries with newlines
            ns.write("achievements.txt", data, "w") // Write new file
        }
    }
}