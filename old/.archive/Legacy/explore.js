/** @param {NS} ns */
export async function main(ns) {
    ns.tprint('INFO - Launching Explorer - Safe travels')
    //Scan for servers
    var scannedList = []
    var toScan = ['home']
    while (toScan.length > 0) {
        toScan.forEach(function (current) {
            scannedList.push(current)
            toScan = toScan.concat(ns.scan(current))
            scannedList.forEach(function (remove) {
                toScan = toScan.filter(v => v !== remove)
            })
        })
        await ns.sleep(10)
    }
    //Fetch Details
    var scanned = [];
    scannedList.forEach(function (add) {
        scanned.push(ns.getServer(add))
    })
    //Root & backdoor
    var toRoot = []
    scanned.forEach(function (server) {
        if (server['hasAdminRights'] == false || server['backdoorInstalled'] == false) {
            if (server['purchasedByPlayer'] == undefined || server['purchasedByPlayer'] == false) {
                toRoot.push(server['hostname'])
            }
        }
    })
    for (const root of toRoot) {
        if (ns.getServerRequiredHackingLevel(root) < ns.getHackingLevel()) {
            ns.run('root.js', 1, root)
            await ns.sleep(1000)
        } else {
            ns.print('Skipping root of' + root)
        }
    }
    //Deploy
    var toDeploy = []
    scanned.forEach(function (server) {
        if (server['hostname'] !== 'home') {
            if ((ns.getServerMaxRam(server['hostname']) - ns.getServerUsedRam(server['hostname'])) >= (ns.getScriptRam('miner.js') + ns.getScriptRam('hack.js'))) {
                toDeploy.push(server['hostname'])
            }
        }
    })
    for (const deploy of toDeploy) {
        ns.run('deployer.js', 1, deploy)
        await ns.sleep(100)
    }
    ns.tprint('INFO - Network has been Explored - Rooters and Deployers have been dispatched')
    //HomeHelp
    ns.singularity.connect('home')
    ns.spawn('home.js')
}