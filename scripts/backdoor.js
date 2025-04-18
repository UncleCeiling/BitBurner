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
    if (target == "w0r1d_d43m0n") { ns.toast("w0r1d_d43m0n ready for Backdoor", "error", null) }
    if (precursor.length >= 1) {
        ns.singularity.connect(precursor[0])
        ns.singularity.connect(target)
        ns.ui.openTail()
        ns.tprint(`SUCCESS - Starting backdoor on ${target}`)
        await ns.singularity.installBackdoor()
        ns.tprint(`SUCCESS - Installed Backdoor on ${target}`)
        ns.ui.closeTail()
        ns.singularity.connect('home')
    } else {
        ns.tprint(`WARN - Skipping Backdoor on ${target}. No adjacent backdoors:\n\t\t\t${ns.scan(target).join(' | ')}`)
    }
}