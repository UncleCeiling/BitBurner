/** @param {NS} ns */
export async function main(ns) {
  if (!ns.isRunning("main.js")) {
    ns.run("main.js");
  }
}
