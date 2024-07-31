/** @param {NS} ns */
export async function main(ns) {
    // Get info
    let servers = ns.getPurchasedServers()
    let limit = ns.getPurchasedServerLimit()
    let budget = ns.getServerMoneyAvailable('home')
    // Calculate minRam and how much RAM to buy
    let minRam = ns.getScriptRam('scripts/foreman.js') + Math.max(ns.getScriptRam('scripts/_hack.js'), ns.getScriptRam('scripts/_grow.js'), ns.getScriptRam('scripts/_weaken.js'))
    let buyRam = 1
    let maxRam = ns.getPurchasedServerMaxRam()
    while (buyRam < minRam) {
        buyRam *= 2
        if (buyRam > maxRam) {
            ns.print(`ERROR - minRam too large: reduce size of foreman/mining scripts`)
            break
        }
    }
    // If less than the limit of servers are owned, buy more
    if (servers.length < limit) {
        let minCost = ns.getPurchasedServerCost(buyRam)
        let server = servers.length
        if (budget > minCost) {
            while (budget > minCost && server < limit) {
                let serverName = `custom-${String(server).padStart(2, '0')}`
                ns.purchaseServer(serverName, buyRam)
                ns.tprint(`SUCCESS - Bought ${buyRam}GB server: ${serverName} ($${minCost})`)
                server++
                budget = ns.getServerMoneyAvailable('home')
            }
        }
    }
    // Upgrade each server
    servers = ns.getPurchasedServers()
    for (let server of servers) {
        let currentRam = ns.getServerMaxRam(server)
        if (currentRam < ns.getPurchasedServerMaxRam()) {
            let upgradeCost = ns.getPurchasedServerUpgradeCost(server, currentRam * 2)
            budget = ns.getServerMoneyAvailable('home')
            if (upgradeCost <= budget) {
                ns.upgradePurchasedServer(server, currentRam * 2)
                ns.tprint(`SUCCESS - Upgraded ${server} from ${currentRam.toLocaleString()}GB to ${(currentRam * 2).toLocaleString()}GB ($${upgradeCost.toLocaleString()})`)
            }
        }
    }
    // Deploy foreman to each server
    servers = ns.getPurchasedServers()
    for (let server of servers) {
        // Copy scripts to servers
        ns.scp(['scripts/foreman.js', 'scripts/_hack.js', 'scripts/_grow.js', 'scripts/_weaken.js', 'mines.txt'], server, 'home')
        // If foreman isn't running, run it
        if (ns.isRunning('scripts/foreman.js', server) !== true) {
            ns.exec('scripts/foreman.js', server)
            ns.tprint(`SUCCESS - Started Foreman on ${server}`)
        }
    }
}