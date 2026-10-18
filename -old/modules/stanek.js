import { Achievements } from "imports/achievements";
import { ANSI } from "imports/ANSI";
/** @param {NS} ns */
export async function main(ns) {
  ns.disableLog("ALL");
  const MIN_FREE_RAM = ns
    .ls("home", "modules/")
    .map((a) => ns.getScriptRam(a, "home"))
    .sort((a, b) => b - a)[0];
  if (ns.getServerMaxRam("home") - ns.getServerUsedRam("home") < MIN_FREE_RAM) {
    ns.ui.closeTail();
    ns.tprint(
      `${ANSI.fg.red}Stanek Stopped - Not enough spare RAM on 'home',${ANSI.reset}`
    );
    ns.toast("Stanek Stopped - Not enough spare RAM on 'home'.", "error");
    return;
  }
  if (ns.hacknet.numNodes() == 0 || ns.hacknet.hashCapacity() <= 0) {
    ns.tprint(`${ANSI.fg.red}No Hacknet nodes.${ANSI.reset}`);
    return;
  } // Nope out if no RAM to charge gifts
  if (ns.getBitNodeMultipliers()?.StaneksGiftExtraSize <= -80) {
    ns.tprint(`${ANSI.fg.red}Gift size not worth it.${ANSI.reset}`);
    return;
  } // Nope out if gift is too small
  if (!ns.stanek.acceptGift()) {
    ns.tprint(`${ANSI.fg.red}Failed to accept Stanek's gift${ANSI.reset}`);
    return;
  } // Accept the gift, otherwise nope out.
  while (true) {
    let start = Date.now();
    let gifts = ns.stanek.activeFragments();
    if (gifts == null || gifts.length == 0) {
      // ns.tprint(
      //   `${ANSI.fg.red}No fragments active - Add some to Stanek's gift.${ANSI.reset}`
      // );
      // return;
      await import_gifts();
    }
    gifts = ns.stanek.activeFragments();
    for (let gift of gifts) {
      // For each gift
      if (gift.id >= 100) {
        continue;
      } // Skip boosters
      for (let node = ns.hacknet.numNodes() - 1; node >= 0; node--) {
        // Charge using all RAM available in hacknet
        let details = ns.hacknet.getNodeStats(node);
        let script_ram = ns.getScriptRam("stanek/_charge.js", "home");
        if (script_ram > details.ram) {
          continue;
        } // Nope out if _charge.js costs more than the amount of ram on the server
        let threads = Math.floor(details.ram / script_ram); // Calculate threads
        if (threads == 0) {
          continue;
        }
        while (ns.hacknet.getNodeStats(node).ramUsed > 0) {
          await ns.asleep(1000);
        } // Wait for the hacknet server to be freed
        ns.print(`Charging ${gift.id} (t=${threads}) on ${details.name}.`);
        ns.scp("stanek/_charge.js", details.name, "home"); // Copy charge script to the target server
        if (
          ns.exec("stanek/_charge.js", details.name, threads, gift.x, gift.y) ==
          0
        ) {
          ns.tprint(`Failed to charge gift ID ${gift.id} on ${details.name}`);
        } // Execute with threads and co-ordinates as arguments
      }
    }
    let wait = Date.now() - start;
    ns.print(`${ANSI.fg.magenta}Waiting for ${wait / 1000} secs...`);
    // if (ns.gang.inGang()) { if (ns.gang.getGangInformation().territory >= 1) { wait = wait / 2 } }
    var working_on_achievement = new Achievements(ns).locked.has(
      "MAX_HACKNET_SERVER"
    );
    if (working_on_achievement) {
      await ns.asleep(5000);
      continue;
    }
    await ns.asleep(wait);
  }

  async function import_gifts() {
    let dimensions = `${ns.stanek.giftWidth()}.${ns.stanek.giftHeight()}`; // Get dimensions
    let options = ns.ls("home", "stanek/");
    let choice_list = options.filter((a) => a.includes(".txt"));
    let choices = choice_list.filter((a) => a.includes(dimensions));
    let choice = choices.filter((a) => a.includes("all"));
    let file = "";
    if (choice.length != 1) {
      file = await ns.prompt(
        `Choose a grid to import. (Current Dimensions: ${dimensions})`,
        { type: "select", choices: choice_list }
      );
    } else {
      file = choice[0];
    }
    ns.ui.openTail();
    let lines = ns.read(file).split("\n");
    if (lines.length <= 0) {
      ns.print(`${ANSI.fg.red}Empty File${ANSI.reset}`);
      return;
    }
    let fragments = [];
    for (let line of lines) {
      let items = line.split(",");
      if (items.length > 4) {
        ns.print(
          `${ANSI.fg.red}Line "${line}" has too many items${ANSI.reset}`
        );
        continue;
      }
      if (items.length < 4) {
        ns.print(`${ANSI.fg.red}Line "${line}" has too few items${ANSI.reset}`);
        continue;
      }
      let id = items[0];
      let x = items[1];
      let y = items[2];
      let rot = items[3];
      fragments.push({ id: id, x: x, y: y, rot: rot });
      ns.print(`Found Fragment => ID ${id} | ${x},${y},${rot}`);
    }
    if (fragments.length <= 0) {
      ns.print(`${ANSI.fg.red}No valid lines found${ANSI.reset}`);
      return;
    }
    ns.stanek.clearGift();
    for (let fragment of fragments) {
      if (
        !ns.stanek.placeFragment(
          fragment.x,
          fragment.y,
          fragment.rot,
          fragment.id
        )
      ) {
        ns.print(
          `${ANSI.fg.red}Cannot place fragment => ID: ${fragment.id} | ${fragment.x},${fragment.y},${fragment.rot}${ANSI.reset}`
        );
      } else {
        ns.print(
          `${ANSI.fg.green}Added fragment => ID: ${fragment.id} | ${fragment.x},${fragment.y},${fragment.rot}${ANSI.reset}`
        );
      }
    }
  }
}
