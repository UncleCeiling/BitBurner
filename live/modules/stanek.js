import { ANSI } from "imports/ANSI";
/** @param {NS} ns */
export async function main(ns) {
    ns.disableLog("ALL")
    const MIN_FREE_RAM = ns.ls("home", "modules/").map((a) => ns.getScriptRam(a, "home")).sort((a, b) => b - a)[0]
    if (ns.hacknet.numNodes() == 0) { ns.tprint(`${ANSI.fg.red}No Hacknet nodes.${ANSI.reset}`); return } // Nope out if no RAM to charge gifts
    if (ns.getBitNodeMultipliers()?.StaneksGiftExtraSize <= -80) { ns.tprint(`${ANSI.fg.red}Gift size not worth it.${ANSI.reset}`); return } // Nope out if gift is too small

    if (!ns.stanek.acceptGift()) {
        // ns.tprint(`${ANSI.fg.red}Failed to accept Stanek's gift${ANSI.reset}`);
        return;
    } // Accept the gift, otherwise nope out.
    while (true) {
        let start = Date.now()
        let gifts = ns.stanek.activeFragments()
        if (gifts == null || gifts.length == 0) { ns.tprint(`${ANSI.fg.red}No fragments active - Add some to Stanek's gift.${ANSI.reset}`); return } // Remind player to assign gifts.
        for (let gift of gifts) { // For each gift
            if (gift.id >= 100) { continue } // Skip boosters
            for (let node = ns.hacknet.numNodes() - 1; node >= 0; node--) { // Charge using all RAM available in hacknet
                let details = ns.hacknet.getNodeStats(node)
                let script_ram = ns.getScriptRam("stanek/_charge.js", "home")
                if (script_ram > details.ram) { continue } // Nope out if _charge.js costs more than the amount of ram on the server
                let threads = Math.floor(details.ram / script_ram) // Calculate threads
                while (ns.hacknet.getNodeStats(node).ramUsed > 0) { await ns.asleep(100) } // Wait for the hacknet server to be freed
                ns.print(`Charging ${gift.id} (t=${threads}) on ${details.name}.`)
                ns.scp("stanek/_charge.js", details.name, "home") // Copy charge script to the target server
                if (ns.exec("stanek/_charge.js", details.name, threads, gift.x, gift.y) == 0) { ns.tprint(`Failed to charge gift ID ${gift.id} on ${details.name}`) } // Execute with threads and co-ordinates as arguments
            }
        }
        if (ns.getServerMaxRam('home') - ns.getServerUsedRam('home') < MIN_FREE_RAM) {
            ns.ui.closeTail();
            ns.tprint(`${ANSI.fg.red}Stanek Stopped - Not enough spare RAM on 'home',${ANSI.reset}`);
            ns.toast("Stanek Stopped - Not enough spare RAM on 'home'.", "error");
            return;
        };
        let wait = Date.now() - start
        ns.print(`${ANSI.fg.magenta}Waiting for ${wait / 1000} secs...`)
        // if (ns.gang.inGang()) { if (ns.gang.getGangInformation().territory >= 1) { wait = wait / 2 } }
        await ns.asleep(wait)
    }
}