/** @param {NS} ns */
export async function main(ns) {
  ns.disableLog("ALL");
  const LOOPS = 10;
  let x = ns.args[0];
  let y = ns.args[1];
  if (x == null || x == null) {
    ns.tprint(`FAILED - Cannot charge - Arguments not given.`);
  } else {
    for (let i = 1; i <= LOOPS; i++) {
      await ns.stanek.chargeFragment(x, y);
    }
  }
}
