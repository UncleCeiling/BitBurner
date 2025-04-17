import { SOLUTIONS } from "queue/contracts";

/** @param {NS} ns */
export async function main(ns) {
    ns.disableLog("ALL");
    ns.ui.openTail();
    const TESTS = 1000;
    for (let type of Object.keys(SOLUTIONS)) {
        for (let i = 0; i < TESTS; i++) { ns.codingcontract.createDummyContract(type) }
    };
    await ns.asleep(1000);
    ns.run("queue/contracts.js");
}