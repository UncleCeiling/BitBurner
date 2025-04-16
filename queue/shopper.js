/** @param {NS} ns */
export async function main(ns) {
    const SCRIPTS = [
        'hashes.js',
        'housekeeping.js',
        'darkweb.js',
        'gang_equipment.js',
        'servers.js',
        'hacknet.js',
        'bladeburner_skills.js',
    ]
    const SCRIPT_LOC = 'scripts/'
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