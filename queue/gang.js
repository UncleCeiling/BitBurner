import { ANSI } from "imports/ANSI"
/** @param {NS} ns */
export async function main(ns) {
    ns.disableLog('ALL')
    const GANG_FACTION = "Slum Snakes" // My Chosen Faction
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
    const TRAINING_PERCENT = 0.2
    const MIN_WIN_PERCENT = 0.55 // Min win-rate for territory warfare

    function get_members() { return ns.gang.getMemberNames() }

    function get_karma() {
        let karma = Math.floor(ns.heart.break())
        ns.print(`Karma: ${karma}/-54000`)
        return karma
    }

    function create_gang() {
        if (ns.gang.inGang()) { ns.print(`${ANSI.fg.yellow}Gang already made${ANSI.reset}`); return true }
        else if (get_karma() > -54000) { ns.tprint(`${ANSI.fg.yellow}Not enough karma ${get_karma()}/-54000 (${Math.floor(get_karma() / -540)}%)${ANSI.reset}`); return false }
        else { ns.gang.createGang(GANG_FACTION); return true }
    }

    function recruit_member() {
        for (var i = 0; i <= get_members().length; i++) { if (ns.gang.recruitMember(`Dave ${i}`)) { return i } else { continue } }
        return -1
    }

    function recruiting() {
        while (get_members().length < MAX_MEMBERS) {
            let member = recruit_member()
            if (member != -1) {
                ns.gang.setMemberTask(`Dave ${member}`, 'Train Combat')
                ns.tprint(`${ANSI.fg.green} Recruited new member: Dave ${member}${ANSI.reset}`)
            } else { ns.print(`${ANSI.fg.red}Failed to recruit new member.${ANSI.reset}`); return }
        }
    }

    function task(doing_war, member) {
        let random = Math.random()
        let wanted_level = ns.gang.getGangInformation().wantedLevel
        let wanted_rate = ns.gang.getGangInformation().wantedLevelGainRate
        let wanted_penalty = ns.gang.getGangInformation().wantedPenalty
        if ((wanted_level >= 1000 && wanted_rate >= 0 && ns.gang.getGangInformation().respect > 10) || (wanted_penalty < 0.8 && wanted_level > 1 && ns.gang.getGangInformation().respect > 10)) { ns.gang.setMemberTask(member, 'Vigilante Justice') }
        else if (doing_war) { ns.gang.setMemberTask(member, 'Territory Warfare') }
        else if (ns.gang.getGangInformation().territory != 1) {
            if (random < TRAINING_PERCENT && get_members().length < 6) { ns.gang.setMemberTask(member, 'Train Combat') }
            else if (get_members().length >= 12) { ns.gang.setMemberTask(member, 'Territory Warfare') }
            else { ns.gang.setMemberTask(member, 'Terrorism') }
        } else { ns.gang.setMemberTask(member, 'Human Trafficking') }
    }

    function war() {
        let worst_win_chance = 1
        if (ns.gang.getGangInformation().territory == 1) { return false }
        for (let faction of ENEMY_FACTIONS) {
            let current_win_chance = ns.gang.getChanceToWinClash(faction)
            if (worst_win_chance > current_win_chance && ns.gang.getOtherGangInformation()[faction].territory > 0) { worst_win_chance = current_win_chance }
        }
        ns.print('Win chance: ' + worst_win_chance)
        if (worst_win_chance > MIN_WIN_PERCENT && get_members().length >= 2) { return true }
        else { return false }

    }

    function ascension() {
        if (get_members().length < 12) { return }
        for (let member of get_members()) {
            let result = ns.gang.getAscensionResult(member)
            if (result) {
                let avg_multi = (result.agi + result.cha + result.def + result.dex + result.hack + result.str) / 6
                if (avg_multi > ASCENSION_MULTIPLIER) { ns.print(`${ANSI.fg.green}Ascended ${member}${ANSI.reset}`); ns.gang.ascendMember(member) }
            }
        }
    }

    if (!ns.gang.inGang()) { create_gang() }
    else {
        ascension()
        let doing_war = war()
        if (doing_war) { ns.gang.setTerritoryWarfare(1) } else { ns.gang.setTerritoryWarfare(0) }
        ns.tprint(`${ANSI.fg.cyan}\nFaction: ${GANG_FACTION}\nKarma: ${get_karma()}/-54000\nMembers: ${get_members()}\nDoing War: ${doing_war}${ANSI.reset}`)
        recruiting()
        for (let member of get_members()) {
            await ns.gang.nextUpdate();
            task(doing_war, member)
        }
    }
}