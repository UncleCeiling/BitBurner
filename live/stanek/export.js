import { ANSI } from "live/imports/ANSI";
/** @param {NS} ns */
export async function main(ns) {
    ns.disableLog("ALL")
    let name = await ns.prompt(`Please specify a name for this configuration to be exported as.`, { type: "text" }) // Take name
    if (name == "") { ns.tprint(`${ANSI.fg.red}No name specified.${ANSI.reset}`); return } // Check to make sure a name was entered
    let dimensions = `${ns.stanek.giftWidth()}.${ns.stanek.giftHeight()}` // Get dimensions
    let filename = `stanek/${name}.${dimensions}.txt` // Build filename 
    if (ns.fileExists(filename, "home")) { if (await ns.prompt(`File "${filename}" already exists:\nOverwrite existing file?`) == false) { return } } // If filename already exists, prompt whether to overwrite or not.
    ns.ui.openTail()
    let fragments = ns.stanek.activeFragments()
    let lines = []
    for (let fragment of fragments) { lines.push(`${fragment.id},${fragment.x},${fragment.y},${fragment.rotation}`) } // Get fragment details (x,y,r)
    ns.print(lines.join("\n"))
    ns.rm(filename, "home") // Remove old file
    ns.write(filename, lines.join("\n"), "w") // Create new one
    ns.print(`${ANSI.fg.green}Wrote ${lines.length} lines to ${filename}.${ANSI.reset}`) // Report success
}