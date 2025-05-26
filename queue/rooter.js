import { ANSI } from "imports/ANSI"

/** @param {NS} ns */
export async function main(ns) {
    let servers = get_servers().map((a) => ns.getServer(a));
    let to_root = servers.filter((a) => !a.hasAdminRights);
    const MIN_SCRIPT_RAM = SCRIPTS_LIST.map((a) => { ns.getScriptRam(a) }).sort((a, b) => b - a)[0]
    if (to_root.length > 0) {
        ns.tprint(`${ANSI.fg.cyan}${servers.length - to_root.length}/${servers.length} (${Math.floor(((servers.length - to_root.length) / servers.length) * 100)}%) servers rooted so far.${ANSI.reset}`);
        for (let target of to_root) {
            let req = ns.getServerRequiredHackingLevel(target.hostname);
            if (req > ns.getHackingLevel()) { ns.print(`${ANSI.fg.yellow} Skipping ${target.hostname}. (Needs hacking level ${req})${ANSI.reset}`); continue };
            do_root(target.hostname);

        }
    } else { ns.tprint(`${ANSI.fg.green} All ${servers.length} servers have been rooted.${ANSI.reset}`) }

    let mine_lists = get_mine_lists();
    ns.rm('mines.txt', 'home');
    ns.write('mines.txt', mine_lists.mines.join('\n'), 'w');
    ns.print(`${ANSI.fg.cyan}Updated 'mines.txt' with ${mine_lists.mines.length} entries.${ANSI.reset}`);
    ns.rm('miners.txt', 'home');
    ns.write('miners.txt', mine_lists.miners.join('\n'), 'w');
    ns.print(`${ANSI.fg.cyan}Updated 'miners.txt' with ${mine_lists.miners.length} entries.${ANSI.reset}`);

    function get_servers() {
        let servers = new Set(['home'])
        for (let server of servers) {
            for (let result of ns.scan(server)) {
                if (result.includes('custom-') || result.includes('hacknet-server-')) { continue };
                servers.add(result)
            }
        }
        return Array.from(servers)
    }

    function get_mine_lists() {
        let mines = []
        let miners = []
        for (let server of get_servers()) {
            let details = ns.getServer(server)
            if (!details.hasAdminRights) { continue }
            if (details.maxRam > MIN_SCRIPT_RAM && details.hostname != "darkweb") { miners.push(server) }
            if (details.moneyMax > 0) { mines.push(server) }
        }
        return { "mines": mines, "miners": miners }
    }

    function do_root(target) {
        const EXE_LIST = [
            "BruteSSH.exe",
            "FTPCrack.exe",
            "HTTPWorm.exe",
            "SQLInject.exe",
            "relaySMTP.exe",
        ]
        let req_level = ns.getServerRequiredHackingLevel(target)
        let player_level = ns.getHackingLevel()
        if (req_level > player_level) { ns.print(`${ANSI.fg.red}Hacking level not high enough to hack ${target} - ${player_level}/${req_level}${ANSI.reset}`) }
        let currentPorts = 0
        for (let exe of EXE_LIST) {
            if (!open_port(exe, target)) { continue };
            ns.print(`${ANSI.fg.green}Used ${exe} ${target}${ANSI.reset}`);
            currentPorts++
        }
        if (ns.getServerNumPortsRequired(target) > currentPorts) {
            ns.tprint(`WARN - Opened ${currentPorts}/${ns.getServerNumPortsRequired(target)} ports on ${target}.`)
        } else {
            ns.nuke(target); ns.tprint(`${ANSI.fg.green}Nuked ${target}.${ANSI.reset}`)
        }
    }

    function open_port(exe, target) {
        if (ns.fileExists(exe)) {
            switch (exe) {
                case "BruteSSH.exe":
                    ns.brutessh(target);
                    break;
                case "FTPCrack.exe":
                    ns.ftpcrack(target);
                    break;
                case "HTTPWorm.exe":
                    ns.httpworm(target);
                    break;
                case "SQLInject.exe":
                    ns.sqlinject(target);
                    break;
                case "relaySMTP.exe":
                    ns.relaysmtp(target);
                    break;
            }
            return true
        } else { return false }
    }
}