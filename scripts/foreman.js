/** @param {NS} ns */
export async function main(ns) {
    ns.disableLog("ALL")
    const HOST = 'home'
    const DELAY = 10
    if (ns.getHostname() != HOST) { ns.tprint(`ERROR - Script must be run on 'home', not '${ns.getHostname()}'.`); return }

    while (true) {

        // Read mines.txt
        let mines = ns.read('mines.txt').split('\n')

        // If empty, break
        ns.print(`INFO - ${mines.length} mines in 'mines.txt'`)
        if (mines.length == 0) { return }


        // Build Queue
        let queue = []
        for (let mine of mines) {
            let server = ns.getServer(mine)
            if (mine == '') { return }
            if (server.minDifficulty < server.hackDifficulty) {
                queue.push({
                    'host': server.hostname,
                    'script': 'scripts/_weaken.js',
                    'threads': get_weaken_threads(server),
                    // 'time': ns.getWeakenTime(server.hostname)
                })
            } else if (server.moneyAvailable < server.moneyMax && server.moneyMax > 0 && server.moneyAvailable > 0) {
                queue.push({
                    'host': server.hostname,
                    'script': 'scripts/_grow.js',
                    'threads': get_grow_threads(server),
                    // 'time': ns.getGrowTime(server.hostname)
                })
            } else if (server.moneyAvailable == server.moneyMax && server.moneyMax > 0 && server.moneyAvailable > 0) {
                queue.push({
                    'host': server.hostname,
                    'script': 'scripts/_hack.js',
                    'threads': get_hack_threads(server),
                    // 'time': ns.getHackTime(server.hostname)
                })
            } else { continue }
        }
        ns.print(`INFO - ${queue.length} items in Queue`)

        // Make Resources list
        let miners = new Set()
        let custom = ns.getPurchasedServers()
        if (custom.length > 0) {
            for (let item of custom) {
                miners.add(item)
            }
        }
        if (ns.getServerMaxRam(HOST) >= 32) { miners.add(HOST) }
        ns.print(`INFO - ${miners.size} Miners in pool`)


        // Take items off the list and give them to resources until they're full
        while (miners.size > 0 && queue.length > 0) {
            // For resource in miners, take a job from the queue
            for (let miner of miners.values()) {
                // Find free RAM on resource
                let free_ram = ns.getServerMaxRam(miner) - ns.getServerUsedRam(miner)
                if (miner == HOST) { free_ram -= 8 }
                // Pull the first job
                if (queue.length <= 0) { continue }
                let job = queue[0]
                // Check that the resource has enough RAM to run the job, if not, remove it from the resource list
                let job_ram = ns.getScriptRam(job.script, HOST)
                if (free_ram < job_ram) { miners.delete(miner); continue }
                // Find the Max Threads that the resource can do
                let max_threads = Math.floor(free_ram / job_ram)
                // If max_threads is lower than job threads, reduce job threads and run
                if (max_threads < job.threads) {
                    queue[0].threads -= max_threads
                    run_job(job, miner, max_threads)
                }
                // Otherwise, remove the job from the list and run it
                else {
                    queue.shift()
                    run_job(job, miner, job.threads)
                }
            }
        }
        await ns.asleep(DELAY * 1000)
        // break
    }

    function run_job(job, miner, threads) {
        ns.print(`SUCCESS - ${miner} running ${job.script} on ${job.host} (t=${threads})`)
        ns.scp(job.script, HOST, miner)
        ns.exec(job.script, miner, threads, job.host)
    }

    function get_weaken_threads(server) {
        let sec_diff = server.hackDifficulty - server.minDifficulty
        let threads = 1
        while (true) {
            if (ns.weakenAnalyze(threads) > sec_diff) { return threads } else { threads++ }
            if (threads > 1000000) { return threads }
        }
    }

    function get_grow_threads(server) {
        let growth_factor = server.moneyMax / server.moneyAvailable
        return Math.ceil(ns.growthAnalyze(server.hostname, growth_factor))
    }

    function get_hack_threads(server) {
        return Math.ceil(ns.hackAnalyzeThreads(server.hostname, server.moneyAvailable / 2))
    }
}
