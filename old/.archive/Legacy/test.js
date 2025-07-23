/** @param {NS} ns */
export async function main(ns) {
    var test = ns.getServer('myServer-0')
    ns.tprint(test)
    ns.tprint('is rooted = ' + test['hasRootAccess'])
    ns.tprint('is Backdoored = ' + test['backdoorInstalled'])
}