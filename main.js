import { ANSI } from "imports/ANSI"

/** @param {NS} ns */
export async function main(ns) {
    const QUEUE_LOC = 'queue/'
    const ARGUMENT = ns.args[0]
    var break_secs = 60
    if (ARGUMENT != null && typeof ARGUMENT != Number) { ns.tprint(`${ANSI.fg.red}${ARGUMENT} is not a valid argument (must be an integer > 0)${ANSI.reset}`); return } else if (ARGUMENT != null && ARGUMENT > 0) { break_secs = ARGUMENT } // Set break time if set
    ns.rm("mines.txt")
    ns.rm("miners.txt")
    while (true) {
        map()
        server_stats()
        await queue() // Run scripts in `queue/` folder
        ns.tprint(`${ANSI.fg.magenta}Taking a break for ${break_secs} seconds.${ANSI.reset}`)
        await ns.asleep(break_secs * 1000)// Pause for a bit

        async function queue() {
            var scripts = ns.ls('home', QUEUE_LOC)// Fetch scripts and flag from queue
            ns.print(`${ANSI.fg.cyan}Found ${scripts.length} scripts.${ANSI.reset}`)
            for (let script of scripts.sort(() => Math.random() - 0.5)) { // For shuffled
                if (ns.isRunning(script)) { continue }// Skip script if already running
                while (ns.getScriptRam(script) > (ns.getServerMaxRam("home") - ns.getServerUsedRam("home"))) { await ns.asleep(1000) }
                ns.tprint(`${ANSI.fg.magenta}${ANSI.font.underline}Running ${script.replace(QUEUE_LOC, '')}${ANSI.reset}`)
                ns.run(script)
                await ns.asleep(1000) // Give it a second
            }
        }

        function map() {
            ns.rm('map.txt', 'home') // Remove the old map
            var servers = new Set() // I know this is icky
            var map_data = [] // I'm so sorry
            map_servers('home', 0) // I'll fix this awful recursion some other time
            ns.write('map.txt', map_data.join('\n'), 'w') // Write the new one
            ns.tprint(`${ANSI.fg.magenta}Wrote ${map_data.length} lines to 'map.txt'${ANSI.reset}`) // Report
            /**
             * Recursively builds a map of the network, storing it in `var servers` and `var map_data`
             * @param {String} server 
             * @param {Number} depth 
             */
            function map_servers(server, depth) { // Icky recursion using variables outside the function :(
                if (server.includes("custom-") || server.includes("darkweb") || server.includes("hacknet-server-")) { return } // Don't mess with special servers
                let current = ns.getServer(server) // Get current server's info
                map_data.push(`${'|>'.padStart((depth * 2), '| ')}${current.hasAdminRights ? "R" : "X"}${current.backdoorInstalled ? "B" : "X"} \`${current.hostname}\` ${current.requiredHackingSkill}`) // Add this server's data to the map_data
                depth++ // increment depth
                let children = new Set(ns.scan(current.hostname)) // Make a list of the children of this server (filtering out servers we've already checked)
                servers.add(current.hostname) // Add this server to the set of lists we've already checked
                if (children.length == 0) { return }
                for (let child of children) { if (!servers.has(child)) { map_servers(child, depth) } } // Map all the children
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

    }
}