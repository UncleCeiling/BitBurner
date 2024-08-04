/** @param {NS} ns */
export async function main(ns) {
    // Build list of servers
    let servers = new Set(['home'])
    for (let server of servers) {
        for (let result of ns.scan(server)) {
            if (result.includes('custom-')) { continue }
            servers.add(result)
        }
    }
    let serverDetails = []
    for (let server of servers) {
        serverDetails.push(ns.getServer(server))
    }
    // Build list of servers to backdoor
    let toBackdoor = []
    for (let server of serverDetails) {
        // Skip backdoored and unrooted servers
        if (server['backdoorInstalled'] || !server['hasAdminRights']) { continue }
        // Skip 'home' and custom servers
        if (server['hostname'] == 'home' || server['hostname'].includes('custom-')) { continue }
        // Backdoor whatever is left
        toBackdoor.push(server['hostname'])
    }

    // Deploy any backdoors that are in the list
    if (toBackdoor.length > 0) {
        for (let server of toBackdoor) {
            // Extract hostname
            let target = server
            // Skip servers that are already being backdoored
            if (ns.isRunning('scripts/backdoor.js', 'home', target)) {
                ns.print(`WARN - Backdoor already running on ${target}`); break
            }
            // Other wise run the backdoor script and take a nap
            while (true) {
                let freeRam = ns.getServerMaxRam('home') - ns.getServerUsedRam('home')
                let scriptRam = ns.getScriptRam('scripts/backdoor.js', 'home')
                if (scriptRam <= freeRam) { ns.run('scripts/backdoor.js', 1, target); break }
                await ns.asleep(100)
            }
        }
    }
    // Otherwise, call it a day
    else { ns.print('INFO - All available servers backdoored.') }
}