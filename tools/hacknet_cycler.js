/** @param {NS} ns */
export async function main(ns) {
    let duration = ns.args[0] * 1000
    if (!(duration > 0)) { ns.tprint(`ERROR - "${duration}" is not a valid argument (please enter an integer larger than 1)`); return }
    let now = Date.now()
    let finish = now + duration
    while (Date.now() <= finish) {
        ns.run('queue/hacknet.js')
        while (ns.isRunning('queue/hacknet.js')) {
            await ns.asleep(10)
        }
    }
}