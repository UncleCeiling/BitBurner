/** @param {NS} ns */
export async function main(ns) {
    // Using `ns.eval()` to bypass RAM cost evaluation
    eval("ns.bypass(document);")
}