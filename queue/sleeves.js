
import { ANSI } from "imports/ANSI";
/** @param {NS} ns */
export async function main(ns) {
    ns.disableLog('ALL');
    // Initialise variables
    let num_sleeves = ns.sleeve.getNumSleeves();
    // Do we have any sleeves?
    if (num_sleeves < 1) { return };
    // Build sleeve list
    let sleeves = [];
    for (let i = 1; i <= num_sleeves; i++) { sleeves.push(i) };
    // For each sleeve
    for (let sleeve in sleeves) {
        if (farm_karma(sleeve)) { continue }
        if (synchronise_sleeve(sleeve)) { continue }
        if (calm_sleeve(sleeve)) { continue }
    };

    //#region ===== FUNCTIONS =====

    /**
     * Decides whether a sleeve should farm karma, then makes them if they should
     * @param {Number} sleeve_num Number of the sleeve
     * @returns {Boolean} `true` when karma farmed, `false` if not.
     */
    function farm_karma(sleeve_num) {
        if (ns.heart.break() > -54000) {
            let task = ns.sleeve.getTask(sleeve_num)
            if (task == null || task.crimeType == null || task.crimeType != "Homicide") {
                ns.sleeve.setToCommitCrime(sleeve_num, "Homicide"); return true
            } else { return true }
        } else { return false }
    }

    /**
     * Decides whether a sleeve should be synced or now, then makes them if they should
     * @param {Number} sleeve_num Number of the sleeve
     * @returns {Boolean} `true` when sleeve is being synced, `false` if not.
     */
    function synchronise_sleeve(sleeve_num) {
        if (ns.sleeve.getSleeve(sleeve_num).sync <= 99) {
            ns.sleeve.setToSynchronize(sleeve_num);
            return true
        } else { return false }
    }

    /**
     * Decides whether a sleeve should be calmed or not, then makes them if they should
     * @param {Number} sleeve_num Number of the sleeve
     * @returns {Boolean} `true` when sleeve is being calmed, `false` if not.
     */
    function calm_sleeve(sleeve_num) {
        if (ns.sleeve.getSleeve(sleeve_num).shock > 0) {
            ns.sleeve.setToShockRecovery(sleeve_num);
            return true
        } else { return false }
    }

    //! WIP Need to know how to buy new sleeves and what the max number is
    //! WIP Would also be good to work out sleeve augments

    // function buy_sleeves() {
    //     ns.tprint(`${ANSI.fg.red}No sleeves to manage.${ANSI.reset}`); return false
    // };
}