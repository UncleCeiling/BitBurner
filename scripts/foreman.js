/** @param {NS} ns */
export async function main(ns) {
    ns.disableLog("ALL")
    while (true) {
        // sleep a little
        let sleepLength = Math.floor(Math.random() * 10000)
        await ns.asleep(sleepLength)
        let host = ns.getHostname()
        if (host == 'home' && ns.getServerMaxRam('home') <= 64) { ns.asleep(5000); return }
        let scriptRam = Math.max(ns.getScriptRam('scripts/_grow.js', host), ns.getScriptRam('scripts/_hack.js', host), ns.getScriptRam('scripts/_weaken.js', host))
        // Calculate area of most need
        let mines = ns.read('mines.txt').split('\n')
        let remote = ''
        let script = ''
        for (let mine of mines) {
            if (remote == '') {
                remote = mine
                script = 'scripts/_hack.js'
            } else {
                // ns.print(mine)
                let remoteSec = (ns.getServerMinSecurityLevel(remote) / ns.getServerSecurityLevel(remote)) * 100
                let mineSec = (ns.getServerMinSecurityLevel(mine) / ns.getServerSecurityLevel(mine)) * 100
                let secDiff = Math.floor(remoteSec - mineSec)
                // ns.print(`Sec-diff: ${secDiff}`)
                let remoteMoney = (ns.getServerMoneyAvailable(remote) / ns.getServerMaxMoney(remote)) * 100
                let mineMoney = (ns.getServerMoneyAvailable(mine) / ns.getServerMaxMoney(mine)) * 100
                let moneyDiff = Math.floor(remoteMoney - mineMoney)
                // ns.print(`Money-diff: ${moneyDiff}`)
                let totalDiff = secDiff + moneyDiff
                // ns.print(`Total-diff: ${totalDiff}`)
                if (totalDiff > 0) {
                    if (secDiff > moneyDiff) {
                        script = 'scripts/_weaken.js'
                    } else if (moneyDiff > secDiff) {
                        script = 'scripts/_grow.js'
                    } else {
                        script = 'scripts/_hack.js'
                    }
                    remote = mine
                }
            }
        }
        // calc free ram
        let freeRam = ns.getServerMaxRam(host) - ns.getServerUsedRam(host)
        // -64 for home
        if (remote == '') {
            continue
        } else if (host == 'home') {
            freeRam = (ns.getServerMaxRam(host) - 64) - ns.getServerUsedRam(host)
        }
        // calc threads
        let max_threads = Math.floor(freeRam / scriptRam)
        function get_hack_threads(target) {
            ns.print(`Hack: ${target}`)
            let server = ns.getServer(target)
            let hack_threads = Math.floor(ns.hackAnalyzeThreads(target, server['moneyAvailable']))
            if (max_threads < hack_threads) { return max_threads } else { return hack_threads }
        }
        function get_grow_threads(target) {
            ns.print(`Grow: ${target}`)
            let server = ns.getServer(target)
            let growth_factor = server['moneyMax'] / server['moneyAvailable']
            // ns.print(`Growth Factor: ${growth_factor}`)
            let grow_threads = ns.growthAnalyze(target, growth_factor, ns.getServer(host)['cpuCores'])
            // ns.print(`Growth Threads: ${grow_threads}`)
            if (max_threads < grow_threads) { ns.print(`Max Threads: ${max_threads}`); return max_threads } else if (grow_threads == 0) { ns.print(`1 thread`); return 1 } else { ns.print(`Grow Threads: ${grow_threads}`); return grow_threads }
        }
        function get_weaken_threads(target) {
            ns.print(`Weaken: ${target}`)
            let server = ns.getServer(target)
            let min_sec = server['minDifficulty']
            let current_sec = server['hackDifficulty']
            let sec_diff = current_sec - min_sec
            for (threads = 1; threads < max_threads; threads++) {
                if (ns.weakenAnalyze(threads, ns.getServer(host)['cpuCores']) > sec_diff) { return threads }
            }
            return max_threads
        }
        let threads = 0
        if (max_threads > 0) {
            switch (script) {
                case 'scripts/_hack.js':
                    threads = Math.ceil(get_hack_threads(remote))
                    ns.print(`Hack Threads: ${threads}`)
                    break;
                case 'scripts/_grow.js':
                    threads = Math.ceil(get_grow_threads(remote))
                    ns.print(`Grow Threads: ${threads}`)
                    break;
                case 'scripts/_weaken.js':
                    threads = Math.ceil(get_weaken_threads(remote))
                    ns.print(`Weaken Threads: ${threads}`)
                    break;
                default:
                    threads = max_threads
            }
            // run threads
            if (threads > 0) { ns.print(`${script} - ${remote} - ${threads}`); ns.run(script, threads, remote) }
        }
    }
}