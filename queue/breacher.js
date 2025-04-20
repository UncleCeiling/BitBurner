import { ANSI } from "imports/ANSI"

/** @param {NS} ns */
export async function main(ns) {
    ns.disableLog("scan")
    let backdoor_list = get_backdoor_list()
    ns.clearLog()
    if (backdoor_list.length > 0) {
        for (let server of backdoor_list) {
            connect_to(server)
            ns.ui.openTail()
            await ns.singularity.installBackdoor()
            ns.tprint(`${ANSI.fg.green}Installed Backdoor on ${server}.${ANSI.reset}`)
        }
    } else {
        ns.print(`${ANSI.fg.cyan}All available servers backdoored.${ANSI.reset}`)
    }

    function get_servers() {
        let servers = new Set(["home"])
        for (let server of servers) {
            for (let neighbour of ns.scan(server)) {
                if ( // exclude special servers
                    neighbour.includes("custom-") ||
                    neighbour.includes("w0r1d_d43m0n") ||
                    neighbour.includes("hacknet-server-")
                ) { continue } else {
                    servers.add(neighbour)
                }
            }
        }
        let server_details = []
        for (let server of servers) { server_details.push(ns.getServer(server)) }
        return server_details.filter((a) => a.hasAdminRights)
    }

    function get_backdoor_list() {
        let backdoor = []
        for (let server of get_servers()) {
            if (
                server.hostname != "home" &&
                !server.backdoorInstalled &&
                server.hasAdminRights
            ) { backdoor.push(server.hostname) } else { continue }
        }
        return backdoor
    }

    function connect_to(server) {
        let route = route_home(server)
        for (let hop of route) {
            ns.singularity.connect(hop)
        }
    }

    function route_home(server, route = []) {
        let to_check = ns.scan(server).filter((a) => !route.includes(a)) // 
        if (to_check.length <= 0) { return null } // If reached the end of a line without finding the route, return null
        for (let neighbour of to_check) { // Check
            if (ns.getServer(neighbour).backdoorInstalled) { return [neighbour, server].concat(route) }
            else {
                let test = route_home(neighbour, [neighbour].concat(route))
                if (test != null) { return test }
            }
        }
    }
}