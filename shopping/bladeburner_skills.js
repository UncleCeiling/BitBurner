import { ANSI } from "imports/ANSI"
/** @param {NS} ns */
export async function main(ns) {
    ns.disableLog("ALL");
    if (!ns.bladeburner.inBladeburner()) { return }
    let skills = ns.bladeburner.getSkillNames();
    let skill_levels = [];
    let success = true;
    while (success) {
        for (let skill of skills) {
            let level = ns.bladeburner.getSkillLevel(skill);
            let cost = ns.bladeburner.getSkillUpgradeCost(skill);
            if (skill == "Overclock") {
                while (get_skill_points() > ns.bladeburner.getSkillUpgradeCost("Overclock")) {
                    if (ns.bladeburner.upgradeSkill("Overclock")) {
                        ns.tprint(`${ANSI.fg.green}Bought Overclock for ${cost} points (Level: ${level + 1})${ANSI.reset}`);
                    } else {
                        ns.tprint(`${ANSI.fg.red}Failed to buy Overclock for ${cost} points (Current points: ${points})${ANSI.reset}`);
                    };
                    cost = ns.bladeburner.getSkillUpgradeCost(skill)
                    level = ns.bladeburner.getSkillLevel(skill)
                }
            }
            if (cost < Infinity) { skill_levels.push({ "name": skill, "level": level, "cost": cost }) };
        };
        success = false;
        for (let item of skill_levels.sort((a, b) => b.cost - a.cost)) {
            if (item.name == "Overclock" && item.level >= 90) { continue };
            let points = get_skill_points();
            if (points > item.cost) {
                if (ns.bladeburner.upgradeSkill(item.name)) {
                    ns.tprint(`${ANSI.fg.green}Bought ${item.name} for ${item.cost} points (Level: ${item.level + 1})${ANSI.reset}`);
                    success = true;
                } else {
                    ns.tprint(`${ANSI.fg.red}Failed to buy ${item.name} for ${item.cost} points (Current points: ${points})${ANSI.reset}`);
                };
            };
        };
        if (success) { await ns.asleep(100) } else { return };
    };
    /** @param {NS} ns */
    function get_skill_points() { return ns.bladeburner.getSkillPoints() };
};