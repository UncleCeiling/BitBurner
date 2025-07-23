import { ANSI } from "../imports/ANSI";

/** @param {NS} ns */
export async function main(ns) {

    // Disable logs
    ns.disableLog("ALL")
    // Start
    // Take variables
    let duration = ns.args[0]
    if (!(duration > 0)) { ns.tprint(`${ANSI.bg.red}"${duration}" is not a valid argument (please enter an integer larger than 1)${ANSI.reset}`); return }
    let cycles = duration * 10
    ns.tprint(`\n${ANSI.fg.cyan}Starting Hacknet Cycler\nDuration: ${duration} seconds\n(${cycles} cycles)${ANSI.reset}`)
    // Count cycles
    for (let complete_cycles = 1; complete_cycles <= cycles; complete_cycles++) {
        ns.run('scripts/hacknet.js')
        // Report every tenth cycle
        if (complete_cycles % 10 == 0) {
            let estimate = Math.floor((cycles - complete_cycles) / 10)
            let message = `${ANSI.fg.cyan}${Math.floor((complete_cycles / cycles) * 100)}% completed | Approx ${estimate} seconds until cycler ends${ANSI.reset}`
            if (complete_cycles % 100 == 0 && (Math.floor((complete_cycles / cycles) * 100)) != 100) { ns.tprint(message) } else { ns.print(message) }
        }
        await ns.asleep(100)
    }
    ns.tprint(`${ANSI.fg.cyan}Hacknet Cycler complete${ANSI.reset}`)
}