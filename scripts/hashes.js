/** @param {NS} ns */
export async function main(ns) {

    // Init Spend History
    let history = { 'money': 0, 'contracts': 0, 'spent': 0 }
    // Attempt to buy hashes
    while (buy_hash_upgrade('Generate Coding Contract')) { history.contracts++ }
    // Check if it's worth buying cash
    let cash_buy = ns.hacknet.numHashes() / ns.hacknet.hashCost('Sell for Money')
    let cash_on_hand = ns.getServerMoneyAvailable('home');
    // Attempt to buy cash
    if (cash_buy > cash_on_hand) { while (buy_hash_upgrade('Sell for Money')) { history.money++ } }
    // Check the history and report what we spent
    if (history.spent > 0) {
        let list = []
        if (history.contracts > 0) { list.push(`${history.contracts} contracts`) }
        if (history.money > 0) { list.push(`${history.money} money`) }
        let data = list.join(', ')
        let comma = data.lastIndexOf(',')
        if (comma > 0) { data = data.substring(0, comma) + ' and' + data.substring(comma + 1) }
        ns.tprint(`SUCCESS - Bought ${data}.\n${' '.padEnd((ns.getScriptName().length), ' ')}  Hashes spent: ${history.spent}`)
    }
    function buy_hash_upgrade(upgrade, target = '') {
        let cost = ns.hacknet.hashCost(upgrade)
        let hashes = ns.hacknet.numHashes()
        if (cost > hashes) { return false }
        else if (target != '') { ns.hacknet.spendHashes(upgrade, target) }
        else { ns.hacknet.spendHashes(upgrade) }
        history.spent += cost
        return true
    }
}