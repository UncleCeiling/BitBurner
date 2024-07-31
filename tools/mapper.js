/** @param {NS} ns */
export async function main(ns) {
    ns.tprint('INFO - Mapping network.')
    // Build list of servers
    let serverList = new Set(['home'])
    // Populate serverList
    let prevListLength = 0
    let data = []
    while (serverList.size != prevListLength) {
        prevListLength = serverList.size
        serverList.forEach(function (remote) {
            let scanResult = ns.scan(remote)
            for (let result of scanResult) {
                if (!result.includes("custom-")) {
                    serverList.add(result)
                }
            }
        })
        ns.print(`INFO - ${prevListLength} => ${serverList.size}`)
    }
    var servers = new Set()
    function print_server(server, depth) {
        let current = ns.getServer(server)
        if (server.includes("custom-")) { return }
        depth++
        let rooted = ''
        let backdoor = ''
        if (current["hasAdminRights"] == true) { rooted = 'R' } else { rooted = "X" }
        if (current["backdoorInstalled"] == true) { backdoor = 'B' } else { backdoor = "X" }
        data.push(String('|>'.padStart((depth * 2), ' ') + `${rooted}${backdoor} "${current["hostname"]}" ${current["requiredHackingSkill"]}`))
        let children = new Set(ns.scan(current["hostname"]))
        for (let server of servers) {
            children.delete(server)
        }
        servers.add(current["hostname"])
        for (let child of children) {
            print_server(child, depth)
        }
    }
    print_server('home', 0)

    // Create/update the map
    ns.rm('map.txt', 'home')
    ns.write('map.txt', data.join('\n'), 'w')
    ns.tprint(`INFO - Updated 'map.txt' with ${data.length} entries.`)
}