import { ANSI } from "imports/ANSI";
/** @param {NS} ns */
export async function main(ns) {
    // Initialise variables
    const CITIES = ["Aevum", "Chongqing", "Ishima", "New Tokyo", "Sector-12", "Volhaven"];
    var player_stats = ns.getPlayer();
    var installed_augments = ns.singularity.getOwnedAugmentations(true);
    var karma = player_stats.karma;
    // Do the stuff
    accept_invites();
    join_bladeburners();
    start_bladeburning();
    if (farm_karma()) { return };
    if (farm_kills()) { return };
    work_for_factions();
    // Search for more factions to get invites from?
    next_city();

    //#region ===== FUNCTIONS =====

    /** Farm Karma */
    function farm_karma() {
        if (karma > -54000) {
            if (ns.singularity.getCurrentWork() == null) { do_homicide() } else if (ns.singularity.getCurrentWork().type != "CRIME") { do_homicide() } else if (ns.singularity.getCurrentWork().crimeType != "Homicide") {
                do_homicide();
                ns.tprint(`${ANSI.fg.cyan}Committing Homicide to decrease Karma${ANSI.reset}`);
                return true
            } else { ns.tprint(`${ANSI.fg.cyan}Continuing to commit Homicide to decrease Karma${ANSI.reset}`); return true };
        } else { return false }
    }

    /** Join Bladeburners*/
    function join_bladeburners() {
        // Join Division
        if (
            ns.bladeburner.inBladeburner() == false &&
            player_stats.skills.strength >= 100 &&
            player_stats.skills.defense >= 100 &&
            player_stats.skills.dexterity >= 100 &&
            player_stats.skills.agility >= 100
        ) {
            if (ns.bladeburner.joinBladeburnerDivision()) {
                ns.tprint(`${ANSI.fg.cyan}Joined Bladeburner Division${ANSI.reset}`);
            } else {
                ns.tprint(`${ANSI.fg.red}Failed to join Bladeburner Division${ANSI.reset}`);
            };
        };
        // Join Faction
        if (player_stats.factions.indexOf("Bladeburners") == -1 && ns.bladeburner.inBladeburner()) { if (ns.bladeburner.joinBladeburnerFaction()) { ns.tprint(`${ANSI.fg.cyan}Joined Bladeburner Faction${ANSI.reset}`) } };
    }

    /** Start bladeburner script */
    function start_bladeburning() {
        if (!ns.isRunning("scripts/bladeburner.js") && ns.bladeburner.inBladeburner()) {
            if (ns.run("scripts/bladeburner.js") == 0) { ns.tprint(`${ANSI.fg.red}Failed to start bladeburner.js${ANSI.reset}`) }
            else { ns.tprint(`${ANSI.fg.cyan}Started bladeburner.js${ANSI.reset}`) };
        };
    }

    /** Accept Faction invitations */
    function accept_invites() {
        let invitations = ns.singularity.checkFactionInvitations();
        for (let invite of invitations) {
            let invited_augments = ns.singularity.getAugmentationsFromFaction(invite);
            invited_augments = invited_augments.filter((a) => !installed_augments.includes(a));
            if (invited_augments.length > 0) {
                if (ns.singularity.joinFaction(invite)) { ns.tprint(`${ANSI.fg.cyan}Joined ${invite} faction.${ANSI.reset}`) }
                else { ns.tprint(`${ANSI.fg.red}Failed to join ${invite} faction.${ANSI.reset}`) }
            };
        };
    }

    /** Find lowest faction rep augment and work for it */
    function work_for_factions() {
        let joined_factions = ns.getPlayer().factions;
        let faction_details = [];
        for (let faction of joined_factions) {
            let work = ns.singularity.getFactionWorkTypes(faction);
            if (work.length == 0) { continue };
            let faction_augments = ns.singularity.getAugmentationsFromFaction(faction).filter((a) => !installed_augments.includes(a));
            let augments_to_buy = [];
            for (let aug of faction_augments) { augments_to_buy.push({ "name": aug, "rep": ns.singularity.getAugmentationRepReq(aug) }) };
            if (augments_to_buy <= 0) { continue };
            faction_details.push({ "name": faction, "work": work, "augments_to_buy": augments_to_buy.sort((a, b) => b.rep - a.rep) });
        };
        if (faction_details.length > 0) {
            faction_details = faction_details.sort((a, b) => a.augments_to_buy[0].rep - b.augments_to_buy[0].rep);
            let faction_choice = faction_details[0];
            if (ns.singularity.workForFaction(faction_choice.name, "field", false)) { ns.tprint(`${ANSI.fg.green}Working in the field for ${faction_choice.name}.${ANSI.reset}`); return true }
            else if (ns.singularity.workForFaction(faction_choice.name, "security", false)) { ns.tprint(`${ANSI.fg.green}Working Security for ${faction_choice.name}.${ANSI.reset}`); return true }
            else if (ns.singularity.workForFaction(faction_choice.name, "hacking", false)) { ns.tprint(`${ANSI.fg.green}Hacking for ${faction_choice.name}.${ANSI.reset}`); return true }
            else { ns.tprint(`${ANSI.fg.red}Failed to start ${work_choice} work for ${faction_choice.name}.${ANSI.reset}`); return false }
        } else { return false }
    }

    /** Move City */
    function next_city() {
        let player_city = CITIES.indexOf(player_stats.city);
        if (player_city <= 0) { player_city += CITIES.length };
        let next_city = CITIES[player_city - 1];
        ns.tprint(`${ANSI.fg.cyan}Travelling from ${player_stats.city} to ${next_city}.${ANSI.reset}`);
        ns.singularity.travelToCity(next_city);
    }

    /** Make sure enough people have been killed */
    function farm_kills() {
        if (player_stats.numPeopleKilled < 30) { do_homicide(); ns.tprint(`${ANSI.fg.cyan}Committing Homicide to increase body-count (${player_stats.numPeopleKilled}/30).${ANSI.reset}`); return true } else { return false }
    }

    /** Do Homicide */
    function do_homicide() { ns.singularity.commitCrime("Homicide", false) };

    //#endregion

}

