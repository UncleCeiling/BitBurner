/** @param {NS} ns */
export async function main(ns) {
    ns.tprint('INFO - Purchasing Hacknet upgrades.')
    let secsToRun = 30 // Set max run-time
    let timeStart = Date.now() // Start timer
    let errorOut = 0 // Set error flag
    let counter = 0
    let spent = 0
    while (Date.now() <= (timeStart + (secsToRun * 1000)) && errorOut < 100) { // As long as the timer is running and less than 100 errors occur
        let budget = (ns.getServerMoneyAvailable('home') / 2) // Calculate budget
        // Initialise variable
        let best = []
        let nodeDetails = [ns.hacknet.getPurchaseNodeCost(), ns.hacknet.numNodes()]
        let levelsDist = []
        let ramDist = []
        let coresDist = []
        let levelDetails = []
        let ramDetails = []
        let coreDetails = []
        // For each node; find costs and add to lists
        for (let i = 0; i < nodeDetails[1]; i++) {
            levelsDist.push(ns.hacknet.getLevelUpgradeCost(i, 1))
            ramDist.push(ns.hacknet.getRamUpgradeCost(i, 1))
            coresDist.push(ns.hacknet.getCoreUpgradeCost(i, 1))
        }
        // Find cheapest for each list
        levelDetails[0] = Math.min(...levelsDist);
        ramDetails[0] = Math.min(...ramDist);
        coreDetails[0] = Math.min(...coresDist);
        // Match to the correct node
        levelDetails[1] = levelsDist.indexOf(levelDetails[0]);
        ramDetails[1] = ramDist.indexOf(ramDetails[0]);
        coreDetails[1] = coresDist.indexOf(coreDetails[0]);
        // Decide which to buy
        if (coreDetails[0] <= ramDetails[0] && coreDetails[0] <= levelDetails[0] && coreDetails[0] <= nodeDetails[0]) {
            best[0] = 'a core'
            best[1] = 'Node' + coreDetails[1]
            best[2] = coreDetails[0]
        } else if (ramDetails[0] <= levelDetails[0] && ramDetails[0] <= nodeDetails[0]) {
            best[0] = 'some RAM'
            best[1] = 'Node ' + ramDetails[1]
            best[2] = ramDetails[0]
        } else if (levelDetails[0] <= nodeDetails[0]) {
            best[0] = 'a level'
            best[1] = 'Node ' + levelDetails[1]
            best[2] = levelDetails[0]
        } else {
            best[0] = 'a new node'
            best[1] = 'the Hacknet'
            best[2] = nodeDetails[0]
        }
        // Check that we have enough cash
        budget = (ns.getServerMoneyAvailable('home') / 2)
        // If we have enough, buy the upgrade
        if (nodeDetails[0] <= budget) {
            ns.hacknet.purchaseNode()
            ns.print('Bought new node')
        } else if (best[2] > budget) {
            // If we somehow messed up, increment the error counter
            errorOut++
            ns.print(`Failures = ${errorOut}`)
        } else {
            // Do the actual buying, but error if it fails.
            if (best[0] == 'a core') {
                if (ns.hacknet.upgradeCore(coreDetails[1], 1)) {
                } else {
                    ns.print('ERROR - Failed to upgrade Cores')
                }
            } else if (best[0] == 'some RAM') {
                if (ns.hacknet.upgradeRam(ramDetails[1], 1)) {
                } else {
                    ns.print('ERROR - Failed to upgrade RAM')
                }
            } else if (best[0] == 'a level') {
                if (ns.hacknet.upgradeLevel(levelDetails[1], 1)) {
                } else {
                    ns.print('ERROR - Failed to upgrade level')
                }
            } else {
                if (ns.hacknet.purchaseNode() !== -1) {
                } else {
                    ns.print('ERROR - Failed to purchase Node')
                }
            }
            // Increment counter
        }
        // Pause for a millisecond rest
        // await ns.sleep(10)
        counter++
        spent += best[2]
    }
    ns.tprint(`SUCCESS - Bought ${counter} upgrades across ${ns.hacknet.numNodes()} nodes($${spent.toLocaleString()})`)
    // Wow, you really messed up huh?
    if (errorOut >= 100) {
        ns.print('ERROR - Not enough funds to continue Hacknet upgrades.')
    }
}