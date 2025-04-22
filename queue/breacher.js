import { ANSI } from "imports/ANSI"

/** @param {NS} ns */
export async function main(ns) {
    ns.disableLog("ALL");
    ns.clearLog();
    let servers = new Set(["home"]);
    ns.ui.openTail()
    for (let server of servers) {
        ns.print(`Scanning ${server}...`)
        for (let result of ns.scan(server)) {
            let candidate = ns.getServer(result);
            if (candidate.hostname == "home" || candidate.hostname == "w0r1d_d43m0n" || candidate.purchasedByPlayer) { continue }
            else if (!candidate.backdoorInstalled && candidate.hasAdminRights && candidate.hostname != "home") {
                let eta_secs = ns.getHackTime(candidate.hostname) / 4000
                ns.singularity.connect(candidate.hostname);
                ns.print(`${ANSI.fg.cyan}Backdooring ${candidate.hostname} (${eta_secs} secs)${ANSI.reset}`);
                await ns.singularity.installBackdoor();
                ns.tprint(`${ANSI.fg.green}${candidate.hostname} successfully backdoored ${ANSI.reset}`)
                ns.singularity.connect(server);
                servers.add(candidate.hostname)
            } else if (candidate.backdoorInstalled) { servers.add(candidate.hostname) }
        }
    }
    ns.ui.closeTail()
}