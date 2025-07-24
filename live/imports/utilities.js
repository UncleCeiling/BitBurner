/** @param {NS} ns  */
export async function terminal_command(ns, command) {
    const doc = eval("document");
    let selector = "#terminal-input";
    let element = doc.querySelector(selector);
    while (!element) { await ns.asleep(1000); element = doc.querySelector(selector); }
    element.value = command;
    const handler = Object.keys(element)[1];
    element[handler].onChange({ target: element });
    element[handler].onKeyDown({ keyCode: 13, preventDefault: () => null });
    element.dispatchEvent(new KeyboardEvent('keydown', {
        bubbles: true, cancelable: true, keyCode: 13
    }));
    element.dispatchEvent(new KeyboardEvent('keyup', {
        bubbles: true, cancelable: true, keyCode: 13
    }));
}

// /** @param {NS} ns */
// export async function main(ns) {
//     ns.alert(ns.formatRam(ns.getScriptRam("imports/utilities.js")))
// }