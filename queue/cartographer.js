/** @param {NS} ns */
export async function main(ns) {
    ns.tprint('INFO - Mapping network.')
    // Build list of servers
    let scannedList = []
    let toScan = ['home']
    while (toScan.length > 0) {
        toScan.forEach(async function (current) {
            scannedList.push(current)
            toScan = toScan.concat(ns.scan(current))
            scannedList.forEach(function (remove) {
                toScan = toScan.filter(v => v !== remove)
            })
        })
        await ns.asleep(10)
    }
    // Fetch server details
    let scanned = []
    scannedList.forEach(function (add) {
        scanned.push(ns.getServer(add))
    })
    // Build list of servers to root
    let toRoot = []
    scanned.forEach(function (server) {
        if (server['hasAdminRights'] == false || server['backdoorInstalled'] == false) {
            if (server['purchasedByPlayer'] == undefined || server['purchasedByPlayer'] == false) {
                toRoot.push(server['hostname'])
            }
        }
    })
    ns.tprint(`WARN - Found ${scanned.length} servers. ${toRoot.length} servers need rooting.`)
    // Root root-able servers
    for (let root of toRoot) {
        if (ns.getServerRequiredHackingLevel(root) <= ns.getHackingLevel()) {
            ns.print(`INFO - Rooting ${root}.`)
            ns.run('../scripts/root.js', 1, root)
            await ns.asleep(1000)
        } else {
            ns.print(`WARN - Skipping ${root}. (Needs hacking level ${ns.getHackingLevel()}))`)
        }
    }
    // Make list of minable servers
    let toMine = []
    scanned.forEach(function (server) {
        if (server['hostname'] !== 'home') {
            let currentRam = (ns.getServerMaxRam(server['hostname']) - ns.getServerUsedRam(server['hostname']))
            ns.print(`${server['hostname']} RAM: ${currentRam}`)
            let scriptRam = Math.max(ns.getScriptRam('scripts/hack.js', 'home'), ns.getScriptRam('scripts/grow.js', 'home'), ns.getScriptRam('scripts/weaken.js', 'home'))
            ns.print(`Script RAM: ${scriptRam}`)
            if (currentRam >= scriptRam) {
                let rooted = ns.getServer(server['hostname'])['hasAdminRights']
                if (rooted && !server['hostname'].includes('custom-')) {
                    toMine.push(server['hostname'])
                }
            }
        }
    })
    // Create/update the list of mine-able servers
    ns.tprint(`WARN - Updated 'mines.txt' with ${toMine.length} entries.`)
    ns.write('mines.txt', toMine.join('\n'), 'w')
    // Run miner if miner not running
    if (ns.isRunning('scripts/miner.js', 'home') == false) { // Check to see if the script is still running
        ns.tprint('SUCCESS - Launching Miner')
        ns.run('scripts/miner.js', 1)
    }
}