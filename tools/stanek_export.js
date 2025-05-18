import { ANSI } from "imports/ANSI";
/** @param {NS} ns */
export async function main(ns) {
    ns.disableLog("ALL")
    let name = ns.args[0]
    if (name == null || name == "") { ns.tprint(`${ANSI.fg.red}No name specified.${ANSI.reset}`); return } // Check for name
    let dimensions = `${ns.stanek.giftWidth()}.${ns.stanek.giftHeight()}` // Get dimensions
    let filename = `stanek/${name}.${dimensions}.txt`
    if (ns.fileExists(filename, "home")) { if (await ns.prompt(`File "${filename}" already exists:\nOverwrite existing file?`) == false) { return } }
    ns.ui.openTail()
    let fragments = ns.stanek.activeFragments()
    let lines = []
    for (let fragment of fragments) { lines.push(`${fragment.id},${fragment.x},${fragment.y},${fragment.rotation}`) } // Get fragment details (x,y,r)
    ns.print(lines.join("\n"))
    ns.rm(filename, "home")
    ns.write(filename, lines.join("\n"), "w")
    ns.print(`${ANSI.fg.green}Wrote ${lines.length} lines to ${filename}.${ANSI.reset}`)
}