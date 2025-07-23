import { ANSI } from "live/imports/ANSI";
/** @param {NS} ns */
export async function main(ns) {
    ns.disableLog("ALL");
    ns.clearLog();
    let dimensions = `${ns.stanek.giftWidth()}.${ns.stanek.giftHeight()}`; // Get dimensions
    let options = ns.ls("home", "stanek/");
    let choice_list = options.filter((a) => a.includes(".txt"))
    let file = await ns.prompt(`Choose a grid to import. (Current Dimensions: ${dimensions})`, { type: "select", choices: choice_list })
    ns.ui.openTail();
    let lines = ns.read(file).split("\n");
    if (lines.length <= 0) { ns.print(`${ANSI.fg.red}Empty File${ANSI.reset}`); return }
    let fragments = []
    for (let line of lines) {
        let items = line.split(",")
        if (items.length > 4) { ns.print(`${ANSI.fg.red}Line "${line}" has too many items${ANSI.reset}`); continue }
        if (items.length < 4) { ns.print(`${ANSI.fg.red}Line "${line}" has too few items${ANSI.reset}`); continue }
        let id = items[0]
        let x = items[1]
        let y = items[2]
        let rot = items[3]
        fragments.push({ "id": id, "x": x, "y": y, "rot": rot })
        ns.print(`Found Fragment => ID ${id} | ${x},${y},${rot}`)
    }
    if (fragments.length <= 0) { ns.print(`${ANSI.fg.red}No valid lines found${ANSI.reset}`); return }
    ns.stanek.clearGift()
    for (let fragment of fragments) {
        if (!ns.stanek.placeFragment(fragment.x, fragment.y, fragment.rot, fragment.id)) { ns.print(`${ANSI.fg.red}Cannot place fragment => ID: ${fragment.id} | ${fragment.x},${fragment.y},${fragment.rot}${ANSI.reset}`) } else { ns.print(`${ANSI.fg.green}Added fragment => ID: ${fragment.id} | ${fragment.x},${fragment.y},${fragment.rot}${ANSI.reset}`) }
    }
}