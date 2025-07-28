import { ANSI } from "imports/ANSI";
import { SOLUTIONS } from "modules/contracts";

/** @param {NS} ns */
export async function main(ns) {
  ns.disableLog("ALL");
  let input = ns.prompt(
    "How many tests would you like to perform per contract?",
    { type: "text" }
  );
  if (isNaN(input)) {
    ns.alert(`${ANSI.fg.red}Please enter a valid number${ANSI.reset}`);
    return;
  }
  const TESTS = parseInt(input);
  for (let type of Object.keys(SOLUTIONS)) {
    for (let i = 0; i < TESTS; i++) {
      ns.codingcontract.createDummyContract(type);
    }
  }
  await ns.asleep(1000);
  ns.run("modules/contracts.js");
}
