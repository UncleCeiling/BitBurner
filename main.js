/** @param {NS} ns */
export async function main(ns) {
    let queue_loc = 'queue/' // Location of the files to be run
    let argument = ns.args[0]
    let break_secs = 60 // How long to wait between cycles
    if (argument > 0) {
        break_secs = argument
    }
    while (true) {
        let scripts = ns.ls('home', queue_loc) // Update queue
        ns.tprint(`INFO - Found ${scripts.length} scripts.`) // Write to log
        for (let script of scripts) {
            if (script == 'queue/01darkweb.js' && ns.fileExists('Formulas.exe', 'home')) {
                ns.tprint('INFO - Skipping 01darkweb.js')
                continue
            }
            ns.tprint(`INFO - Running ${script.replace(queue_loc, '')}`)
            await ns.run(script) // Run the script
            await ns.asleep(1000) // Wait
            while (ns.isRunning(script)) { // Check to see if the script is still running
                await ns.asleep(1000) // Wait
            }
        }
        ns.tprint(`INFO - Taking a break for ${break_secs} seconds.`)
        await ns.asleep(break_secs * 1000) // Pause for a bit
    }
}