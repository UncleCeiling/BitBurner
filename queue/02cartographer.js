/** @param {NS} ns */
export async function main(ns) {
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
        if (server['hasAdminRights'] == false) {
            if (server['purchasedByPlayer'] == undefined || server['purchasedByPlayer'] == false) {
                toRoot.push(server['hostname'])
            }
        }
    })
    if (toRoot.length > 0) {
        ns.tprint(`INFO - ${Math.floor(((scanned.length - toRoot.length) / scanned.length) * 100)}% of servers rooted.`)
        // Root root-able servers
        for (let root of toRoot) {
            if (ns.getServerRequiredHackingLevel(root) <= ns.getHackingLevel()) {
                if (ns.isRunning('scripts/root.js', 'home', root)) {
                    ns.print(`INFO - Already rooting ${root}`)
                } else {
                    ns.print(`INFO - Rooting ${root}.`)
                    ns.run('scripts/root.js', 1, root)
                }
            } else {
                ns.print(`WARN - Skipping ${root}. (Needs hacking level ${ns.getHackingLevel()}))`)
            }
        }
        // await ns.asleep(1000)
    } else {
        ns.print(`INFO - All ${scanned.length} servers have been rooted.`)
    }
    // Build list of servers to backdoor
    let toBackdoor = []
    scanned.forEach(function (server) {
        if (!server['backdoorInstalled'] && server['asAdminRights']) {
            if (server['purchasedByPlayer'] == undefined || server['purchasedByPlayer'] == false) {
                toBackdoor.push(server)
            }
        }
    })
    // Deploy backdoor
    for (let target in toBackdoor) {
        if (ns.isRunning('scripts/backdoor.js', 'home', target)) {
            ns.print(`WARN - Backdoor already running on ${target}`)
        } else {
            ns.run('./backdoor.js', 1, target)
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
    ns.rm('mines.txt', 'home')
    ns.write('mines.txt', toMine.join('\n'), 'w')
    ns.tprint(`INFO - Updated 'mines.txt' with ${toMine.length} entries.`)
    // Run miner if miner not running
    if (ns.isRunning('scripts/miner.js', 'home') == false) { // Check to see if the script is still running
        ns.tprint('SUCCESS - Launching Miner on `home')
        ns.run('scripts/miner.js', 1)
    }
    // Run `home` foreman if note running
    if (ns.isRunning('scripts/foreman.js', 'home') == false && ns.getServerMaxRam('home') > 64) { // Check to see if the script is still running
        ns.tprint('SUCCESS - Launching Foreman on `home`')
        ns.run('scripts/foreman.js', 1)
    }
    ns.run('scripts/mapper.js', 1)
}