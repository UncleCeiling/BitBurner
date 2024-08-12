/** @param {NS} ns */
export async function main(ns) {
    if (ns.args[0] != 'live') { ns.tprint('ERROR - Gang function being written'); return }
    ns.disableLog('ALL')
    const GANG_FACTION = "Slum Snakes" // My Chosen Faction
    const EQUIPMENT = { // List of possible equipment
        'WEAPONS': [
            "Baseball Bat",
            "Katana",
            "Glock 18C",
            "P90C",
            "Steyr AUG",
            "AK-47",
            "M15A10 Assault Rifle",
            "AWM Sniper Rifle"
        ],
        'ARMOR': [
            "Bulletproof Vest",
            "Full Body Armor",
            "Liquid Body Armor",
            "Graphene Plating Armor"
        ],
        'VEHICLES': [
            "Ford Flex V20",
            "ATX1070 Superbike",
            "Mercedes-Benz S9001",
            "White Ferrari"
        ],
        'ROOTKITS': [
            "NUKE Rootkit",
            "Soulstealer Rootkit",
            "Demon Rootkit",
            "Hmap Node",
            "Jack the Ripper"
        ],
        'AUGMENTS': [
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
    const ENEMY_FACTIONS = [ // List of enemies
        "Tetrads",
        "The Syndicate",
        "The Dark Army",
        "Speakers for the Dead",
        "NiteSec",
        "The Black Hand"
    ]
    const ASCENSION_MULTIPLIER = 1.6487212707 // Minimum increase in stats for ascension
    const MAX_MEMBERS = 12 // Max num of gang members
    const TRAINING_PERCENT = 0.2 // Proportion of gang-members to 
    const MIN_WIN_PERCENT = 0.8
}