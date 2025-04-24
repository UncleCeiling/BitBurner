
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
        if (farm_karma(sleeve)) { continue };
        if (calm_sleeve(sleeve)) { continue };
        if (synchronise_sleeve(sleeve)) { continue };
        if (homicide(sleeve)) { continue };
        if (bladeburn(sleeve)) { continue };
        heist(sleeve);
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
        if (ns.sleeve.getSleeve(sleeve_num).sync < 100) {
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

    /**
     * Calculates the success chance for the sleeve attempting a crime.
     * @param {Number} sleeve_num Number of the sleeve
     * @returns {Number} Chance of success where 1 = 100%
     */
    function calc_crime_success(sleeve_num, crime) {
        let stats = ns.sleeve.getSleeve(sleeve_num);
        const CRIME_WEIGHTS = {
            "Homicide":
            {
                "hacking_weight": 0,
                "strength_weight": 2,
                "defense_weight": 2,
                "dexterity_weight": 0.5,
                "agility_weight": 0.5,
                "charisma_weight": 0,
                "difficulty": 1,
            },
            "Heist":
            {
                "hacking_weight": 1,
                "strength_weight": 1,
                "defense_weight": 1,
                "dexterity_weight": 1,
                "agility_weight": 1,
                "charisma_weight": 1,
                "difficulty": 18,
            }
        }
        let crime_chances = {}
        for (let crime of Object.keys(CRIME_WEIGHTS)) {
            let chance = (
                (CRIME_WEIGHTS[crime].hacking_weight * stats.skills.hacking) +
                (CRIME_WEIGHTS[crime].strength_weight * stats.skills.strength) +
                (CRIME_WEIGHTS[crime].defense_weight * stats.skills.defense) +
                (CRIME_WEIGHTS[crime].dexterity_weight * stats.skills.dexterity) +
                (CRIME_WEIGHTS[crime].agility_weight * stats.skills.agility) +
                (CRIME_WEIGHTS[crime].charisma_weight * stats.skills.charisma) +
                (0.025 * stats.skills.intelligence)
            )
            chance /= 975;
            chance /= CRIME_WEIGHTS[crime].difficulty;
            chance *= stats.mults.crime_success;
            chance *= ns.getBitNodeMultipliers().CrimeSuccessRate;
            chance *= 1 + (Math.pow(ns.getPlayer().skills.intelligence, 0.8)) / 600
            crime_chances[crime] = chance
        }
        return Math.min(crime_chances[crime], 1)
    }

    /**
     * Decides if a sleeve should do homicide, then makes them if they should
     * @param {Number} sleeve_num Number of the sleeve
     * @returns {Boolean} `true` when sleeve is being calmed, `false` if not.
     */
    function homicide(sleeve_num) {
        let current_task = ns.sleeve.getTask(sleeve_num)
        let success_chance = calc_crime_success(sleeve_num, "Homicide");
        if (success_chance < 1) {
            if (current_task != null && current_task.crimeType != null && current_task.crimeType == "Homicide") { return true }
            ns.sleeve.setToCommitCrime(sleeve_num, "Homicide"); return true
        };
        return false
    }

    /**
     * Decides if a sleeve should assist in Bladeburner Actions, then makes them if they should
     * @param {Number} sleeve_num Number of the sleeve
     * @returns {Boolean} `true` when sleeve is being calmed, `false` if not.
     */
    function bladeburn(sleeve_num) {
        if (!ns.bladeburner.inBladeburner()) { return false };
        if (ns.bladeburner.getNextBlackOp() == null) { return false };
        let contracts = ns.bladeburner.getContractNames();
        let operations = ns.bladeburner.getOperationNames();
        let num_remaining = 0;
        for (let contract of contracts) {
            let contract_remaining = Math.floor(ns.bladeburner.getActionCountRemaining("Contracts", contract));
            if (contract_remaining > 0) { num_remaining += contract_remaining };
        }
        for (let operation of operations) {
            let operation_remaining = Math.floor(ns.bladeburner.getActionCountRemaining("Operations", operation));
            if (operation_remaining > 0) { num_remaining += operation_remaining };
        }
        if (num_remaining < 100) { ns.sleeve.setToBladeburnerAction(sleeve_num, "Infiltrate Synthoids"); return true }
        if (ns.bladeburner.getCurrentAction() != null && ns.bladeburner.getCurrentAction().type != "General") { ns.sleeve.setToBladeburnerAction(sleeve_num, "Support main sleeve"); return true }
        else { return false }
    }

    /**
     * Decides if a sleeve should do homicide, then makes them if they should
     * @param {Number} sleeve_num Number of the sleeve
     * @returns {Boolean} `true` when sleeve is being calmed, `false` if not.
     */
    function heist(sleeve_num) {
        let current_task = ns.sleeve.getTask(sleeve_num)
        if (current_task != null && current_task.crimeType != null && current_task.crimeType == "Heist") { return true }
        ns.sleeve.setToCommitCrime(sleeve_num, "Heist")
        return true
    }

    //! WIP Need to know how to buy new sleeves and what the max number is
    //! WIP Would also be good to work out sleeve augments

    // function buy_sleeves() {
    //     ns.tprint(`${ANSI.fg.red}No sleeves to manage.${ANSI.reset}`); return false
    // };
}