/** @param {NS} ns */
export async function main(ns) {
    const SCRIPTS = [
        'bladeburner_skills.js',
        'darkweb.js',
        'housekeeping.js',
        'gang_equipment.js',
        'sleeve_augments.js',
        'hacknet.js',
        'servers.js',
        'hashes.js',
    ]
    const SCRIPT_LOC = 'shopping/'
    for (let script of SCRIPTS) {
        let path = `${SCRIPT_LOC}${script}`
        ns.print(`INFO - Running ${script}`)
        ns.run(path)
        // Give it a second
        await ns.asleep(1000)
        // Don't continue until the script is finished
        while (ns.isRunning(path)) {
            await ns.asleep(1000)
        }
    }
}