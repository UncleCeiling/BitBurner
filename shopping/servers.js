import { ANSI } from "imports/ANSI";

/** @param {NS} ns */
export async function main(ns) {
    // Get info
    let servers = ns.getPurchasedServers()
    let limit = ns.getPurchasedServerLimit()
    let budget = ns.getServerMoneyAvailable('home')
    let minRam = Math.max(ns.getScriptRam('scripts/_hack.js'), ns.getScriptRam('scripts/_grow.js'), ns.getScriptRam('scripts/_weaken.js'))
    let buyRam = 1
    let maxRam = ns.getPurchasedServerMaxRam()
    // Recursively multiply buyRam by 2 until larger than minRam
    while (buyRam < minRam) {
        buyRam *= 2
        // If we somehow top out then something is very wrong
        if (buyRam > maxRam) {
            ns.tprint(`${ANSI.fg.red}RAM too large: Reduce size of mining scripts.${ANSI.reset}`)
            break
        }
    }
    // If less than the limit of servers are owned, buy more
    if (servers.length < limit) {
        let cost = ns.getPurchasedServerCost(buyRam)
        let serverNum = servers.length
        // Buy as many as we can
        while (budget > cost && serverNum < limit) {
            // Work out the name
            let serverName = `custom-${String(serverNum).padStart(2, '0')}`
            // Buy the server
            ns.purchaseServer(serverName, buyRam)
            ns.tprint(`${ANSI.fg.green}Bought ${buyRam}GB server: ${serverName} ($${cost})${ANSI.reset}`)
            // Refresh the budget & increment the server num
            budget = ns.getServerMoneyAvailable('home')
            serverNum++
        }
    }

    // Upgrade each server
    servers = ns.getPurchasedServers()
    if (servers.length == 0) { return }
    let success = false
    do {
        success = false
        for (let server of servers) {
            // Find out how much RAM the server has
            let currentRam = ns.getServerMaxRam(server)
            let usedRam = ns.getServerUsedRam(server)
            // If not using more than half the ram AND too many things running, skip this server
            if (usedRam <= currentRam / 2) { continue }
            // If at max RAM, skip this server
            if (currentRam >= ns.getPurchasedServerMaxRam()) { continue }
            // Find how much it will cost to get the next upgrade
            let upgradeCost = ns.getPurchasedServerUpgradeCost(server, currentRam * 2)
            // Refresh teh budget
            budget = ns.getServerMoneyAvailable('home')
            // If too expensive, skip this server
            if (upgradeCost > budget) { continue }
            // Buy upgrade
            success = ns.upgradePurchasedServer(server, currentRam * 2)
            ns.tprint(`${ANSI.fg.green}Upgraded ${server} from ${currentRam.toLocaleString()}GB to ${(currentRam * 2).toLocaleString()}GB ($${upgradeCost.toLocaleString()})${ANSI.reset}`)
        }
    } while (success)

    // Deploy foreman to each server
    for (let server of servers) {
        // Copy scripts to servers
        ns.scp(['scripts/_hack.js', 'scripts/_grow.js', 'scripts/_weaken.js'], server, 'home')
    }
}