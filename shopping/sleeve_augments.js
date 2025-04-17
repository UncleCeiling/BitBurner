import { ANSI } from "imports/ANSI";
/** @param {NS} ns */
export async function main(ns) {
    var history = { "augments": 0, "money": 0 }
    let num_sleeves = ns.sleeve.getNumSleeves();
    if (num_sleeves < 1) { return };
    let sleeves = [];
    for (let i = 1; i <= num_sleeves; i++) { sleeves.push(i) };
    for (let sleeve of sleeves) {
        // Skip sleeves with no purchasable augments
        if (purchasable_augs().length == 0) { continue };
        // for each augment in the list of augments available to purchase (sorted by descending cost)
        for (let augment of purchasable_augs(sleeve)) { buy_augment(sleeve_num, augment.name, augment.cost) };
    }
    print_history()

    //#region ===== FUNCTIONS =====

    /**
     * Given a specific sleeve, return all purchasable augments and their costs.
     * @param {Number} sleeve_num Number of the sleeve
     * @returns {import("NetscriptDefinitions").AugmentPair}
     */
    function purchasable_augs(sleeve_num) {
        return ns.sleeve.getSleevePurchasableAugs(sleeve_num).sort((a, b) => b.cost - a.cost)
    }

    /**
     * Attempts to buy a given augment, incrementing the history accordingly
     * @param {Number} sleeve_num 
     * @param {String} augment_name 
     * @param {Number} augment_cost 
     * @returns {Boolean} `true` if successful, `false` otherwise
     */
    function buy_augment(sleeve_num, augment_name, augment_cost) {
        if (ns.getServerMoneyAvailable('home') > augment_cost) {
            if (ns.sleeve.purchaseSleeveAug(sleeve_num, augment_name)) {
                history.augments++;
                history.money += augment_cost;
                ns.print(`${ANSI.fg.green}Sleeve ${sleeve_num} bought ${augment_name} for ${augment_cost}.${ANSI.reset}`);
                return true
            } else {
                ns.print(`${ANSI.fg.red}Sleeve ${sleeve_num} could not purchase ${augment_name} for ${augment_cost} (Bank:${ns.getServerMoneyAvailable('home')}).${ANSI.reset}`);
                return false
            }
        }
    }

    /**
     * Prints the purchase history, if appropriate.
     */
    function print_history() {
        if (history.augments > 0) {
            ns.tprint(`${ANSI.fg.green}Bought ${history.augments} augments for $${history.money}.${ANSI.reset}`);
        }
    }

    //#endregion

}