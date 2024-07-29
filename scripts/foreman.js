/** @param {NS} ns */
export async function main(ns) {
    while (true) {
        let host = ns.getHostname()
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
                let remoteSec = (ns.getServerMinSecurityLevel(remote) / ns.getServerSecurityLevel(remote)) * 100
                let mineSec = (ns.getServerMinSecurityLevel(mine) / ns.getServerSecurityLevel(mine)) * 100
                let secDiff = mineSec - remoteSec
                let remoteMoney = (ns.getServerMoneyAvailable(remote) / ns.getServerMaxMoney(remote)) * 100
                let mineMoney = (ns.getServerMoneyAvailable(mine) / ns.getServerMaxMoney(mine)) * 100
                let moneyDiff = mineMoney - remoteMoney
                let totalDiff = secDiff + moneyDiff
                if (totalDiff < 0) {
                    if (secDiff > moneyDiff) {
                        script = 'scripts/_weaken.js'
                    } else if (moneyDiff > secDiff) {
                        script = 'scripts/_grow.js'
                    } else {
                        script = 'scripts/_hack.js'
                    }
                    let mineMaxRam = ns.getServerMaxRam(mine)
                    let mineFreeRam = mineMaxRam - ns.getServerUsedRam(mine)
                    if (mineFreeRam > scriptRam) {
                        remote = mine
                    }
                }
            }
        }
        let freeRam = ns.getServerMaxRam(host) - ns.getServerUsedRam(host)
        let threads = Math.floor(freeRam / scriptRam)
        if (threads > 0) {
            ns.run(script, threads, remote)
        }
        await ns.asleep(100)
    }
}