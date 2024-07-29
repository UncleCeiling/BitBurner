/** @param {NS} ns */
export async function main(ns) {
    let queue_loc = 'queue/' // Location of the files to be run
    let break_secs = 60 // How long to wait between cycles
    while (true) {
        let scripts = ns.ls('home', queue_loc) // Update queue
        ns.print(`INFO - Found ${scripts.length} scripts.`) // Write to log
        for (let x in scripts) {
            ns.print(`INFO - Running ${scripts[x].replace(queue_loc, '')}`)
            let path = './' + scripts[x] // Make the path string
            await ns.run(path) // Run the script
            await ns.asleep(1000) // Wait
            while (ns.isRunning(path)) { // Check to see if the script is still running
                await ns.asleep(1000) // Wait
            }
        }
        ns.tprint(`INFO - Taking a break for ${break_secs} seconds.`)
        await ns.asleep(break_secs * 1000) // Pause for a bit
    }
}