/** @param {NS} ns */
export async function main(ns) {
    let ram_up = ns.singularity.upgradeHomeRam()
    if (ram_up) { ns.tprint(`SUCCESS - Upgraded Home Ram to ${ns.getServer('home').maxRam}`) }
    else { ns.tprint(`WARN - Not enough cash to upgrade Ram on 'home'.`) }

    let cores_up = ns.singularity.upgradeHomeCores()
    if (cores_up) { ns.tprint(`SUCCESS - Upgraded Home Cores to ${ns.getServer('home').cpuCores}`) }
    else { ns.tprint(`WARN - Not enough cash to upgrade Cores on 'home'.`) }

    if (ns.singularity.exportGameBonus()) { ns.singularity.exportGame() }
}