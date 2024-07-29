/** @param {NS} ns */
export async function main(ns) {
    let target = ns.args[0]
    if (target == '' || target == null) {
        ns.tprint('Cannot weaken - No args given')
    } else {
        await ns.weaken(target)
    }
}