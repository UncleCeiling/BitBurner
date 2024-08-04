/** @param {NS} ns */
export async function main(ns) {
    let enabled = true
    let delay = 100
    if (enabled == false) {
        ns.tprint('ERROR - Miner is disabled')
        return
    }
    while (true) {
        ns.print('INFO - Reading `mines.txt`')
        let mines = ns.read('mines.txt').split('\n')
        for (let mine of mines) {
            if (mine != '') {
                let ram = ns.getServerMaxRam(mine) - ns.getServerUsedRam(mine)
                let script = 'scripts/'
                if (((ns.getServerMinSecurityLevel(mine) / ns.getServerSecurityLevel(mine)) * 100) <= 90) {
                    script += '_weaken.js'
                } else if (((ns.getServerMoneyAvailable(mine) / ns.getServerMaxMoney(mine)) * 100) <= 90) {
                    script += '_grow.js'
                } else {
                    script += '_hack.js'
                }
                let script_ram = ns.getScriptRam(script)
                if (script_ram > ram) {
                    ns.print(`WARN - Script RAM (${script_ram}GB) exceeds available RAM (${ram}/${ns.getServerMaxRam(mine)}GB)`)
                } else {
                    let max_threads = Math.floor(ram / script_ram)

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
                        let grow_threads = ns.growthAnalyze(target, growth_factor, ns.getServer(mine)['cpuCores'])
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
                            if (ns.weakenAnalyze(threads, ns.getServer(mine)['cpuCores']) > sec_diff) { return threads }
                        }
                        return max_threads
                    }
                    let threads = 0
                    if (max_threads > 0) {
                        switch (script) {
                            case 'scripts/_hack.js':
                                threads = Math.ceil(get_hack_threads(mine))
                                ns.print(`Hack Threads: ${threads}`)
                                break;
                            case 'scripts/_grow.js':
                                threads = Math.ceil(get_grow_threads(mine))
                                ns.print(`Grow Threads: ${threads}`)
                                break;
                            case 'scripts/_weaken.js':
                                threads = Math.ceil(get_weaken_threads(mine))
                                ns.print(`Weaken Threads: ${threads}`)
                                break;
                            default:
                                threads = max_threads
                        }
                        if (threads > 0) {
                            ns.print(`WARN - ${script}(${script_ram}GB) X ${threads} threads = ${(script_ram * threads)}GB`)
                            ns.print(`INFO - Copying ${script} to ${mine}`)
                            ns.scp(script, mine)
                            ns.print(`INFO - Running ${script} on ${mine} with ${threads} threads.`)
                            ns.exec(script, mine, threads, mine)
                        }
                    }
                }
            }
            await ns.asleep(delay)
        }
    }
}