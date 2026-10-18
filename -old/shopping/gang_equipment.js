import { ANSI } from "imports/ANSI";

/** @param {NS} ns */
export async function main(ns) {
  ns.disableLog("ALL");
  if (!ns.gang.inGang()) {
    ns.print(`${ANSI.fg.red}Not currently in a gang.${ANSI.reset}`);
    return;
  }
  const EQUIPMENT = {
    // List of possible equipment
    weapons: [
      "Baseball Bat",
      "Katana",
      "Malorian-3516",
      "Hansen-HA7",
      "Arasaka-HJSH18",
      "Militech-M251s",
      "Nokota-D5",
      "Techtronika-SPT32",
    ],
    armour: [
      "Bulletproof Vest",
      "Full Body Armor",
      "Liquid Body Armor",
      "Graphene Plating Armor",
    ],
    vehicles: [
      "Herrera Outlaw GTS",
      "Yaiba ASM-R250 Muramasa",
      "Rayfield Caliburn",
      "Quadra Sport R-7",
    ],
    root_kits: [
      "NUKE Rootkit",
      "Soulstealer Rootkit",
      "Demon Rootkit",
      "Hmap Node",
      "Jack the Ripper",
    ],
    augments: [
      "Bionic Arms",
      "Bionic Legs",
      "Bionic Spine",
      "BrachiBlades",
      "Nanofiber Weave",
      "Synthetic Heart",
      "Synfibril Muscle",
      "BitWire",
      "Neuralstimulator",
      "DataJack",
      "Graphene Bone Lacings",
    ],
  };
  let members = ns.gang.getMemberNames();
  let bought = 0;
  for (let member of members) {
    for (let group of Object.keys(EQUIPMENT)) {
      for (let item of EQUIPMENT[group]) {
        let budget = ns.getPlayer().money;
        let cost = ns.gang.getEquipmentCost(item);
        if (cost > budget) {
          continue;
        } else {
          if (ns.gang.purchaseEquipment(member, item)) {
            ns.print(
              `${ANSI.fg.green}Bought ${item} for ${member}.${ANSI.reset}`
            );
            bought++;
          }
        }
      }
    }
  }
  if (bought > 0) {
    ns.tprint(
      `${ANSI.fg.green}Bought ${bought} pieces of equipment across ${members.length} members.${ANSI.reset}`
    );
  } else {
    ns.print(`${ANSI.fg.cyan}Nothing bought.${ANSI.reset}`);
  }
}
