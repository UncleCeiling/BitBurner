/** @param {NS} ns */
export async function main(ns) {
    var servers = ns.getPurchasedServers()
    servers.forEach(function (current) {
        ns.killall(current)
        ns.deleteServer(current)
        ns.tprint(`Deleted ${current}`)
    })
}