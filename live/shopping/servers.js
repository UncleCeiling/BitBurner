import { ANSI } from "imports/ANSI";
import { AllServers, UtilServer } from "imports/servers";
/** @param {NS} ns */
export async function main(ns) {
  let servers = new AllServers(ns);
  upgrade_servers(servers.purchased);
  buy_servers(servers.purchased);
  deploy_foreman(servers.purchased);

  // ===== FUNCTIONS =====

  /** Upgrades each server based on current and used ram.
   * @param {Array<UtilServer>} servers
   */
  function buy_servers(servers) {
    const RAM = 2;
    if (servers.length >= ns.getPurchasedServerLimit()) {
      return;
    } // If already reached limit, dip out
    let server_num = servers.length;
    while (
      ns.getPlayer().money >= ns.getPurchasedServerCost(RAM) &&
      server_num < ns.getPurchasedServerLimit()
    ) {
      let server_name = `miner-${String(server_num).padStart(2, "0")}`;
      ns.purchaseServer(server_name, RAM);
      ns.tprint(
        `${
          ANSI.fg.green
        }Bought ${RAM}GB server: ${server_name} ($${ns.getPurchasedServerCost(
          RAM
        )})${ANSI.reset}`
      );
      server_num++;
    }
  }

  /** Upgrades each server based on current and used ram.
   * @param {Array<UtilServer>} servers
   */
  function upgrade_servers(servers) {
    const MAX_POSSIBLE_RAM = ns.getPurchasedServerMaxRam();
    if (servers.length == 0) {
      return;
    }
    while (true) {
      let exit = true;
      for (let server of servers) {
        if (server.details.maxRam >= MAX_POSSIBLE_RAM) {
          continue;
        } // Skip if maxed out
        // if (server.details.ramUsed <= server.details.maxRam / 2) { continue }; // Skip if not using at least 50% of the RAM
        if (server.upgrade_cost > ns.getPlayer().money) {
          continue;
        } // Skip if too expensive
        while (
          ns.upgradePurchasedServer(server.name, server.details.maxRam * 2)
        ) {
          exit = false;
          ns.tprint(
            `${ANSI.fg.green}Upgraded ${server.name} from ${ns.formatRam(
              server.details.maxRam / 2
            )} to ${ns.formatRam(server.details.maxRam)}.${ANSI.reset}`
          );
        }
      }
      if (exit) {
        return;
      }
    }
  }

  /** Deploys copies of the scripts in the `scripts/` folder to the servers.
   * @param {Array<UtilServer>} servers
   */
  function deploy_foreman(servers) {
    for (let server of servers) {
      ns.scp(
        ["scripts/_hack.js", "scripts/_grow.js", "scripts/_weaken.js"],
        server.name,
        "home"
      );
    }
  }
}
