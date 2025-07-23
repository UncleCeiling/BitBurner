/** @param {NS} ns **/
export async function main(ns) {
    // Changing the `toExponential` function to return null
    Number.prototype.toExponential = function () { return null }
}