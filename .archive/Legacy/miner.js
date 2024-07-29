/** @param {NS} ns */
export async function main(ns) {
    while (true) {
        const target = ns.args[0]
        var ram = ns.getServerMaxRam(target) - ns.getScriptRam('miner.js')
        var script = ''
        if (((ns.getServerMinSecurityLevel(target) / ns.getServerSecurityLevel(target)) * 100) <= 95) {
            script = 'weaken.js'
        } else if (((ns.getServerMoneyAvailable(target) / ns.getServerMaxMoney(target)) * 100) <= 95) {
            script = 'grow.js'
        } else {
            script = 'hack.js'
        }
        var script_ram = ns.getScriptRam(script)
        var threads = Math.floor(ram / script_ram)
        ns.print(script + ' x ' + threads + ' threads = ' + (script_ram * threads))
        ns.print('running ' + script + ' ' + target + '' + threads)
        ns.run(script, threads, target)
        await ns.sleep(100)
        while (ns.isRunning(script)) {
            await ns.sleep(100)
        }
    }
}