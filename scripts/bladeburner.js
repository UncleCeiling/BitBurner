import { ANSI } from "imports/ANSI"
/** @param {NS} ns */
export async function main(ns) {
    ns.tprint(`${ANSI.bg.red}WIP${ANSI.reset}`);
    while (true) {
        await ns.asleep(3600000);
    };
}