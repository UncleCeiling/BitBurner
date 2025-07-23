/** @param {NS} ns */
export async function main(ns) {
    var target = ns.args[0]
    if (target == '' || target == null) {
        ns.tprint('Cannot hack - No args given')
    } else {
        await ns.hack(target)
    }
}