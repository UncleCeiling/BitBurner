/** @param {NS} ns */
export async function main(ns) {
    let data = []
    var servers = new Set()
    function print_server(server, depth) {
        let current = ns.getServer(server)
        if (server.includes("custom-") || server.includes("darkweb")) { return }
        depth++
        let rooted = ''
        let backdoor = ''
        if (current["hasAdminRights"] == true) { rooted = 'R' } else { rooted = "X" }
        if (current["backdoorInstalled"] == true) { backdoor = 'B' } else { backdoor = "X" }
        data.push(String('|>'.padStart((depth), '\t') + `${rooted}${backdoor} "${current["hostname"]}" ${current["requiredHackingSkill"]}`))
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
    ns.tprint(`SUCCESS - Wrote ${data.length} lines to 'map.txt'`)
    ns.print('\n' + data.join('\n'))
}