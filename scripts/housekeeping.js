/** @param {NS} ns */
export async function main(ns) {
    while (ns.singularity.upgradeHomeRam()) {
        ns.tprint(`SUCCESS - Upgraded Home Ram to ${ns.getServer('home').maxRam}`)
    }
    while (ns.singularity.upgradeHomeCores()) {
        ns.tprint(`SUCCESS - Upgraded Home Cores to ${ns.getServer('home').cpuCores}`)
    }
    if (ns.singularity.exportGameBonus()) { ns.singularity.exportGame() }
}