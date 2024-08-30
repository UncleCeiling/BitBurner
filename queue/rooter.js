/** @param {NS} ns */
export async function main(ns) {
    // Build list of servers
    let servers = new Set(['home'])
    for (let server of servers) {
        for (let result of ns.scan(server)) {
            if (result.includes('custom-')) { continue }
            servers.add(result)
        }
    }
    let serverDetails = []
    for (let server of servers) {
        serverDetails.push(ns.getServer(server))
    }
    // Build list of servers to root
    let toRoot = []
    for (let server of serverDetails) {
        // Skip rooted and custom servers
        if (server['hasAdminRights'] || server['hostname'].includes('custom-')) { continue }
        // Add the rest to the list
        toRoot.push(server['hostname'])
    }

    // Root anything in the list
    if (toRoot.length > 0) {
        // Report Progress
        let total = serverDetails.length
        let rooted = total - toRoot.length
        let percent = Math.floor((rooted / total) * 100)
        ns.tprint(`INFO - ${rooted}/${total} (${percent}%) servers rooted so far.`)
        // Root root-able servers
        for (let root of toRoot) {
            // Skip servers that are too hard
            let required = ns.getServerRequiredHackingLevel(root)
            if (required > ns.getHackingLevel()) { ns.print(`WARN - Skipping ${root}. (Needs hacking level ${required})`); continue }
            // Skip if root is already running
            if (ns.isRunning('scripts/root.js', 'home', root)) { ns.print(`INFO - Already rooting ${root}`); continue }
            ns.run('scripts/root.js', 1, root)
            ns.print(`INFO - Rooting ${root}.`)
            // Give it 0.1 seconds to do it's thing
            await ns.asleep(100)
        }
    }
    // Otherwise, report all-clear
    else { ns.tprint(`INFO - All ${serverDetails.length} servers have been rooted.`) }


    // Make list of minable servers
    let mines = []
    let miners = []
    for (let server of serverDetails) {
        let rooted = server['hasAdminRights']
        let isCustom = server['hostname'].includes('custom-')
        let currentRam = (ns.getServerMaxRam(server['hostname']) - ns.getServerUsedRam(server['hostname']))
        let scriptRam = Math.max(ns.getScriptRam('scripts/hack.js', 'home'), ns.getScriptRam('scripts/grow.js', 'home'), ns.getScriptRam('scripts/weaken.js', 'home'))
        let miner = true
        let mine = true
        if (!rooted || isCustom) { continue } // Skip unrooted and Custom servers
        if (currentRam < scriptRam || server['hostname'] == 'home') { miner = false } // Can't be a miner
        if (server['moneyMax'] == 0) { mine = false }
        if (mine) { mines.push(server['hostname']) }
        if (miner) { miners.push(server['hostname']) }

    }

    // Create/update the list of mine-able servers
    ns.rm('mines.txt', 'home')
    ns.write('mines.txt', mines.join('\n'), 'w')
    ns.print(`INFO - Updated 'mines.txt' with ${mines.length} entries.`)
    ns.print(mines)
    // Create/update the list of miner servers
    ns.rm('miners.txt', 'home')
    ns.write('miners.txt', miners.join('\n'), 'w')
    ns.print(`INFO - Updated 'miners.txt' with ${miners.length} entries.`)
    ns.print(miners)
}