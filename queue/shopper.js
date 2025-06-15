import { ANSI } from "imports/ANSI"

/** @param {NS} ns */
export async function main(ns) {
    const SCRIPTS = [
        'bladeburner_skills.js',
        'hashes.js',
        'darkweb.js',
        'player_augments.js',
        'housekeeping.js',
        'servers.js',
        'hacknet.js',
        'sleeve_augments.js',
        'gang_equipment.js',
    ]
    const SCRIPT_LOC = 'shopping/'
    for (let script of SCRIPTS) {
        let path = `${SCRIPT_LOC}${script}`
        ns.print(`${ANSI.fg.cyan}Running ${script}${ANSI.reset}`)
        ns.run(path)
        // Don't continue until the script is finished
        while (ns.isRunning(path)) {
            await ns.asleep(1000)
        }
    }
}