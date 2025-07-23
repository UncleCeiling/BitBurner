import { ANSI } from "../imports/ANSI"

/** @param {NS} ns */
export async function main(ns) {
    ns.print('Checking for TOR')
    if (!ns.singularity.purchaseTor()) { ns.tprint(`${ANSI.fg.red}TOR router not owned${ANSI.reset}`); return } // Check for TOR Router
    // Check for purchasable
    let min = 0
    let cheapestIndex = 0
    let buyChoice = ''
    let programCosts = []
    let programList = ns.singularity.getDarkwebPrograms()
    while ((min < ns.getServerMoneyAvailable('home'))) { // As long as I have the money
        programList = ns.singularity.getDarkwebPrograms() // Update Program list
        programCosts = []
        ns.print('Programs: ' + programList)
        programList.forEach(function (populate) {
            if (ns.singularity.getDarkwebProgramCost(populate) == 0) { // If there's nothing on the list
                programCosts.push(Infinity) // Set the price to Infinity
            } else {
                programCosts.push(ns.singularity.getDarkwebProgramCost(populate)) // Otherwise add the cost to the list
            }
        })
        ns.print('Costs: ' + programCosts)
        min = Math.min(...programCosts) // Find the lowest price item
        cheapestIndex = programCosts.indexOf(min)
        buyChoice = programList[cheapestIndex] // Find the corresponding Program
        // ns.print('INFO - Browsing the Darkweb.')
        if (ns.getServerMoneyAvailable('home') > Math.min(...programCosts)) { // If we have enough money
            ns.singularity.purchaseProgram(buyChoice) // Buy the program
            ns.tprint(`${ANSI.fg.green}Purchased ${buyChoice}${ANSI.reset}`) // Report the success
        } else if (min == Infinity) { // If all products are owned
            ns.print(`${ANSI.fg.green}All Darkweb products are owned.${ANSI.reset}`) // Say so
            return
        } else {
            ns.print(`${ANSI.fg.yellow}Not enough funds to purchase ${buyChoice} - Need $${Math.min(min).toLocaleString()}${ANSI.reset}`) // Otherwise we are out of cash
        }
        await ns.asleep(10)
    }
}