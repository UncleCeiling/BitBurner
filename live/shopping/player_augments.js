import { ANSI } from "imports/ANSI";
import { AllServers } from "imports/servers";
/** @param {NS} ns */
export async function main(ns) {
  // ===== CLASSES =====
  class Augment {
    /**
     * @param {String} name
     */
    constructor(name) {
      this.name = name;
    }
  }
  class GraftAugment extends Augment {
    get graft_price() {
      return ns.grafting.getAugmentationGraftPrice(this.name);
    }
    get graft_time() {
      return ns.grafting.getAugmentationGraftTime(this.name);
    }
    get purchasable() {
      if (this.graft_price <= ns.getPlayer().money) {
        if (
          ns.singularity
            .getOwnedAugmentations()
            .includes("violet Congruity Implant")
        ) {
          return true;
        }
        if (this.name == "violet Congruity Implant") {
          return true;
        }
        return false;
      }
    }
  }
  class FactionAugment extends Augment {
    /** @returns {Number} Current price of the Augment */
    get price() {
      return ns.singularity.getAugmentationPrice(this.name);
    }
    /** @returns {Number} Reputation required to purchase */
    get rep() {
      return ns.singularity.getAugmentationRepReq(this.name);
    }
    /** @returns {Array<String>} Array of factions that can current buy this augment */
    get factions() {
      return ns.singularity
        .getAugmentationFactions(this.name)
        .filter((a) => ns.singularity.getFactionRep(a) >= this.rep);
    }
    /** @returns {Array<String>} */
    get pre_req_needed() {
      return ns.singularity
        .getAugmentationPrereq(this.name)
        .filter((a) => !ns.singularity.getOwnedAugmentations(true).includes(a));
    }
    /** @returns {Boolean} `true` if purchasable, `false` otherwise. */
    get purchasable() {
      if (this.price > ns.getPlayer().money) {
        return false;
      } // Not enough cash
      if (this.factions.length <= 0) {
        return false;
      } // Not enough Rep
      if (this.pre_req_needed.length > 0) {
        return false;
      } // Not bought pre_req
      return true;
    }
  }
  class AugmentArray {
    /** Returns a sorted array of graftable augmentations
     * @returns {Array<GraftAugment>}
     */
    get graftable() {
      let money = ns.getPlayer().money;
      return ns.grafting
        .getGraftableAugmentations()
        .map((a) => new GraftAugment(a))
        .filter((a) => a.graft_price <= money)
        .sort((a, b) => a.graft_time - b.graft_time);
    }
    /** Returns an unsorted array of all current faction augmentations
     * @returns {Array<FactionAugment>}
     */
    get faction() {
      let set = new Set();
      for (let faction of ns.getPlayer().factions) {
        // For each joined faction
        let augments = ns.singularity
          .getAugmentationsFromFaction(faction) // Get the augments that the faction provides
          .filter((a) => !this.purchased.includes(a)) // Filter out already purchased augments
          .map((a) => new FactionAugment(a));
        if (
          augments.map((a) => a.rep).sort((a, b) => b - a)[0] >
            ns.singularity.getFactionRep(faction) &&
          this.only_purchased.length == 0
        ) {
          continue;
        } // Skip faction if don't have enough rep for the most expensive aug (only if there aren't any other purchased augs)
        else {
          for (let augment of augments) {
            set.add(augment.name);
          }
        } // Add augments to set
      }
      return Array.from(set).map((a) => new FactionAugment(a));
    }
    /** Returns an array of installed augments
     * @returns {Array<String>}
     */
    get installed() {
      return ns.singularity.getOwnedAugmentations();
    }
    /** Returns an array of installed and purchased augments
     * @returns {Array<String>}
     */
    get purchased() {
      return ns.singularity.getOwnedAugmentations(true);
    }
    /** Returns an array of purchased (but not installed) augments
     * @returns {Array<String>}
     */
    get only_purchased() {
      let installed = ns.singularity.getOwnedAugmentations();
      let all = ns.singularity.getOwnedAugmentations(true);
      if (installed.length == all.length) {
        return [];
      }
      return all.filter((a) => !installed.includes(a));
    }
    /** Returns the Augment details for NFG
     * @returns {FactionAugment}
     */
    get neuroflux_governor() {
      return new FactionAugment("NeuroFlux Governor");
    }
  }

  // ===== MAIN =====
  ns.disableLog("ALL");
  // ns.ui.openTail();
  if (
    ns.grafting
      .getGraftableAugmentations()
      .includes("violet Congruity Implant") &&
    ns.grafting.getAugmentationGraftPrice("violet Congruity Implant") <
      ns.getPlayer().money
  ) {
    // Install vCI if available
    ns.singularity.travelToCity("New Tokyo");
    ns.grafting.graftAugmentation("violet Congruity Implant");
    await ns.grafting.waitForOngoingGrafting();
  }
  if (
    ns.singularity.getOwnedAugmentations().includes("violet Congruity Implant")
  ) {
    await do_grafting();
  } // If vCI is installed, do grafting
  else {
    await buy_augments();
  } // Else buy faction augments

  // ===== FUNCTIONS =====

  /** Attempts to graft each item possible */
  async function do_grafting() {
    let augments = new AugmentArray();
    ns.print(`${ANSI.fg.magenta}Doing Grafting${ANSI.reset}`);
    ns.print(
      `${ANSI.fg.cyan}Graftable Augments Available (${
        augments.graftable.length
      }):\n[ ${augments.graftable.map((a) => a.name).join(" | ")} ]${
        ANSI.reset
      }`
    );
    while (augments.graftable.length > 0) {
      let graft = augments.graftable[0];
      ns.singularity.travelToCity("New Tokyo");
      ns.grafting.graftAugmentation(graft.name);
      await ns.grafting.waitForOngoingGrafting();
    }
  }

  /** Attempts to buy faction augments - If augments are awaiting install, will buy NFG and install. */
  async function buy_augments() {
    let augments = new AugmentArray();
    ns.print(`${ANSI.fg.magenta}Doing Faction Augments${ANSI.reset}`);
    ns.print(
      `${ANSI.fg.cyan}Faction Augments Available (${
        augments.faction.length
      }):\n[ ${augments.faction.map((a) => a.name).join(" | ")} ]${ANSI.reset}`
    );
    let install = true;
    for (let augment of augments.faction.sort((a, b) => b.price - a.price)) {
      if (augment.purchasable) {
        if (
          ns.singularity.purchaseAugmentation(augment.factions[0], augment.name)
        ) {
          ns.tprint(
            `${ANSI.fg.green}Bought ${augment.name} from ${augment.factions[0]}.${ANSI.reset}`
          );
          install = false;
          await ns.asleep(100);
        } else {
          ns.tprint(
            `${ANSI.fg.red}Error buying ${augment.name} from ${
              augment.factions[0]
            }.\nPurchasable: ${augment.purchasable}\nPrice: ${
              augment.price
            }\nRep: ${ns.singularity.getFactionRep(augment.factions[0])}/${
              augment.rep
            }${ANSI.reset}`
          );
        }
      }
    }
    if (augments.only_purchased.length > 0 && install) {
      if (augments.neuroflux_governor.purchasable) {
        while (true) {
          if (
            ns.singularity.purchaseAugmentation(
              augments.neuroflux_governor.factions[0],
              augments.neuroflux_governor.name
            )
          ) {
            ns.tprint(
              `${ANSI.fg.green}Bought ${augments.neuroflux_governor.name} from ${augments.neuroflux_governor.factions[0]}.${ANSI.reset}`
            );
            install = false;
          } else {
            break;
          }
          await ns.asleep(100);
        }
      }
    }
    for (let server of new AllServers(ns).array) {
      if (!server.details.can_backdoor && server.details.backdoored) {
        return;
      }
    } // If any servers are awaiting a backdoor, skip the last step
    if (augments.only_purchased.length > 0 && install) {
      ns.singularity.installAugmentations("boot.js");
    }
  }
}
