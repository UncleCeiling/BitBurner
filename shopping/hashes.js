import { ANSI } from "imports/ANSI";
import * as util from "imports/utils"
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
    let history = new History; // Init Spend History
    while (buy_hash_upgrade("Generate Coding Contract")) { history.contracts++ }; // Attempt to buy Contracts
    if (ns.bladeburner.inBladeburner() && ns.bladeburner.getSkillUpgradeCost("Overclock") < Infinity) { while (buy_hash_upgrade("Exchange for Bladeburner SP")) { history.bladeburner_sp++ } }; // Assist in Bladeburner overclock
    server_upgrade(); // Use Hashes to upgrade servers
    let cash_buy = (ns.hacknet.numHashes() / ns.hacknet.hashCost("Sell for Money")) * 1_000_000;  // Check if it"s worth buying cash
    let cash_on_hand = ns.getServerMoneyAvailable("home");
    if (cash_buy > (cash_on_hand / 2)) { while (buy_hash_upgrade("Sell for Money")) { history.money++ } }; // Attempt to buy cash
    history.report(); // Check the history and report what we spent

    // ===== FUNCTIONS =====
    function buy_hash_upgrade(upgrade, target = "") {
        let cost = ns.hacknet.hashCost(upgrade);
        let hashes = ns.hacknet.numHashes();
        if (cost > hashes) { return false }
        else if (target != "") { ns.hacknet.spendHashes(upgrade, target) }
        else { ns.hacknet.spendHashes(upgrade) };
        history.spent += cost;
        return true;
    }

    function server_upgrade() {
        let servers = new util.AllServers(ns).array.filter((a) => a.details.backdoorInstalled)
        for (let server of servers.sort((a, b) => b.details.minDifficulty - a.details.minDifficulty)) {
            if (server.details.minDifficulty > 1) { while (buy_hash_upgrade("Reduce Minimum Security", server.name)) { history.sec_down++ } }; // Downgrade Server Sec
        }
        for (let server of servers.sort((a, b) => b.details.moneyMax - a.details.moneyMax)) {
            // if (server.details.moneyMax < 10_000_000_000_000) {
            while (buy_hash_upgrade("Increase Maximum Money", server.name)) { history.money_up++ }// Upgrade Server Money
            // }; 
        }
    }
}