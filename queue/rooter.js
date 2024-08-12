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
    let toMine = []
    for (let server of serverDetails) {
        // Skip 'home' and servers with no money
        if (server['hostname'] == 'home') { continue }
        if (server['moneyMax'] == 0) { continue }
        // Skip unrooted and custom servers
        let rooted = server['hasAdminRights']
        let isCustom = server['hostname'].includes('custom-')
        if (!rooted || isCustom) { continue }
        // Skip servers without enough RAM to mine
        let currentRam = (ns.getServerMaxRam(server['hostname']) - ns.getServerUsedRam(server['hostname']))
        let scriptRam = Math.max(ns.getScriptRam('scripts/hack.js', 'home'), ns.getScriptRam('scripts/grow.js', 'home'), ns.getScriptRam('scripts/weaken.js', 'home'))
        if (currentRam < scriptRam) { continue }
        // Add what is left to the list
        toMine.push(server['hostname'])
    }

    // Create/update the list of mine-able servers
    ns.rm('mines.txt', 'home')
    ns.write('mines.txt', toMine.join('\n'), 'w')
    ns.print(`INFO - Updated 'mines.txt' with ${toMine.length} entries.`)

    // Run miner if miner not running
    if (!ns.isRunning('scripts/miner.js', 'home')) {
        ns.run('scripts/miner.js', 1)
        ns.tprint('SUCCESS - Launching Miner on `home`')
    }

    // Run `home` foreman if not running and have more than 64GB of RAM
    if (!ns.isRunning('scripts/foreman.js', 'home') && ns.getServerMaxRam('home') > 64) {
        ns.run('scripts/foreman.js', 1)
        // ns.tprint('SUCCESS - Launching Foreman on `home`')
    }
}