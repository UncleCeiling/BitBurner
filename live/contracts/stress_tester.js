import { SOLUTIONS } from "modules/contracts";

/** @param {NS} ns */
export async function main(ns) {
  ns.disableLog("ALL");
  const TESTS = 10;
  for (let type of Object.keys(SOLUTIONS)) {
    for (let i = 0; i < TESTS; i++) {
      ns.codingcontract.createDummyContract(type);
    }
  }
  await ns.asleep(1000);
  ns.run("modules/contracts.js");
}
