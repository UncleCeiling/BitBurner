/** @param {NS} ns */
export async function main(ns) {
    let purchasedServers = ns.getPurchasedServers()
    if (purchasedServers.length <= 0) { ns.tprint('ERROR - No Purchased Servers'); return }
    let serverDetails = []
    for (let pServer of purchasedServers) {
        serverDetails.push(ns.getServer(pServer))
    }
    let data = []
    for (let server of serverDetails) {
        let name = server["hostname"]
        let capacity = Number(server["maxRam"])
        data.push(`${name}: ${capacity.toLocaleString()} GB`)
    }
    ns.rm('servers.txt')
    ns.write('servers.txt', data.join('\n'), 'w')
    // ns.tprint('\n' + data.join('\n'))
}