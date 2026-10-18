/** @param {NS} ns */
export async function main(ns) {
    const target = ns.args[0]
    if (ns.scriptRunning('helper.js', target) == false && ns.scriptRunning('miner.js', target) == false) {
        if (ns.getServerMaxMoney(target) == 0) {
            var threads = (Math.floor(ns.getServerMaxRam(target) / ns.getScriptRam('helper.js')))
            ns.scp(['grow.js', 'hack.js', 'weaken.js', 'helper.js'], target, 'home')
            ns.print('running helper ' + target + ' ' + threads)
            ns.exec('helper.js', target, threads)
        } else {
            ns.scp(['grow.js', 'hack.js', 'weaken.js', 'miner.js'], target, 'home')
            ns.print('running miner ' + target + ' ')
            ns.exec('miner.js', target, 1, target)
        }
    }
}