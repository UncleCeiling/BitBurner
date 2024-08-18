/** @param {NS} ns */
export async function main(ns) {
    // Location of the files to be run
    let queue_loc = 'queue/'
    let argument = ns.args[0]
    let break_secs = 60
    // Darkweb function
    // Set break to argument if there is one
    if (argument > 0) {
        break_secs = argument
    }
    ns.run('queue/darkweb.js')
    await ns.asleep(1000)
    ns.run('queue/hacknet.js')
    // Loop forever
    await ns.asleep(1000)
    while (true) {
        // Fetch scripts and flag from queue
        let scripts = ns.ls('home', queue_loc)
        // Check for Flags
        let darkweb_flag = ns.fileExists('flags/darkweb.flag.txt')
        let hacknet_flag = ns.fileExists('flags/hacknet.flag.txt')
        ns.print(`INFO - Found ${scripts.length} scripts.`)
        // Shuffle scripts
        scripts.sort(() => Math.random() - 0.5)
        // Check each script and run it
        for (let script of scripts) {
            // Skip darkweb.js is everything bought
            if (darkweb_flag && script.includes('darkweb.js')) { ns.print('INFO - Skipping darkweb.js'); continue }
            if (hacknet_flag && script.includes('hacknet.js')) { ns.print('INFO - Skipping hacknet.js'); continue }
            // Run script
            ns.tprint(`INFO - Running ${script.replace(queue_loc, '')}`)
            await ns.run(script)
            // Give it a second
            await ns.asleep(1000)
            // Don't continue until the script is finished
            while (ns.isRunning(script)) {
                await ns.asleep(1000)
            }
            await ns.asleep(1000)
        }

        // Run miner if miner not running
        if (!ns.isRunning('scripts/miner.js', 'home')) {
            ns.run('scripts/miner.js', 1)
            ns.tprint('SUCCESS - Launching Miner on `home`')
        }

        // Run `home` foreman if not running and have more than 64GB of RAM
        if (!ns.isRunning('scripts/foreman.js', 'home') && ns.getServerMaxRam('home') >= 32) {
            ns.run('scripts/foreman.js', 1)
            ns.tprint('SUCCESS - Launching Foreman on `home`')
        }

        // Run mapping utils
        await ns.asleep(1000)
        ns.run('scripts/mapper.js')
        await ns.asleep(1000)
        ns.run('scripts/server_stats.js')

        // Pause for a bit
        ns.tprint(`INFO - Taking a break for ${break_secs} seconds.`)
        await ns.asleep(break_secs * 1000)
    }
}