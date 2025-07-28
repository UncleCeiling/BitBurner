/** @param {NS} ns */
export async function main(ns) {
  let go_ahead = await ns.prompt(
    "Reboot node?\n- Install Augments\n- Reset Stats and Money",
    { type: "boolean" }
  );
  if (go_ahead) {
    ns.singularity.softReset("boot.js");
  }
}
