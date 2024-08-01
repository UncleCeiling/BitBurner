/** @param {NS} ns */
export async function main(ns) {
    // Location of the files to be run
    let queue_loc = 'queue/'
    let argument = ns.args[0]
    let break_secs = 60
    // Set break to argument if there is one
    if (argument > 0) {
        break_secs = argument
    }
    // Loop forever
    while (true) {
        // Fetch scripts from queue
        let scripts = new Set(ns.ls('home', queue_loc))
        ns.tprint(`INFO - Found ${scripts.length} scripts.`)
        // Remove darkweb.js if all items bought
        if (ns.fileExists('Formulas.exe', 'home')) {
            scripts.delete('queue/darkweb.js')
            ns.tprint('INFO - Skipping darkweb.js')
        }
        // Shuffle scripts
        let scriptList = Array(scripts)
        scriptList.sort(() => Math.random() - 0.5)
        // Check each script and run it
        for (let script of scriptList) {
            // Run the script
            await ns.run(script)
            ns.tprint(`INFO - Running ${script.replace(queue_loc, '')}`)
            await ns.asleep(1000)
            // Don't continue until the script is finished
            while (ns.isRunning(script)) {
                await ns.asleep(1000)
            }
        }

        // Run mapping utils
        ns.run('scripts/mapper.js')
        ns.run('scripts/serverstats.js')

        // Pause for a bit
        ns.tprint(`INFO - Taking a break for ${break_secs} seconds.`)
        await ns.asleep(break_secs * 1000)
    }
}