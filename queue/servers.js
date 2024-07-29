/** @param {NS} ns */
export async function main(ns) {
    // Get info
    let servers = ns.getPurchasedServers()
    let limit = ns.getPurchasedServerLimit()
    let budget = ns.getServerMoneyAvailable('home')
    // If less than the limit of servers are owned, buy more
    if (servers.length < limit) {
        let diff = servers.length - limit
        let minCost = ns.getPurchasedServerCost(4)
        if ((minCost * diff) > budget) {
            ns.tprint(`ERROR - ${diff} x $${minCost} = $${minCost * diff}`)
        } else {
            for (let server = servers.length; server <= limit; server++) {
                ns.purchaseServer(`custom-${server}`, 4)
            }
        }
    }
    // Upgrade each server
    servers = ns.getPurchasedServers()
    for (let server of servers) {
        let currentRam = ns.getServerMaxRam(server)
        if (currentRam < ns.getPurchasedServerMaxRam()) {
            let upgradeCost = ns.getPurchasedServerUpgradeCost(server, currentRam ** 2)
            budget = ns.getServerMoneyAvailable('home')
            if (upgradeCost <= budget) { ns.upgradePurchasedServer(server, currentRam ** 2) }
        }
    }
    // Deploy foreman to each server
    servers = ns.getPurchasedServers()
    for (let server of servers) {
        ns.scp(['scripts/foreman.js', 'scripts/_hack.js', 'scripts/_grow.js', 'scripts/_weaken.js', 'mines.txt'], server, 'home')
        if (ns.isRunning('scripts.foreman.js', server) !== true) {
            ns.exec('scripts/foreman.js', server)
        }
    }

}