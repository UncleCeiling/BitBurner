import { ANSI } from "imports/ANSI";

/** @param {NS} ns */
export async function main(ns) {
    let ram_up = ns.singularity.upgradeHomeRam()
    if (ram_up) { ns.tprint(`${ANSI.fg.green}Upgraded Home Ram to ${ns.getServer('home').maxRam} GB.${ANSI.reset}`) }
    else { ns.print(`${ANSI.fg.yellow}Not enough cash to upgrade Ram on 'home'.${ANSI.reset}`) }

    let cores_up = ns.singularity.upgradeHomeCores()
    if (cores_up) { ns.tprint(`${ANSI.fg.green}Upgraded Home Cores to ${ns.getServer('home').cpuCores} cores.${ANSI.reset}`) }
    else { ns.print(`${ANSI.fg.yellow}Not enough cash to upgrade Cores on 'home'.${ANSI.reset}`) }

    if (ns.singularity.exportGameBonus()) { ns.singularity.exportGame() }
}