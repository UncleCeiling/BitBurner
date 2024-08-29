/** @param {NS} ns */
export async function main(ns) {
    if (ns.singularity.upgradeHomeRam()) { ns.tprint(`SUCCESS - Upgraded Home Ram to ${ns.getServer('home').maxRam}`) }
    else { ns.print(`WARN - Not enough cash to upgrade Ram on 'home'.`) }

    if (ns.singularity.upgradeHomeCores()) { ns.tprint(`SUCCESS - Upgraded Home Cores to ${ns.getServer('home').cpuCores}`) }
    else { ns.print(`WARN - Not enough cash to upgrade Cores on 'home'.`) }

    if (ns.singularity.exportGameBonus()) { ns.singularity.exportGame() }
}