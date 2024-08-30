/** @param {NS} ns */
export async function main(ns) {

    // Get Budget
    function get_budget() { return ns.getServerMoneyAvailable('home') }

    // Get node cost
    function get_node_cost() { return ns.hacknet.getPurchaseNodeCost() }

    // Get num of nodes
    function get_num_nodes() { return ns.hacknet.numNodes() }

    // Buy node or return `false`
    function buy_node() {
        let budget = get_budget()
        let cost = get_node_cost()
        if (budget > cost) {
            ns.hacknet.purchaseNode()
            num_nodes = get_num_nodes()
            history['nodes']++
            history['spent'] += cost
            return true
        } else {
            ns.print(`WARN - Not enough cash to buy a node ($${cost.toLocaleString()})`)
            return false
        }
    }

    // Buy level or return `false`
    function buy_level(node) {
        let budget = get_budget()
        let levels = ns.hacknet.getNodeStats(node).level
        let cost = ns.hacknet.getLevelUpgradeCost(node, 1)
        if (levels >= max_levels) { return false }
        if (budget > cost) {
            if (ns.hacknet.upgradeLevel(node, 1)) {
                history['levels']++
                history['spent'] += cost
                return true
            } else {
                ns.print(`FAIL - Buying level on node ${node} failed. ($${cost.toLocaleString()})`)
                return false
            }
        } else {
            ns.print(`WARN - Not enough cash to buy level on node ${node}. ($${cost.toLocaleString()})`)
            return false
        }
    }

    // Buy ram or return `false`
    function buy_ram(node) {
        let budget = get_budget()
        let ram = ns.hacknet.getNodeStats(node).ram
        let cost = ns.hacknet.getRamUpgradeCost(node, 1)
        if (ram >= max_ram) { return false }
        if (budget > cost) {
            if (ns.hacknet.upgradeRam(node, 1)) {
                history['ram']++
                history['spent'] += cost
                return true
            } else {
                ns.print(`FAIL - Buying RAM on node ${node} failed. ($${cost.toLocaleString()})`)
                return false
            }
        } else {
            ns.print(`WARN - Not enough cash to buy RAM on node ${node}. ($${cost.toLocaleString()})`)
            return false
        }
    }

    // Buy core or return `false`
    function buy_core(node) {
        let budget = get_budget()
        let cores = ns.hacknet.getNodeStats(node).cores
        let cost = ns.hacknet.getCoreUpgradeCost(node, 1)
        if (cores >= max_cores) { return false }
        if (budget > cost) {
            if (ns.hacknet.upgradeCore(node, 1)) {
                history['cores']++
                history['spent'] += cost
                return true
            } else {
                ns.print(`FAIL - Buying core on node ${node} failed. ($${cost.toLocaleString()})`)
                return false
            }
        } else {
            ns.print(`WARN - Not enough cash to buy core on node ${node}. ($${cost.toLocaleString()})`)
            return false
        }
    }

    function check_last_node_is_full() {
        let last_node = get_num_nodes() - 1
        let node_stats = ns.hacknet.getNodeStats(last_node)
        if (node_stats.level == max_levels && node_stats.ram == max_ram && node_stats.cores == max_cores) { return true }
        else { return false }
    }

    // Variables
    let history = { 'nodes': 0, 'levels': 0, 'ram': 0, 'cores': 0, 'spent': 0 }
    const max_levels = 200
    const max_ram = 64
    const max_cores = 16

    // Get num of nodes
    let num_nodes = get_num_nodes()

    // If no nodes, buy node
    if (num_nodes <= 0) {
        buy_node()
        num_nodes = get_num_nodes()
    }
    // Buy nodes
    ns.print(get_budget() > get_node_cost(), check_last_node_is_full())
    while (get_budget() > get_node_cost() && check_last_node_is_full()) { buy_node() }

    // For each node
    for (let node = 0; node < num_nodes; node++) {
        while (buy_ram(node)) { continue }
        while (buy_core(node)) { continue }
        while (buy_level(node)) { continue }
    }


    // Check the history and report what we spent
    if (history.spent > 0) {
        let list = []
        if (history.nodes > 0) { list.push(`${history.nodes} nodes`) }
        if (history.cores > 0) { list.push(`${history.cores} cores`) }
        if (history.ram > 0) { list.push(`${history.ram} ram upgrades`) }
        if (history.levels > 0) { list.push(`${history.levels} levels`) }
        let data = list.join(', ')
        let comma = data.lastIndexOf(',')
        if (comma > 0) { data = data.substring(0, comma) + ' and' + data.substring(comma + 1) }
        ns.tprint(`SUCCESS - Bought ${data}.\n${' '.padEnd((ns.getScriptName().length), ' ')}  Total: $${history.spent.toLocaleString()}`)
    }
}