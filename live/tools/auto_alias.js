import { terminal_command } from "imports/utilities";

/** @param {NS} ns */
export async function main(ns) {
    const ALIASES = [
        `unalias --all`,
        `alias -g boot="home; run boot.js"`,
        `alias -g dev="home; run tools/devmenu.js"`,
        `alias -g darkweb="buy -a"`,
        `alias -g reboot="home; run reboot.js"`,
        `alias -g kill-cycle="home; killall; run boot.js"`,
        `alias`
    ];
    for (let alias of ALIASES) { terminal_command(ns, alias) };
};

