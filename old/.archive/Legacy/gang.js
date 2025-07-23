/** @param {NS} ns */
export async function main(ns) {
    ns.tprint('INFO - Gang-boss is in control.')
    var karma = Math.floor(ns.heart.break())
    if (karma > -54000) {
        ns.tprint('INFO - Karma is ' + karma + ' - Need ' + (karma + 54000) + ' to create gang')
    } else {
        ns.tprint('SUCCESS - Ready to create Gang')
    }
    ns.tprint('INFO - Gang-boss has left the building.')
    ns.spawn('augments.js')
}