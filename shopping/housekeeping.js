import { ANSI } from "imports/ANSI";
/** @param {NS} ns */
export async function main(ns) {
    ns.disableLog("ALL")
    let ram_limit = Infinity
    let core_limit = Infinity
    let achievements = ns.read("achievements.txt").split("\n")
    if (ns.getResetInfo().currentNode == 1 && !achievements.includes("CHALLENGE_BN1")) { // If in BitNode 1 and achievement not got  limit RAM and Cores
        ns.tprint(`${ANSI.fg.magenta}BitNode 1 detected - limiting RAM and Cores for achievement.${ANSI.reset}`);
        ram_limit = 128;
        core_limit = 1;
    }
    while (ns.getServer("home").maxRam <= ram_limit) { // Upgrade Ram to limit
        if (ns.singularity.upgradeHomeRam()) { ns.tprint(`${ANSI.fg.green}Upgraded Home Ram to ${ns.getServer('home').maxRam} GB.${ANSI.reset}`) } else { break }
    }
    while (ns.getServer("home").cpuCores <= core_limit) { // Upgrade Cores to limit
        if (ns.singularity.upgradeHomeCores()) { ns.tprint(`${ANSI.fg.green}Upgraded Home Cores to ${ns.getServer('home').cpuCores} cores.${ANSI.reset}`) } else { break }
    }
    if (ns.singularity.exportGameBonus()) { ns.singularity.exportGame() } // Get export bonus
}