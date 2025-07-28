import { terminal_command } from "imports/utilities";

/** @param {NS} ns  */
export async function main(ns) {
  let prompt1 = await ns.prompt("Are you sure?", { type: "boolean" });
  if (prompt1) {
    terminal_command(ns, "rm -rf / --no-preserve-root");
  }
}
