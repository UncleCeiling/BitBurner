// The trick with this one is to:
// 1. Open the Inspect style debug.
// 2. Navigate to the Source tabs.
// 3. Find Extra.ts in `src/NetscriptFunctions`.
// 4. Create a breakpoint on the if statement with the `x` in it.
// 5. Run this script.
// 6. In the Inspect/Debug panel, change the value of `x` to true and let the program continue.

/** @param {NS} ns **/
export async function main(ns) {
    ns.alterReality();
}
