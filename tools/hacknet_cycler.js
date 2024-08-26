/** @param {NS} ns */
export async function main(ns) {
    ns.tprint('ERROR - Deprecated')
    return
    ns.tprint('INFO - Starting Hacknet Cycler')
    let duration = ns.args[0] * 1000
    if (!(duration > 0)) { ns.tprint(`ERROR - "${duration}" is not a valid argument (please enter an integer larger than 1)`); return }
    ns.tprint(`INFO - Duration: ${duration}`)
    let now = Date.now()
    let finish = now + duration
    while (Date.now() <= finish) {
        ns.run('queue/hacknet.js')
        // let estimate = Math.floor((finish - Date.now()) / 1000)
        // if (estimate % 10 == 0) { ns.tprint(`INFO - ${estimate} seconds until cycler ends`) }
        while (ns.isRunning('queue/hacknet.js')) {
            await ns.asleep(10)
        }
        await ns.asleep(10)
    }
    ns.tprint(`SUCCESS - Hacknet Cycler complete`)
}