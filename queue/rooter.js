import { ANSI } from "imports/ANSI"
import * as util from "imports/utils"
/** @param {NS} ns */
export async function main(ns) {

    // ===== MAIN =====
    ns.disableLog("ALL");
    let servers = new util.AllServers(ns);
    for (let server of servers.array) {
        if (server.details.openPortCount < 5) { crack_ports(server) }; // Crack ports if any are closed
        if (server.details.purchasedByPlayer || server.details.backdoorInstalled || server.details.hasAdminRights) { continue }; // Skip servers that don't need nuking
        do_root(server);
    };
    report(servers);
    export_mines(servers);

    // ===== FUNCTIONS =====

    /** Tries to crack ports on the target
     * @param {util.AllServers} servers
     */
    function export_mines(servers) {
        let mines = servers.array.filter((a) => a.is_mine);
        let miners = servers.array.filter((a) => a.is_miner);
        ns.rm('mines.txt', 'home');
        ns.write('mines.txt', mines.map((a) => a.name).join('\n'), 'w');
        ns.print(`${ANSI.fg.cyan}Updated 'mines.txt' with ${mines.length} entries.${ANSI.reset}`);
        ns.rm('miners.txt', 'home');
        ns.write('miners.txt', miners.map((a) => a.name).join('\n'), 'w');
        ns.print(`${ANSI.fg.cyan}Updated 'miners.txt' with ${miners.length} entries.${ANSI.reset}`);
    };

    /** Reports the proportions of servers that have been Nukes/Backdoored
     * @param {util.AllServers} servers
     */
    function report(servers) {
        let nuke_able = servers.array.filter((a) => !a.details.purchasedByPlayer);
        let nuked = nuke_able.filter((a) => a.details.hasAdminRights);
        if (nuked.length == nuke_able.length) {
            ns.tprint(`${ANSI.fg.green}All Servers are Nuked.`);
        } else {
            ns.tprint(`${ANSI.fg.cyan}${nuked.length}/${nuke_able.length} (${((nuked.length / nuke_able.length) * 100).toPrecision(3)}%) servers nuked so far.${ANSI.reset}`);
        };
        let backdoored = nuke_able.filter((a) => a.details.backdoorInstalled);
        if (backdoored.length != nuke_able.length) {
            ns.tprint(`${ANSI.fg.cyan}${backdoored.length} /${nuke_able.length} (${((backdoored.length / nuke_able.length) * 100).toPrecision(3)}%) servers backdoored so far.${ANSI.reset}`);
        };
    };

    /** Tries to crack ports on the target
     * @param {util.Server} target 
     */
    function crack_ports(target) {
        if (!target.details.sshPortOpen && ns.fileExists("BruteSSH.exe", "home")) { ns.brutessh(target.name) }; // SSH
        if (!target.details.ftpPortOpen && ns.fileExists("FTPCrack.exe", "home")) { ns.ftpcrack(target.name) }; // FTP
        if (!target.details.httpPortOpen && ns.fileExists("HTTPWorm.exe", "home")) { ns.httpworm(target.name) }; // HTTP
        if (!target.details.sqlPortOpen && ns.fileExists("SQLInject.exe", "home")) { ns.sqlinject(target.name) }; // SQL
        if (!target.details.smtpPortOpen && ns.fileExists("relaySMTP.exe", "home")) { ns.relaysmtp(target.name) }; // SMTP
    };

    /** Tries to root the target
     * @param {util.Server} target 
     */
    function do_root(target) {
        if (target.details.openPortCount < target.details.numOpenPortsRequired) { // Error if not enough ports open
            ns.tprint(`${ANSI.fg.yellow}${target.details.openPortCount}/${target.details.numOpenPortsRequired} ports open on ${target.name}.${ANSI.reset}`); return;
        } else if (target.details.requiredHackingSkill > ns.getPlayer().skills.hacking) { // Error if not high enough skill
            ns.print(`${ANSI.fg.red}Hacking level not high enough to hack ${target.name} - ${ns.getPlayer().skills.hacking}/${target.details.requiredHackingSkill}${ANSI.reset}`); return;
        } else { // Otherwise Nuke the target
            if (ns.nuke(target.name)) { ns.tprint(`${ANSI.fg.green}Nuked ${target.name}.${ANSI.reset}`); return; }
            else { ns.tprint(`${ANSI.fg.red}Failed to Nuke ${target.name}.${ANSI.reset}`); return; };
        };
    };
}