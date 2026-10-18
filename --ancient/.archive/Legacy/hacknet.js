/** @param {NS} ns */
export async function main(ns) {
    ns.tprint('INFO - Purchasing Hacknet upgrades:')
    var secsToRun = 30
    var timeStart = Date.now()
    var errorOut = 0
    while (Date.now() <= (timeStart + (secsToRun * 1000)) && errorOut < 100) {
        var budget = (ns.getServerMoneyAvailable('home') / 2)
        var best = []
        var nodeDetails = []
        nodeDetails[0] = ns.hacknet.getPurchaseNodeCost()
        nodeDetails[1] = ns.hacknet.numNodes()
        var levelsDist = []
        var ramDist = []
        var coresDist = []
        var levelDetails = []
        var ramDetails = []
        var coreDetails = []
        for (let i = 0; i < nodeDetails[1]; i++) {
            levelsDist.push(ns.hacknet.getLevelUpgradeCost(i, 1))
            ramDist.push(ns.hacknet.getRamUpgradeCost(i, 1))
            coresDist.push(ns.hacknet.getCoreUpgradeCost(i, 1))
        }
        levelDetails[0] = Math.min(...levelsDist);
        ramDetails[0] = Math.min(...ramDist);
        coreDetails[0] = Math.min(...coresDist);
        levelDetails[1] = levelsDist.indexOf(levelDetails[0]);
        ramDetails[1] = ramDist.indexOf(ramDetails[0]);
        coreDetails[1] = coresDist.indexOf(coreDetails[0]);
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
        budget = (ns.getServerMoneyAvailable('home'))
        if (nodeDetails[0] <= budget) {
            ns.hacknet.purchaseNode()
            ns.print('Bought new node')
        } else if (best[2] > budget) {
            errorOut++
            ns.print('Failures = ' + errorOut)
        } else {
            if (best[0] == 'a core') {
                if (ns.hacknet.upgradeCore(coreDetails[1], 1)) {
                } else {
                    ns.tprint('FAIL - Failed to upgrade Cores')
                }
            } else if (best[0] == 'some RAM') {
                if (ns.hacknet.upgradeRam(ramDetails[1], 1)) {
                } else {
                    ns.tprint('FAIL - Failed to upgrade RAM')
                }
            } else if (best[0] == 'a level') {
                if (ns.hacknet.upgradeLevel(levelDetails[1], 1)) {
                } else {
                    ns.tprint('FAIL - Failed to upgrade level')
                }
            } else {
                if (ns.hacknet.purchaseNode() !== -1) {
                } else {
                    ns.tprint('FAIL - Failed to purchase Node')
                }
            }
            ns.tprint('SUCCESS - Bought ' + best[0] + ' on ' + best[1] + ' for $' + Math.floor(best[2]))
        }
        await ns.sleep(1)
    }
    if (errorOut >= 100) {
        ns.tprint('WARN - Not enough funds to continue Hacknet upgrades.')
    }
    ns.tprint('INFO - Finished upgrading.')
    ns.spawn('explore.js')
}