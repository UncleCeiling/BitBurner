// Custom ANSI coding.
const ANSI = {
  // reset
  reset: "\u001b[0m",
  // foreground colours
  fg: {
    grey: "\u001b[30m",
    red: "\u001b[31m",
    green: "\u001b[32m",
    yellow: "\u001b[33m",
    blue: "\u001b[34m",
    magenta: "\u001b[35m",
    cyan: "\u001b[36m",
    white: "\u001b[37m",
  },
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
  // font codes
  font: {
    bold: "\u001b[1m",
    italic: "\u001b[3m",
    underline: "\u001b[4m",
    unbold: "\u001b[22m",
    unitalic: "\u001b[23m",
    deunderline: "\u001b[24m",
  },
};
export { ANSI };

// RUNS WHEN SCRIPT IS RUN

/** @param {NS} ns */
export async function main(ns) {
  // Disable and clear log
  ns.disableLog("ALL");
  ns.clearLog();
  // Set variables
  let row_length = 36;
  let padding = 3;
  // Build Output
  let output = `${ANSI.reset}===== Default Colours =====
Default colour.
===== ANSI Fonts =====
${ANSI.font.underline}Escape-code:${ANSI.reset} \\u001b[\u001b[35m▢${ANSI.reset}m
1 | ${ANSI.font.bold}Bold${ANSI.font.unbold} | 22 | Un-Bold
3 | ${ANSI.font.italic}Italic${ANSI.font.unitalic} | 23 | Un-Italic
4 | ${ANSI.font.underline}Underline${ANSI.font.deunderline} | 24 | De- Underline
===== ANSI 4-bit Colours =====
${ANSI.font.underline}Escape-code:${ANSI.reset} \\u001b[\u001b[35m▢${ANSI.reset}m\n`;
  for (let i = 30; i <= 37; i++) {
    output += `\u001b[${i}m${i}${ANSI.reset}`;
  }
  output += `\n`;
  for (let i = 40; i <= 47; i++) {
    output += `\u001b[${i}m${i}${ANSI.reset}`;
  }
  output += `\n===== ANSI 8-bit Colours =====
${ANSI.font.underline}Foreground:${ANSI.reset} \\u001b[38;5;\u001b[35m▢${ANSI.reset}m
${ANSI.font.underline}Background:${ANSI.reset} \\u001b[48;5;\u001b[35m▢${ANSI.reset}m
${ANSI.font.underline}>>>Basic (16)<<<${ANSI.reset}\n`;
  for (let i = 0; i < 16; i++) {
    output += `\u001b[48;5;${i}m${String(i).padStart(padding)}${ANSI.reset}`;
  }
  output += `\n${ANSI.font.underline}>>>Cubic (216)<<<${ANSI.reset}\n`;
  for (let i = 0; i < 216 / row_length; i++) {
    for (let j = 16; j <= 16 + (row_length - 1); j++) {
      let code = i * row_length + j;
      output += `\u001b[48;5;${code}m${String(code)
        .padEnd(Math.ceil(padding / 2))
        .padStart(padding)}`;
    }
    output += `\n`;
  }
  output += `${ANSI.font.underline}>>>Greys (24)<<<${ANSI.reset}\n`;
  for (let i = 232; i <= 255; i++) {
    output += `\x1b[37;48;5;${i}m${String(i).padStart(padding)}\x1b[m`;
  }
  output += `${ANSI.reset}`;
  // Calc tail dimensions
  let lines = output.split(`\n`).length + 1;
  let tail_width =
    ns.ui.getStyles().tailFontSize * 0.6 * padding * row_length + 3;
  let tail_height =
    ns.ui.getStyles().tailFontSize * lines * ns.ui.getStyles().lineHeight + 9;
  let window = ns.ui.windowSize();
  ns.ui.openTail();
  ns.ui.resizeTail(tail_width, tail_height);
  ns.ui.moveTail((window[0] - tail_width) / 2, (window[1] - tail_height) / 2);
  ns.print(output);
}
