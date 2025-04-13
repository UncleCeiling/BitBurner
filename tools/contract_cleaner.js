/** @param {NS} ns */
export async function main(ns) {
    let servers = new Set(['home'])
    for (let server of servers) { for (let result of ns.scan(server)) { servers.add(result) } }
    ns.print(servers)
    for (let server of servers) {
        ns.print(server)
        let contracts = ns.ls(server, '.cct')
        ns.print(contracts)
        if (contracts.length == 0) { continue }
        for (let file of contracts) {
            ns.print(file)
            if (ns.rm(file, server)) { ns.tprint(`SUCCESS - Deleted ${file} from ${server}`) }
            else { ns.tprint(`FAIL - Could not delete ${file} from ${server}`) }
        }
    }
}