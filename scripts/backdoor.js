/** @param {NS} ns */
export async function main(ns) {
    let target = ns.args[0]
    let nearby = ns.scan(target)
    let precursor = []
    nearby.forEach(function (backdoorCheck) {
        if (ns.getServer(backdoorCheck).backdoorInstalled == true) {
            precursor.push(backdoorCheck)
        }
    })
    if (precursor.length >= 1) {
        ns.singularity.connect(precursor[0])
        ns.singularity.connect(target)
        ns.tprint(`SUCCESS - Starting backdoor on ${target}`)
        await ns.singularity.installBackdoor()
        ns.tprint(`SUCCESS - Installed Backdoor on ${target}`)
    } else {
        ns.tprint(`WARN - Skipping Backdoor on ${target}. No adjacent backdoors:\n${ns.scan(target).join(' | ')})`)
    }
    ns.singularity.connect('home')
}