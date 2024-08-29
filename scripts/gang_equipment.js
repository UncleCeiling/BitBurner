/** @param {NS} ns */
export async function main(ns) {
    ns.disableLog('ALL')
    // ns.tail()
    if (!ns.gang.inGang()) { ns.tprint('ERROR - Not currently in a gang.'); return }
    const EQUIPMENT = { // List of possible equipment
        'weapons': [
            "Baseball Bat",
            "Katana",
            "Glock 18C",
            "P90C",
            "Steyr AUG",
            "AK-47",
            "M15A10 Assault Rifle",
            "AWM Sniper Rifle"
        ],
        'armour': [
            "Bulletproof Vest",
            "Full Body Armor",
            "Liquid Body Armor",
            "Graphene Plating Armor"
        ],
        'vehicles': [
            "Ford Flex V20",
            "ATX1070 Superbike",
            "Mercedes-Benz S9001",
            "White Ferrari"
        ],
        'root_kits': [
            "NUKE Rootkit",
            "Soulstealer Rootkit",
            "Demon Rootkit",
            "Hmap Node",
            "Jack the Ripper"
        ],
        'augments': [
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
            "Graphene Bone Lacings"
        ]
    }
    let members = ns.gang.getMemberNames()
    let bought = 0
    for (let member of members) {
        for (let group of Object.keys(EQUIPMENT)) {
            for (let item of EQUIPMENT[group]) {
                let budget = ns.getPlayer().money
                let cost = ns.gang.getEquipmentCost(item)
                if (cost > budget) { continue }
                else {
                    if (ns.gang.purchaseEquipment(member, item)) { ns.print(`SUCCESS - Bought ${item} for ${member}.`); bought++ }
                }
            }
        }
    }
    if (bought > 0) { ns.tprint(`SUCCESS - Bought ${bought} pieces of equipment across ${members.length} members.`) }
    else { ns.tprint('INFO - Nothing bought.') }
}