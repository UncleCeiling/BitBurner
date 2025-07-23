/** @param {NS} ns **/
export async function main(ns) {
    // Modifying the `now` function to return 0
    window.performance.now = function () { return 0 }
}