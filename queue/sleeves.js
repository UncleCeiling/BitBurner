
import { ANSI } from "imports/ANSI";
/** @param {NS} ns */
export async function main(ns) {
    ns.disableLog('ALL');
    // Initialise variables
    let karma = (ns.heart.break() > -54000);
    let num_sleeves = ns.sleeve.getNumSleeves();
    // Do we have any sleeves?
    if (num_sleeves <= 0) { buy_sleeves() };
    // Build sleeve list
    let sleeves = [];
    for (let i = 1; i <= num_sleeves; i++) { sleeves.push(i) };
    // For each sleeve
    for (let sleeve in sleeves) {
        // Farm Karma
        if (karma) { ns.sleeve.setToCommitCrime(sleeve, "Homicide"); continue };
        // Synchronise
        if (ns.sleeve.getSleeve(sleeve).sync <= 99) { ns.sleeve.setToSynchronize(sleeve); continue };
        // De-shock
        if (ns.sleeve.getSleeve(sleeve).shock <= 99) { ns.sleeve.setToShockRecovery(sleeve); continue };
    };
    /** @param {NS} ns */
    function buy_sleeves() { ns.tprint(`${ANSI.fg.red}No sleeves to manage.${ANSI.reset}`); return };
}