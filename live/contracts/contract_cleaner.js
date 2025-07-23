import { ANSI } from "live/imports/ANSI";

/** @param {NS} ns */
export async function main(ns) {
    ns.disableLog("ALL");
    ns.ui.openTail();
    let history = { "deleted": 0, "failed": 0, "servers": 0 };
    let servers = new Set(['home']);
    for (let server of servers) { for (let result of ns.scan(server)) { servers.add(result) } }
    for (let server of servers) {
        let contracts = ns.ls(server, '.cct');
        if (contracts.length == 0) { continue };
        ns.print(server);
        history.servers++;
        for (let file of contracts) {
            if (ns.rm(file, server)) { ns.print(`SUCCESS - Deleted ${file} from ${server}`); history.deleted++ }
            else { ns.print(`FAIL - Could not delete ${file} from ${server}`); history.failed++ };
        };
        ns.asleep(100);
    }
    ns.ui.closeTail();
    if (history.deleted > 0 || history.failed > 0) {
        ns.tprint(`${ANSI.fg.cyan}${history.deleted} contracts deleted from ${history.servers} servers.\n${history.failed} contracts failed to delete.${ANSI.reset}`)
    }
}