/** @param {NS} ns */
export async function main(ns) {
    var target = ns.args[0]
    var nearby = ns.scan(target)
    var precursor = []
    nearby.forEach(function (backdoorCheck) {
        if (ns.getServer(backdoorCheck).backdoorInstalled == true) {
            precursor.push(backdoorCheck)
        }
    })
    if (precursor.length >= 1) {
        ns.singularity.connect(precursor[0])
        ns.singularity.connect(target)
        await ns.singularity.installBackdoor()
        ns.tprint('SUCCESS - Installed Backdoor on ' + target)
    } else {
        ns.tprint('FAIL - No adjacent backdoor to ' + target)
    }
}