/** @param {NS} ns */
export async function main(ns) {
    var servers = ns.getPurchasedServers()
    for (let server of servers) {
        ns.killall(server)
        ns.deleteServer(server)
        ns.tprint(`Deleted ${server}`)
    }
}