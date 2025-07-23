/** @param {NS} ns */
export async function main(ns) {
    if (ns.isRunning('main.js')) { return }
    else (ns.run('main.js'))
}