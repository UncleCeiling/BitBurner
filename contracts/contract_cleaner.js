/** @param {NS} ns */
export async function main(ns) {
    ns.disableLog("ALL")
    ns.ui.openTail()
    let servers = new Set(['home'])
    // for (let server of servers) { for (let result of ns.scan(server)) { servers.add(result) } }
    for (let server of servers) {
        let contracts = ns.ls(server, '.cct')
        if (contracts.length == 0) { continue }
        ns.print(server)
        for (let file of contracts) {
            if (ns.rm(file, server)) { ns.print(`SUCCESS - Deleted ${file} from ${server}`) }
            else { ns.print(`FAIL - Could not delete ${file} from ${server}`) }
        }
    }
}