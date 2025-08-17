import { Achievements } from "imports/achievements";
import { ANSI } from "imports/ANSI";

/** @param {NS} ns */
export async function main(ns) {
  // Get Budget
  function get_budget() {
    return ns.getServerMoneyAvailable("home");
  }

  // Get node cost
  function get_node_cost() {
    return ns.hacknet.getPurchaseNodeCost();
  }

  // Get num of nodes
  function get_num_nodes() {
    return ns.hacknet.numNodes();
  }

  // Buy node or return `false`
  function buy_node() {
    let budget = get_budget();
    let cost = get_node_cost();
    if (budget > cost) {
      ns.hacknet.purchaseNode();
      num_nodes = get_num_nodes();
      history["nodes"]++;
      history["spent"] += cost;
      return true;
    } else {
      ns.print(
        `${
          ANSI.fg.yellow
        }Not enough cash to buy a node ($${cost.toLocaleString()})${ANSI.reset}`
      );
      return false;
    }
  }

  // Buy level or return `false`
  function buy_level(node) {
    let budget = get_budget();
    let cost = ns.hacknet.getLevelUpgradeCost(node, 1);
    if (cost == Infinity) {
      return false;
    }
    if (budget > cost) {
      if (ns.hacknet.upgradeLevel(node, 1)) {
        history["levels"]++;
        history["spent"] += cost;
        return true;
      } else {
        ns.print(
          `${
            ANSI.fg.red
          }Buying level on node ${node} failed. ($${cost.toLocaleString()})${
            ANSI.reset
          }`
        );
        return false;
      }
    } else {
      ns.print(
        `${
          ANSI.fg.yellow
        }Not enough cash to buy level on node ${node}. ($${cost.toLocaleString()})${
          ANSI.reset
        }`
      );
      return false;
    }
  }

  // Buy ram or return `false`
  function buy_ram(node) {
    let budget = get_budget();
    let cost = ns.hacknet.getRamUpgradeCost(node, 1);
    if (cost == Infinity) {
      return false;
    }
    if (budget > cost) {
      if (ns.hacknet.upgradeRam(node, 1)) {
        history["ram"]++;
        history["spent"] += cost;
        return true;
      } else {
        ns.print(
          `${
            ANSI.fg.red
          }Buying RAM on node ${node} failed. ($${cost.toLocaleString()})${
            ANSI.reset
          }`
        );
        return false;
      }
    } else {
      ns.print(
        `${
          ANSI.fg.yellow
        }Not enough cash to buy RAM on node ${node}. ($${cost.toLocaleString()})${
          ANSI.reset
        }`
      );
      return false;
    }
  }

  // Buy core or return `false`
  function buy_core(node) {
    let budget = get_budget();
    let cost = ns.hacknet.getCoreUpgradeCost(node, 1);
    if (cost == Infinity) {
      return false;
    }
    if (budget > cost) {
      if (ns.hacknet.upgradeCore(node, 1)) {
        history["cores"]++;
        history["spent"] += cost;
        return true;
      } else {
        ns.print(
          `${
            ANSI.fg.red
          }Buying core on node ${node} failed. ($${cost.toLocaleString()})${
            ANSI.reset
          }`
        );
        return false;
      }
    } else {
      ns.print(
        `${
          ANSI.fg.yellow
        }Not enough cash to buy core on node ${node}. ($${cost.toLocaleString()})${
          ANSI.reset
        }`
      );
      return false;
    }
  }

  // Buy cache or return `false`
  function buy_cache(node) {
    let budget = get_budget();
    let cost = ns.hacknet.getCacheUpgradeCost(node, 1);
    if (cost == Infinity) {
      return false;
    }
    if (budget > cost) {
      if (ns.hacknet.upgradeCache(node, 1)) {
        history["cache"]++;
        history["spent"] += cost;
        return true;
      } else {
        ns.print(
          `${
            ANSI.fg.red
          }Buying cache on node ${node} failed. ($${cost.toLocaleString()})${
            ANSI.reset
          }`
        );
        return false;
      }
    } else {
      ns.print(
        `${
          ANSI.fg.yellow
        }Not enough cash to buy cache on node ${node}. ($${cost.toLocaleString()})${
          ANSI.reset
        }`
      );
      return false;
    }
  }

  // Variables
  let history = { nodes: 0, levels: 0, ram: 0, cores: 0, cache: 0, spent: 0 };

  // If no nodes, buy node
  let num_nodes = get_num_nodes();
  if (num_nodes <= 0) {
    buy_node();
    num_nodes = get_num_nodes();
  }
  if (num_nodes == 0) {
    return;
  }

  // Check for achievements
  var achieves = new Achievements(ns);
  var working_on_max_hacknet = true;
  working_on_max_hacknet = !achieves.unlocked.has("MAX_HACKNET_SERVER");
  var working_on_bn9 = true;
  working_on_bn9 = !achieves.unlocked.has("CHALLENGE_BN9");
  var working_on_achievement = working_on_bn9 || working_on_max_hacknet;
  if (working_on_bn9) {
    ns.tprint(`${ANSI.fg.red}Skipping Hacknet for achievement.${ANSI.reset}`);
    return;
  }
  if (working_on_max_hacknet && num_nodes > 0) {
    ns.print(
      `${ANSI.fg.red}Focusing on one Hacknet Node for Achievement.${ANSI.reset}`
    );
  }

  // For each node
  if (working_on_achievement || Math.random() >= 0.5) {
    for (let node = 0; node < num_nodes; node++) {
      if (!working_on_achievement || node == 0) {
        while (buy_ram(node)) {
          continue;
        }
        while (buy_level(node)) {
          continue;
        }
        while (buy_core(node)) {
          continue;
        }
        while (buy_cache(node)) {
          continue;
        }
      }
    }
  } else {
    for (let node = num_nodes - 1; node >= 0; node--) {
      while (buy_level(node)) {
        continue;
      }
      while (buy_ram(node)) {
        continue;
      }
      while (buy_core(node)) {
        continue;
      }
      while (buy_cache(node)) {
        continue;
      }
    }
  }

  // Buy nodes
  while (get_budget() > get_node_cost()) {
    buy_node();
  }

  // Check the history and report what we spent
  if (history.spent > 0) {
    let list = [];
    if (history.nodes > 0) {
      list.push(`${history.nodes} nodes`);
    }
    if (history.cache > 0) {
      list.push(`${history.cache} cache upgrades`);
    }
    if (history.cores > 0) {
      list.push(`${history.cores} cores`);
    }
    if (history.ram > 0) {
      list.push(`${history.ram} ram upgrades`);
    }
    if (history.levels > 0) {
      list.push(`${history.levels} levels`);
    }
    let data = list.join(", ");
    let comma = data.lastIndexOf(",");
    if (comma > 0) {
      data = data.substring(0, comma) + " and" + data.substring(comma + 1);
    }
    ns.tprint(
      `${ANSI.fg.green}Bought ${data}.\n${" ".padEnd(
        ns.getScriptName().length,
        " "
      )}  Total: $${history.spent.toLocaleString()}${ANSI.reset}`
    );
  }
}
