/** @param {NS} ns */

// Custom color coding.
const ANSI = {
    // Reset to default
    reset: "\u001b[0m",
    // Font
    bold: "\u001b[1m,",
    under: "\u001b[4m,",
    // Actions
    blink: "\u001b[5m,",
    clr_scr: "\u001b[2J,",
    // foreground colours
    black: "\u001b[30m",
    red: "\u001b[31m",
    green: "\u001b[32m",
    yellow: "\u001b[33m",
    blue: "\u001b[34m",
    magenta: "\u001b[35m",
    white: "\u001b[37m",
    cyan: "\u001b[36m",
    // background colours
    bg: {
        black: "\u001b[40m",
        red: "\u001b[41m",
        green: "\u001b[42m",
        yellow: "\u001b[43m",
        blue: "\u001b[44m",
        magenta: "\u001b[45m",
        cyan: "\u001b[46m",
        white: "\u001b[47m",
    },

}
export { ANSI }

export async function main(ns) {
    ns.disableLog("ALL")
    ns.tail()
    // Default color coding.
    ns.print("ERROR means something's wrong.");
    ns.print("SUCCESS means everything's OK.");
    ns.print("WARN Tread with caution!");
    ns.print("WARNING, warning, danger, danger!");
    ns.print("WARNing! Here be dragons.");
    ns.print("INFO for your I's only (FYI).");
    ns.print("INFOrmation overload!");
    // ANSI color coding using the Unicode escape code "\u001b"
    ns.print(`${ANSI.red}Ugh! What a mess.${ANSI.reset}`);
    ns.print(`${ANSI.green}Well done!${ANSI.reset}`);
    ns.print(`${ANSI.cyan}ERROR Should this be in red?${ANSI.reset}`);
}