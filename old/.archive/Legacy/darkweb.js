/** @param {NS} ns */
export async function main(ns) {
    ns.tprint('INFO - Browsing the Darkweb.')
    var programList = ns.singularity.getDarkwebPrograms()
    var programCosts = []
    ns.print('Checking for TOR')
    await ns.sleep(500)
    if (programList.length <= 1) {
        if (ns.getServerMoneyAvailable('home') >= 200000) {
            ns.singularity.purchaseTor()
            ns.tprint('SUCCESS - TOR router purchased')
        } else {
            ns.tprint('WARN - Not enough Cash to purchase TOR router')
        }
    }
    var min = 0
    var cheapestIndex = 0
    var buyChoice = ''
    while ((min < 1000000000000) && (min < ns.getServerMoneyAvailable('home'))) {
        programList = ns.singularity.getDarkwebPrograms()
        programCosts = []
        // ns.print('Programs: '+programList)
        // await ns.sleep(3000)
        programList.forEach(function (populate) {
            if (ns.singularity.getDarkwebProgramCost(populate) == 0) {
                programCosts.push(1000000000000)
            } else {
                programCosts.push(ns.singularity.getDarkwebProgramCost(populate))
            }
        })
        // ns.print('Costs: '+programCosts)
        // await ns.sleep(3000)
        min = Math.min(...programCosts)
        cheapestIndex = programCosts.indexOf(min)
        buyChoice = programList[cheapestIndex]
        if (ns.getServerMoneyAvailable('home') > Math.min(...programCosts)) {
            ns.singularity.purchaseProgram(buyChoice)
            ns.tprint('SUCCESS - Purchased ' + buyChoice)
        } else if (Math.min(...programCosts) >= 1000000000000) {
            ns.tprint('SUCCESS - All Darkweb Products owned.')
        } else {
            ns.tprint('WARN - Not enough funds to purchase ' + buyChoice + ' - Need $' + Math.min(...programCosts))
        }
    }
    ns.tprint('INFO - Closing Darkweb tabs.')
    ns.spawn('hacknet.js')
}