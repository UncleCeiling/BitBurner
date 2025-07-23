/** @param {NS} ns */
export async function main(ns) {
    let host = ns.getHostname()
    while (ns.getServerMoneyAvailable(host) > 1000) {
        await ns.hack(host)
    }
}