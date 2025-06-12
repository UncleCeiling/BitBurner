import { ANSI } from "imports/ANSI";

/** @param {NS} ns */
export async function main(ns) {
    // ===== CLASSES =====
    class History {
        constructor() {
            this.spent = 0;
            this.money = 0;
            this.contracts = 0;
            this.bladeburner_sp = 0;
            this.money_up = 0;
            this.sec_down = 0;
        }
        report() {
            if (history.spent > 0) {
                let list = []
                if (history.contracts > 0) { list.push(`${history.contracts} contracts`) }
                if (history.bladeburner_sp > 0) { list.push(`${history.bladeburner_sp * 10} skill points`) }
                if (history.sec_down > 0) { list.push(`${history.sec_down} security downgrades`) }
                if (history.money_up > 0) { list.push(`${history.money_up} money upgrades`) }
                if (history.money > 0) { list.push(`${history.money} money`) }
                let data = list.join(", ")
                let comma = data.lastIndexOf(",")
                if (comma > 0) { data = data.substring(0, comma) + " and" + data.substring(comma + 1) }
                ns.tprint(`${ANSI.fg.green}Bought ${data} for ${history.spent} hashes.${ANSI.reset}`)
            }
        }
    }

    // ===== MAIN =====

    // Init Spend History
    let history = new History
    // Attempt to buy Contracts
    while (buy_hash_upgrade("Generate Coding Contract")) { history.contracts++ }
    // Assist in Bladeburner overclock
    if (ns.bladeburner.inBladeburner() && ns.bladeburner.getSkillUpgradeCost("Overclock") < Infinity) { while (buy_hash_upgrade("Exchange for Bladeburner SP")) { history.bladeburner_sp++ } }
    // Downgrade Server Sec
    if (ns.getServer("n00dles").minDifficulty > 1) { while (buy_hash_upgrade("Reduce Minimum Security", "n00dles")) { history.sec_down++ } }
    // Upgrade Server Money
    if (ns.getServer("n00dles").moneyMax < 10_000_000_000_000) { while (buy_hash_upgrade("Increase Maximum Money", "n00dles")) { history.money_up++ } }
    // Check if it"s worth buying cash
    let cash_buy = (ns.hacknet.numHashes() / ns.hacknet.hashCost("Sell for Money")) * 1_000_000
    let cash_on_hand = ns.getServerMoneyAvailable("home");
    ns.print(cash_buy, " > ", cash_on_hand)
    // Attempt to buy cash
    if (cash_buy > (cash_on_hand / 2)) { while (buy_hash_upgrade("Sell for Money")) { history.money++ } }
    // Check the history and report what we spent
    history.report()

    // ===== FUNCTIONS =====
    function buy_hash_upgrade(upgrade, target = "") {
        let cost = ns.hacknet.hashCost(upgrade)
        let hashes = ns.hacknet.numHashes()
        if (cost > hashes) { return false }
        else if (target != "") { ns.hacknet.spendHashes(upgrade, target) }
        else { ns.hacknet.spendHashes(upgrade) }
        history.spent += cost
        return true
    }
}