/** @param {NS} ns */
export async function main(ns) {
    // Build list of servers
    let servers = new Set(['home'])
    for (let server of servers) {
        for (let result of ns.scan(server)) {
            servers.add(ns.getServer(result))
        }
    }
    // Build list of servers to backdoor
    let toBackdoor = []
    for (let server of servers) {
        // Skip backdoored and unrooted servers
        if (server['backdoorInstalled'] && !server['hasAdminRights']) { continue }
        // Skip 'home' and custom servers
        if (server['hostname'] == 'home' || server['hostname'].includes('custom-')) { continue }
        // Backdoor whatever is left
        toBackdoor.push(server['hostname'])
    }

    // Deploy any backdoors that are in the list
    if (toBackdoor.length > 0) {
        for (let server of toBackdoor) {
            // Extract hostname
            let target = server['hostname']
            // Skip servers that are already being backdoored
            if (ns.isRunning('scripts/backdoor.js', 'home', target)) {
                ns.print(`WARN - Backdoor already running on ${target}`)
            }
            // Other wise run the backdoor script and take a nap
            else {
                ns.run('scripts/backdoor.js', 1, target)
                ns.asleep(200)
            }
        }
    }
    // Otherwise, call it a day
    else { ns.print('INFO - All available servers backdoored.') }
}