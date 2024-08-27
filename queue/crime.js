/** @param {NS} ns */
export async function main(ns) {
    // Get Karma
    ns.tprint('ERROR - Not written yet')
    return
    // ns.tail()
    let player_stats = ns.getPlayer()
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


}