import { Achievements } from "imports/achievements";
import { ANSI } from "imports/ANSI";

/** @param {NS} ns */
export async function main(ns) {
  ns.disableLog("ALL");
  ns.clearLog();
  var working_on_achievement = new Achievements(ns).locked.has(
    "MAX_HACKNET_SERVER"
  );
  let servers = new Set(["home"]);
  // ns.ui.openTail();
  for (let server of servers) {
    ns.print(`${ANSI.fg.magenta}Scanning ${server}...${ANSI.reset}`);
    for (let result of ns.scan(server)) {
      let candidate = ns.getServer(result);
      if (candidate.hostname == "home" || candidate.purchasedByPlayer) {
        continue;
      }
      if (candidate.hostname == "w0r1d_d43m0n" && working_on_achievement) {
        ns.print(
          `${ANSI.fg.red}Skipping w0r1d_d43m0n for achievement${ANSI.reset}`
        );
        continue;
      }
      if (
        !candidate.backdoorInstalled &&
        candidate.hasAdminRights &&
        candidate.hostname != "home" &&
        candidate.requiredHackingSkill <= ns.getPlayer().skills.hacking
      ) {
        let eta_secs = Math.ceil(ns.getHackTime(candidate.hostname) / 4000);
        ns.print(
          `${ANSI.fg.cyan}Backdooring ${candidate.hostname} (${eta_secs} secs)${ANSI.reset}`
        );
        ns.singularity.connect(server);
        ns.singularity.connect(candidate.hostname);
        await ns.singularity.installBackdoor();
        if (ns.getServer(candidate.hostname).backdoorInstalled) {
          ns.tprint(
            `${ANSI.fg.green}${candidate.hostname} successfully backdoored.${ANSI.reset}`
          );
        } else {
          ns.tprint(
            `${ANSI.fg.red}${candidate.hostname} backdoor failed.${ANSI.reset}`
          );
        }
        ns.singularity.connect("home");
        servers.add(candidate.hostname);
      } else if (candidate.backdoorInstalled) {
        servers.add(candidate.hostname);
      }
    }
  }
  ns.ui.closeTail();
}
