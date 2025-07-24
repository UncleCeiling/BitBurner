import { ANSI } from "imports/ANSI";
/** @param {NS} ns */
export async function main(ns) {
    let options = [
        "Cancel",
        "0",
        "1",
        "2",
        "3",
        "4",
        "5",
        "6",
        "7",
        "8",
        "9",
        "10",
        "11",
        "12",
        "13"
    ];
    let arg = ns.args[0];
    if (options.includes(arg) && arg != "Cancel") { ns.singularity.b1tflum3(arg, "boot.js"); return };
    let choice = await ns.prompt("Select Bitnode to Jump to", { type: "select", choices: options });
    if (choice == "" || choice == "Cancel") { ns.alert("Cancelled"); return }
    ns.singularity.b1tflum3(choice, "boot.js");
}