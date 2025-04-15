import { ANSI } from "imports/ANSI";
/** @param {NS} ns */
export async function main(ns) {
    // Initialise variables
    let player_stats = ns.getPlayer();
    let karma = player_stats.karma;
    // Farm Karma
    if (karma > -54000) {
        if (ns.singularity.getCurrentWork() == null) { do_homicide() } else if (ns.singularity.getCurrentWork().type != "CRIME") { do_homicide() } else if (ns.singularity.getCurrentWork().crimeType != "Homicide") { do_homicide() }
        else { ns.tprint(`${ANSI.fg.cyan}Continuing to commit Homicide to decrease Karma${ANSI.reset}`) };
    };
    // Join Bladeburners Division
    if (
        ns.bladeburner.inBladeburner() == false &&
        player_stats.skills.strength >= 100 &&
        player_stats.skills.defense >= 100 &&
        player_stats.skills.dexterity >= 100 &&
        player_stats.skills.agility >= 100
    ) {
        if (ns.bladeburner.joinBladeburnerDivision()) { ns.tprint(`${ANSI.fg.cyan}Joined Bladeburner Division${ANSI.reset}`) }
        else { ns.tprint(`${ANSI.fg.red}Failed to join Bladeburner Division${ANSI.reset}`) }
    };
    // Join Bladeburners Faction
    if (player_stats.factions.indexOf("Bladeburners") == -1) { if (ns.bladeburner.joinBladeburnerFaction()) { ns.tprint(`${ANSI.fg.cyan}Joined Bladeburner Faction${ANSI.reset}`) } }
    // Start bladeburner script
    if (!ns.isRunning("scripts/bladeburner.js")) {
        if (ns.run("scripts/bladeburner.js") == 0) { ns.tprint(`${ANSI.fg.red}Failed to start bladeburner.js${ANSI.reset}`) }
        else { ns.tprint(`${ANSI.fg.cyan}Started bladeburner.js${ANSI.reset}`) }
    };
    return;

    /** @param {NS} ns */
    function do_homicide() {
        ns.singularity.commitCrime("Homicide", false);
        ns.tprint(`${ANSI.fg.cyan}Committing Homicide to decrease Karma${ANSI.reset}`);
    };

    // ns.tail()
    // stats.skills.
    //             .agility
    //             .charisma
    //             .defense
    //             .dexterity
    //             .hacking
    //             .intelligence
    //             .strength
    // stats.karma
    // stats.numPeopleKilled

    // Build crimes details from Crimes lists
    let crime_list = ['Assassination', 'Bond Forgery', 'Deal Drugs', 'Grand Theft Auto', 'Heist', 'Homicide', 'Kidnap', 'Larceny', 'Mug', 'Rob Store', 'Shoplift', 'Traffick Arms']
    let crimes = {}
    for (let crime of crime_list) {
        crimes[crime] = { 'stats': ns.singularity.getCrimeStats(crime), 'chance': ns.singularity.getCrimeChance(crime) }
    }
    for (let crime of crime_list) {
        ns.print(crimes[crime])
    }

    // Calculate best crime for each stat
    // let stat_list = ['agility', 'charisma', 'defense', 'dexterity', 'hacking', 'strength']
    // let stats = {}
    // for (let stat of stat_list) {
    //     for (let crime of crimes) {
    //         let name = crime.keys()[0]
    //         let exp = crime['stats'][`${stat}_exp`]
    //         if (exp <= stats[stat]['exp']) { continue }
    //         stats[stat] = { 'crime': name, 'exp': exp }
    //     }
    // }


    // let stat_to_crime = {}

    // If not killed enough, kill more
    // if (stats.numPeopleKilled < 30) { ns.singularity.commitCrime(crimes['Assassination'], false) }
    // if (stats.agility < 300) { ns.singularity, commitCrime(stat_to_crime.agility, false) }


};