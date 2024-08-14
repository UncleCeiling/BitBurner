/** @param {NS} ns */
export async function main(ns) {
    let enabled = true
    const DELAY = 500
    if (enabled == false) {
        ns.tprint('ERROR - Miner is disabled')
        return
    }
    if (ns.fileExists('mines.txt') == false) { return }
    while (true) {
        ns.print('INFO - Reading `mines.txt`')
        let mines = ns.read('mines.txt').split('\n')
        for (let mine of mines) {
            if (mine != '') {
                let ram = ns.getServerMaxRam(mine) - ns.getServerUsedRam(mine)
                let script = 'scripts/'
                if (((ns.getServerMinSecurityLevel(mine) / ns.getServerSecurityLevel(mine)) * 100) <= 99) {
                    script += '_weaken.js'
                } else if (((ns.getServerMoneyAvailable(mine) / ns.getServerMaxMoney(mine)) * 100) <= 99) {
                    script += '_grow.js'
                } else {
                    script += '_hack.js'
                }
                let script_ram = ns.getScriptRam(script)
                if (script_ram > ram) {
                    ns.print(`WARN - Script RAM (${script_ram}GB) exceeds available RAM (${ram}/${ns.getServerMaxRam(mine)}GB)`)
                } else {
                    let threads = Math.floor(ram / script_ram)
                    if (threads > 0) {
                        ns.print(`WARN - ${script}(${script_ram}GB) X ${threads} threads = ${(script_ram * threads)}GB`)
                        ns.print(`INFO - Copying ${script} to ${mine}`)
                        ns.scp(script, mine)
                        ns.print(`INFO - Running ${script} on ${mine} with ${threads} threads.`)
                        ns.exec(script, mine, threads, mine)
                    }
                }
            }
            await ns.asleep(DELAY)
        }
    }
}