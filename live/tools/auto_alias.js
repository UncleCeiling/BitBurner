import { terminal_command } from "imports/utilities";

/** @param {NS} ns */
export async function main(ns) {
  const ALIASES = [
    `unalias --all`,
    `alias -g darkweb="buy -a"`,
    `alias -g boot="home; run boot.js"`,
    `alias -g reboot="home; run reboot.js"`,
    `alias -g kill-cycle="home; killall; run boot.js"`,
    `alias -g map="home; cat data/map.txt"`,
    `alias -g stats="home; cat data/server_stats.txt"`,
    `alias -g exportgift="home; run stanek/export.js"`,
    `alias -g importgift="home; run stanek/import.js"`,
    `alias -g auto-alias="home; run tools/auto_alias.js"`,
    `alias -g bitflume="home; run tools/bitflume.js"`,
    `alias -g dev="home; run tools/devmenu.js"`,
    `alias`,
  ];
  for (let alias of ALIASES) {
    terminal_command(ns, alias);
  }
}
