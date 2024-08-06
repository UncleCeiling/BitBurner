/** @param {NS} ns */
export async function main(ns) {
    // Make functions for getting budget and nodeCost
    function get_budget() { return ns.getServerMoneyAvailable('home') }
    function get_node_cost() { return ns.hacknet.getPurchaseNodeCost() }
    // If SQL exists, create the flag to stop spawning this scrip
    let num_nodes = ns.hacknet.numNodes()
    if (ns.fileExists('SQLInject.exe')) {
        // Get node details
        let node_details = []
        for (let node = 0; node < num_nodes; node++) {
            node_details.push(ns.hacknet.getNodeStats(node))
        }
        // Check details 
        let no_go = true
        for (let node of node_details) {
            if (node['level'] < 200 || node['ram'] < 64 || node['cores'] < 16) { no_go = false }
        }
        // If all nodes fully upgraded, make the flag
        if (no_go) { ns.write('flags/hacknet.flag.txt', 'Hacknet halted'); return }
    } else { ns.rm('flags/hacknet.flag.txt') }
    // Buy nodes
    let bought = 0
    while (!ns.fileExists('SQLInject.exe') && get_budget() > get_node_cost()) {
        ns.hacknet.purchaseNode()
        bought++
    }
    if (bought > 0) {
        ns.tprint(`SUCCESS - Bought ${bought} Hacknet node(s).`)
    }
    // Get number of nodes
    num_nodes = ns.hacknet.numNodes()
    // Get the upgrade and history variables ready
    let upgrade = { 'type': 'none', 'node': 0, 'cost': 0 }
    let history = { 'items': 0, 'spent': 0, 'errors': 0 }
    // Buy upgrades until we break
    while (true) {
        let level = { 'node': 0, 'cost': 0 }
        let ram = { 'node': 0, 'cost': 0 }
        let core = { 'node': 0, 'cost': 0 }
        // Find the cheapest of each type of upgrade
        for (let node = 0; node < num_nodes; node++) {
            // Get cost for this node
            let levelCost = ns.hacknet.getLevelUpgradeCost(node, 1)
            let ramCost = ns.hacknet.getRamUpgradeCost(node, 1)
            let coreCost = ns.hacknet.getCoreUpgradeCost(node, 1)
            // Compare to current best prices
            if (levelCost > level["cost"] && levelCost < get_budget()) { level = { 'node': node, 'cost': levelCost } }
            if (ramCost > ram["cost"] && ramCost < get_budget()) { ram = { 'node': node, 'cost': ramCost } }
            if (coreCost > core["cost"] && coreCost < get_budget()) { core = { 'node': node, 'cost': coreCost } }
        }
        // Find the best upgrade
        if (ram['cost'] > core['cost'] && ram['cost'] > level['cost']) {
            upgrade = { 'type': 'ram', 'node': ram['node'], 'cost': ram['cost'] }
        } else if (core['cost'] > ram['cost'] && core['cost'] > level['cost']) {
            upgrade = { 'type': 'core', 'node': core['node'], 'cost': core['cost'] }
        } else {
            upgrade = { 'type': 'level', 'node': level['node'], 'cost': level['cost'] }
        }
        ns.print(upgrade)
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
        ns.tprint(`SUCCESS - Bought ${history['items']} items for $${history['spent'].toLocaleString()}`)
    }
}