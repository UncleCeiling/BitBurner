/** @param {NS} ns */
export async function main(ns) {
    // Make functions for getting budget and nodeCost
    function get_budget() { return ns.getServerMoneyAvailable('home') }
    function get_node_cost() { return ns.hacknet.getPurchaseNodeCost() }

    // Buy nodes
    while (get_budget() > get_node_cost()) {
        ns.purchaseNode()
        ns.tprint('SUCCESS - Bought new Hacknet node')
    }

    // Get number of nodes
    numNodes = ns.hacknet.numNodes()
    // Get the upgrade and history variables ready
    let upgrade = { 'type': '', 'node': 0, 'cost': 0 }
    let history = { 'items': 0, 'spent': 0, 'errors': 0 }

    // Buy upgrades until we break
    while (true) {
        let level = { 'node': 0, 'cost': Infinity }
        let ram = { 'node': 0, 'cost': Infinity }
        let core = { 'node': 0, 'cost': Infinity }
        // Find the cheapest of each type of upgrade
        for (let node = 0; node < numNodes; node++) {
            // Get cost for this node
            let levelCost = ns.hacknet.getLevelUpgradeCost(node, 1)
            let ramCost = ns.hacknet.getRamUpgradeCost(node, 1)
            let coreCost = ns.hacknet.getCoreUpgradeCost(node, 1)
            // Compare to current best prices
            if (levelCost < level["cost"]) { level = { 'node': node, 'cost': levelCost } }
            if (ramCost < ram["cost"]) { ram = { 'node': node, 'cost': ramCost } }
            if (coreCost < core["cost"]) { core = { 'node': node, 'cost': coreCost } }
        }
        // Find the cheapest upgrade overall
        if (level['cost'] < ram['cost'] && level['cost'] < core['cost']) {
            upgrade = { 'type': 'level', 'node': level['node'], 'cost': level['cost'] }
        } else if (ram['cost'] < level['cost'] && ram['cost'] < core['cost']) {
            upgrade = { 'type': 'ram', 'node': ram['node'], 'cost': ram['cost'] }
        } else {
            upgrade = { 'type': 'core', 'node': core['node'], 'cost': core['cost'] }
        }
        // Buy the upgrade if we can afford it
        if (get_budget() > upgrade['cost']) {
            switch (upgrade['type']) {
                // Buy a level
                case 'level':
                    if (ns.hacknet.upgradeLevel(upgrade['node'], 1)) {
                        // Success! Add it to the history
                        history['items'] += 1
                        history['spent'] = history['spent'] + upgrade['cost']
                    } else {
                        // Fail! add it to the errors
                        history['errors'] += 1
                        ns.print(`ERROR - Failed to upgrade Level on node ${upgrade['node']}`)
                    } break;
                // Buy some RAM
                case 'ram':
                    // Success! Add it to the history
                    if (ns.hacknet.upgradeRam(upgrade['node'], 1)) {
                        history['items'] += 1
                        history['spent'] = history['spent'] + upgrade['cost']
                    } else {
                        // Fail! add it to the errors
                        history['errors'] += 1
                        ns.print(`ERROR - Failed to upgrade Ram on node ${upgrade['node']}`)
                    } break;
                // Buy a core
                case 'core':
                    // Success! Add it to the history
                    if (ns.hacknet.upgradeCore(upgrade['node'], 1)) {
                        history['items'] += 1
                        history['spent'] = history['spent'] + upgrade['cost']
                    } else {
                        history['errors'] += 1
                        // Fail! add it to the errors
                        ns.print(`ERROR - Failed to upgrade Core on node ${upgrade['node']}`)
                    } break;
                // Fail! Add it to the tally
                default:
                    ns.print(`ERROR - Upgrade ${upgrade} failed`)
                    history['errors'] += 1
            }
        }
        // If we can't afford it, break
        else { ns.print('ERROR - Ran out of funds'); break }
        // Break if too many errors
        if (history['errors'] >= 100) { ns.print('ERROR - Too many errors occurred'); break }
    }

    // Check the history and report what we spent
    if (history['items'] > 0) {
        ns.tprint(`SUCCESS - Bought ${history['items']} items for $${history['spent'].toLocaleString()})`)
    }
}