/** @param {NS} ns */
export async function main(ns) {
    const SCRIPTS = [
        'housekeeping.js',
        'darkweb.js',
        'gang_equipment.js',
        'servers.js',
        'hacknet.js',
        'hashes.js',
    ]
    const SCRIPT_LOC = 'scripts/'
    for (let script of SCRIPTS) {
        let path = `${SCRIPT_LOC}${script}`
        ns.tprint(`INFO - Running ${script}`)
        await ns.run(path)
        // Give it a second
        await ns.asleep(1000)
        // Don't continue until the script is finished
        while (ns.isRunning(path)) {
            await ns.asleep(1000)
        }
    }
}