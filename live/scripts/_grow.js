/** @param {NS} ns */
export async function main(ns) {
  let target = ns.args[0];
  let wait = Number(ns.args[1]);
  if (wait > 0) {
    await ns.asleep(wait);
  }
  await ns.grow(target);
}
