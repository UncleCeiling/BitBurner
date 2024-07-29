/** @param {NS} ns */
export async function main(ns) {
    ns.tprint('INFO - Managing Servers and Server Upgrades.')
    // Initialise
    var servers = 0
    var nextCost = 0
    var budget = ns.getServerMoneyAvailable('home')
    var currentRam = 0
    var query = 2
    var found = false
    var nextRam = 0
    if (ns.serverExists('myServer-0')) {
        currentRam = (ns.getServerMaxRam('myServer-0'))
        while (found == false) {
            nextCost = (ns.getPurchasedServerCost(currentRam * query) * 25)
            if (nextCost >= budget) {
                query = query / 2
                found = true
            } else {
                query = query * 2
            }
        }
        ns.print('Next Ram = ' + (currentRam * query))
        nextRam = currentRam * query
        nextCost = (ns.getPurchasedServerCost(nextRam) * 25)
        if ((nextCost < budget) && nextRam !== currentRam) {
            ns.getPurchasedServers().forEach(function (current) {
                ns.killall(current)
            })
            await ns.sleep(5000)
            while (servers < 25) {
                ns.deleteServer('myServer-' + servers)
                await ns.sleep(500)
                ns.purchaseServer('myServer-' + servers, nextRam)
                servers++
            }
            ns.tprint('SUCCESS - Servers upgraded to ' + nextRam + 'GB each')
        } else {
            ns.tprint('ERROR - Not enough cash to upgrade servers - need $' + (ns.getPurchasedServerCost(nextRam * 2) * 25))
        }
    } else {
        nextCost = (ns.getPurchasedServerCost(1) * 25)
        if (nextCost < budget) {
            while (servers < 25) {
                ns.purchaseServer('myServer-' + servers, 1)
                servers++
            }
            ns.tprint('SUCCESS - Bought servers')
        } else {
            ns.tprint('ERROR - Not enough cash to buy servers')
        }
    }
    ns.spawn('darkweb.js')
}