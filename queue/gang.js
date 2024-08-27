/** @param {NS} ns */
export async function main(ns) {
    // if (ns.args[0] != 'live') { ns.tprint('ERROR - Gang function being written'); return }
    ns.disableLog('ALL')
    // ns.tail()
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
    const MIN_WIN_PERCENT = 0.8 // Min win-rate for territory warfare

    function get_members() { return ns.gang.getMemberNames() }

    function get_karma() {
        let karma = Math.floor(-(ns.heart.break()))
        ns.print(`Karma: ${karma}/54000`)
        return karma
    }

    function create_gang() {
        if (ns.gang.inGang()) { ns.print('WARN - Gang already made'); return true }
        else if (get_karma() < 54000) { ns.tprint(`ERROR - Not enough karma (${Math.floor(get_karma() / 540)}%)`); return false }
        else { ns.gang.createGang(GANG_FACTION); return true }
    }

    function recruit_member() { return ns.gang.recruitMember(`Dave ${get_members().length}`) }

    function recruiting() {
        while (get_members().length < MAX_MEMBERS) {
            if (recruit_member()) {
                ns.gang.setMemberTask(get_members()[get_members().length - 1], 'Train Combat')
                ns.tprint(`SUCCESS - Recruited new member: ${get_members()[get_members().length - 1]}`)
            } else { break }
        }
    }

    function task(doing_war, member) {
        let random = Math.random()
        if (random < TRAINING_PERCENT) { ns.gang.setMemberTask(member, 'Train Combat') }
        else {
            let wanted_rate = ns.gang.getGangInformation().wantedLevelGainRate
            // let wanted_penalty = ns.gang.getGangInformation().wantedPenalty
            if (wanted_rate > 0) { ns.gang.setMemberTask(member, 'Vigilante Justice') }
            else if (doing_war) { ns.gang.setMemberTask(member, 'Territory Warfare') }
            else if (get_members().length <= 6) { ns.gang.setMemberTask(member, 'Strongarm Civilians') }
            else if (Math.random() < 0.5) { ns.gang.setMemberTask(member, 'Terrorism') }
            else { ns.gang.setMemberTask(member, 'Human Trafficking') }
        }

    }

    function war() {
        let worst_win_chance = 1
        if (ns.gang.getGangInformation().territory == 1) { return false }
        for (let faction of ENEMY_FACTIONS) {
            let current_win_chance = ns.gang.getChanceToWinClash(faction)
            if (worst_win_chance > current_win_chance) { worst_win_chance = current_win_chance }
        }
        if (worst_win_chance > MIN_WIN_PERCENT) { return true }
        else { return false }

    }

    function ascension() {
        for (let member of get_members()) {
            let result = ns.gang.getAscensionResult(member)
            if (result) {
                let lowestMulti = Math.min(result.str, result.def, result.dex, result.agi)
                if (lowestMulti > ASCENSION_MULTIPLIER) { ns.print(`SUCCESS - Ascended ${member}`); ns.gang.ascendMember(member) }
            }
        }
    }

    if (!ns.gang.inGang()) { create_gang() }
    else {
        ascension()
        let doing_war = war()
        if (doing_war) { ns.gang.setTerritoryWarfare(1) } else { ns.gang.setTerritoryWarfare(0) }
        for (let member of get_members()) {
            await ns.gang.nextUpdate();
            task(doing_war, member)
        }
        recruiting()
        ns.tprint(`INFO\nFaction: ${GANG_FACTION}\nKarma: ${get_karma()}\nMembers: ${get_members()}`)
    }
}