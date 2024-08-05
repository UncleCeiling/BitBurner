/** @param {NS} ns */
export async function main(ns) {
    let target = ns.args[0]
    let nearby = ns.scan(target)
    let precursor = []
    for (let server of nearby) {
        if (ns.getServer(server)['backdoorInstalled'] == true) {
            precursor.push(server)
        }
    }
    if (precursor.length >= 1) {
        ns.singularity.connect(precursor[0])
        ns.singularity.connect(target)
        ns.tail()
        ns.tprint(`SUCCESS - Starting backdoor on ${target}`)
        await ns.singularity.installBackdoor()
        ns.tprint(`SUCCESS - Installed Backdoor on ${target}`)
        ns.closeTail()
        ns.singularity.connect('home')
    } else {
        ns.tprint(`WARN - Skipping Backdoor on ${target}. No adjacent backdoors:\n\t\t\t${ns.scan(target).join(' | ')}`)
    }
}