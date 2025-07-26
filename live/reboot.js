/** @param {NS} ns */
export async function main(ns) {
  if (
    await ns.prompt(
      "Reboot node?\n- Install Augments\n- Reset Stats and Money",
      { type: "boolean" }
    )
  ) {
    ns.singularity.softReset("boot.js");
  }
}
