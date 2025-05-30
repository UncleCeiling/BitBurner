import { ANSI } from "imports/ANSI"

/** @param {NS} ns */
export async function main(ns) {
    const SCRIPTS = [
        'hashes.js',
        'darkweb.js',
        'housekeeping.js',
        'hacknet.js',
        'servers.js',
        'sleeve_augments.js',
        'gang_equipment.js',
        'bladeburner_skills.js',
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