/** @param {NS} ns */
export async function main(ns) {
    // Build program list
    let programList = ns.singularity.getDarkwebPrograms()
    let programCosts = []
    // Check for TOR Router
    ns.print('Checking for TOR')
    if (programList.length <= 0) {
        if (ns.getServerMoneyAvailable('home') >= 200000) {
            ns.singularity.purchaseTor()
            ns.tprint('SUCCESS - TOR router purchased')
        } else { // Give up if can't afford TOR router
            ns.tprint('ERROR - Not enough Cash to purchase TOR router')
            ns.rm('flags/darkweb.flag.txt')
            return
        }
    }
    // Check for purchasable
    let min = 0
    let cheapestIndex = 0
    let buyChoice = ''
    programList = ns.singularity.getDarkwebPrograms()
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
            ns.tprint(`SUCCESS - Purchased ${buyChoice}`) // Report the success
        } else if (min == Infinity) { // If all products are owned
            ns.tprint('SUCCESS - All Darkweb products are owned.') // Say so
            ns.write('flags/darkweb.flag.txt', 'All Darkweb products are owned.', 'w') // Create Flag
            return
        } else {
            ns.tprint(`ERROR - Not enough funds to purchase ${buyChoice} - Need $${Math.min(min).toLocaleString()}`) // Otherwise we are out of cash
        }
        ns.rm('flags/darkweb.flag.txt')
        await ns.asleep(10)
    }
}