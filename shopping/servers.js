import { ANSI } from "imports/ANSI";
import * as util from "imports/utils";
/** @param {NS} ns */
export async function main(ns) {
    let servers = new util.AllServers(ns).purchased;
    upgrade_servers(servers);
    buy_servers(servers);
    deploy_foreman(servers);

    // ===== FUNCTIONS =====

    /** Upgrades each server based on current and used ram.
     * @param {Array<util.Server>} servers 
    */
    function buy_servers(servers) {
        const RAM = 2
        if (servers.length >= ns.getPurchasedServerLimit()) { return }; // If already reached limit, dip out
        let server_num = servers.length;
        while (ns.getPlayer().money >= ns.getPurchasedServerCost(RAM) && server_num < ns.getPurchasedServerLimit()) {
            let server_name = `miner-${String(server_num).padStart(2, '0')}`;
            ns.purchaseServer(server_name, RAM);
            ns.tprint(`${ANSI.fg.green}Bought ${RAM}GB server: ${server_name} ($${ns.getPurchasedServerCost(RAM)})${ANSI.reset}`);
            server_num++;
        }
    }

    /** Upgrades each server based on current and used ram.
     * @param {Array<util.Server>} servers 
    */
    function upgrade_servers(servers) {
        const MAX_POSSIBLE_RAM = ns.getPurchasedServerMaxRam();
        if (servers.length == 0) { return };
        while (true) {
            let exit = true;
            for (let server of servers) {
                if (server.details.maxRam >= MAX_POSSIBLE_RAM) { continue }; // Skip if maxed out
                if (server.details.ramUsed <= server.details.maxRam / 2) { continue }; // Skip if not using at least 50% of the RAM
                if (server.upgrade_cost > ns.getPlayer().money) { continue }; // Skip if too expensive
                if (ns.upgradePurchasedServer(server.name, server.details.maxRam * 2)) {
                    exit = false;
                    ns.tprint(`${ANSI.fg.green}Upgraded ${server.name} from ${ns.formatRam(server.details.maxRam / 2)} to ${ns.formatRam(server.details.maxRam)}.${ANSI.reset}`);
                } else { ns.tprint(`${ANSI.fg.red}Failed to upgrade ${server.name} from ${ns.formatRam(server.details.maxRam / 2)} to ${ns.formatRam(server.details.maxRam)} - $${server.upgrade_cost}/$${ns.getPlayer().money}.${ANSI.reset}`) };
            };
            if (exit) { return };
        };
    }

    /** Deploys copies of the scripts in the `scripts/` folder to the servers.
     * @param {Array<util.Server>} servers 
     */
    function deploy_foreman(servers) {
        for (let server of servers) {
            ns.scp(['scripts/_hack.js', 'scripts/_grow.js', 'scripts/_weaken.js'], server.name, 'home');
        };
    }
}