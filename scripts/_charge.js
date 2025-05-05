/** @param {NS} ns */
export async function main(ns) {
    let x = ns.args[0]
    let y = ns.args[1]
    if (x == null || x == null) {
        ns.tprint(`FAILED - Cannot charge - Arguments not given.`)
    } else {
        await ns.stanek.chargeFragment(x, y)
    }
}
