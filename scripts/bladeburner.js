import { ANSI } from "imports/ANSI";
/** @param {NS} ns */
export async function main(ns) {
    ns.disableLog("ALL");
    // ns.ui.openTail()
    const OPERATIONS = ns.bladeburner.getOperationNames();
    const CONTRACTS = ns.bladeburner.getContractNames();
    const CITIES = ["Aevum", "Chongqing", "Ishima", "New Tokyo", "Sector-12", "Volhaven"];
    const GENERAL_ACTIONS = ["Training", "Field Analysis", "Recruitment", "Diplomacy", "Hyperbolic Regeneration Chamber", "Incite Violence"];
    while (true) {
        ns.clearLog();
        if (get_blackop() == null) { ns.toast("WORLDDAEMON ready to be destroyed", "error", null); return };
        // Check Current Action is still viable
        let current_action = ns.bladeburner.getCurrentAction();
        if (current_action != null && ns.bladeburner.getActionEstimatedSuccessChance(current_action.type, current_action.name)[0] < 1) {
            ns.print(`${ANSI.fg.red}${current_action.name} too risky - stopping.${ANSI.reset}`);
            ns.bladeburner.stopBladeburnerAction();
        }
        if (current_action != null && ns.bladeburner.getActionCountRemaining(current_action.type, current_action.name) < 1) {
            ns.print(`${ANSI.fg.red}${current_action.name} ran out - stopping.${ANSI.reset}`);
            ns.bladeburner.stopBladeburnerAction();
        }
        ns.print(`Current Rank: ${ns.bladeburner.getRank().toExponential(1)}`)
        // If BlackOp available and probable: do it, then wait for it to finish
        ns.print(`Checking ${get_blackop().name} | Rank-required: ${get_blackop().rank.toExponential(1)}`);
        while (get_rank() >= get_blackop().rank && get_success_chance("Black Operations", get_blackop().name)[0] >= 1) {
            await do_action("Black Operations", get_blackop().name);
        };
        // For each city, try Ops and Contracts.
        let cities = CITIES.filter((name) => name != ns.bladeburner.getCity());
        // If no communities, look for a city with one and move there.
        if (ns.bladeburner.getCityCommunities(ns.bladeburner.getCity()) < 1) {
            for (let city of CITIES) {
                if (ns.bladeburner.getCityCommunities(city) > 1) { ns.bladeburner.switchCity(city) }
            }
        }
        for (let city of cities) {
            // If Operation available and probable: do it
            let operation_list = [];
            for (let operation of OPERATIONS) {
                let remaining = ns.bladeburner.getActionCountRemaining("Operations", operation);
                if (remaining < 1) {
                    // ns.print(`No ${operation} remaining`);
                    continue
                }; // Can't do them
                let success = ns.bladeburner.getActionEstimatedSuccessChance("Operations", operation);
                if (success[0] < 1) {
                    // ns.print(`${operation} success chance ${Math.floor(success[0] * 100)}%`);
                    continue
                }; // Won't do them
                ns.print(`Checking ${operation} operation: | Rank: +${ns.bladeburner.getActionRepGain("Operations", operation).toExponential(1)}`)
                operation_list.push({
                    "name": operation,
                    "success": success,
                    "remaining": remaining,
                    "rep_gain": ns.bladeburner.getActionRepGain("Operations", operation),
                });
            };
            operation_list = operation_list.sort((a, b) => a.rep_gain - b.rep_gain);
            // ns.print("Operations: ", operation_list);
            if (operation_list.length > 0) { await do_action("Operations", operation_list.pop().name); break };
            // If Contract is available and probable: do it
            let contract_list = [];
            for (let contract of CONTRACTS) {
                let remaining = ns.bladeburner.getActionCountRemaining("Contracts", contract);
                if (remaining < 1) {
                    // ns.print(`No ${contract} remaining`);
                    continue
                }; // Can't do them
                let success = ns.bladeburner.getActionEstimatedSuccessChance("Contracts", contract);
                if (success[0] < 1) {
                    // ns.print(`${contract} success chance ${Math.floor(success[0] * 100)}%`);
                    continue
                }; // Won't do them
                ns.print(`Checking ${contract} contract: | Rank: +${ns.bladeburner.getActionRepGain("Contracts", contract).toExponential(1)}`)
                contract_list.push({
                    "name": contract,
                    "success": success,
                    "remaining": remaining,
                    "rep_gain": ns.bladeburner.getActionRepGain("Contracts", contract),
                });
            };
            contract_list = contract_list.sort((a, b) => a.rep_gain - b.rep_gain);
            // ns.print("Contracts: ", operation_list);
            if (contract_list.length > 0) { await do_action("Contracts", contract_list.pop().name); break };
            let current_action = ns.bladeburner.getCurrentAction();
            if (current_action != null && current_action.type != "General") { await ns.bladeburner.nextUpdate(); break };
            // Check skills; train if any under 100
            ns.print("Checking skills...")
            let skills = ns.getPlayer().skills
            if (skills.strength < 100 && skills.defense < 100 && skills.dexterity < 100 && skills.agility < 100) {
                ns.print(`${ANSI.fg.cyan}Training to improve Combat stats${ANSI.reset}`)
                if (ns.bladeburner.getCurrentAction() == null || ns.bladeburner.getCurrentAction().name != "Training") {
                    ns.bladeburner.startAction("General", "Training");
                }
                break
            }
            // Check recruitment; recruit if 100%
            ns.print("Checking recruitment...")
            let recruit = ns.bladeburner.getActionEstimatedSuccessChance("General", "Recruitment")[0]
            if (recruit >= 1) {
                ns.print(`${ANSI.fg.cyan}Recruiting team members (${ns.bladeburner.getTeamSize()} => ${ns.bladeburner.getTeamSize() + 1}).${ANSI.reset}`);
                if (ns.bladeburner.getCurrentAction() == null || ns.bladeburner.getCurrentAction().name != "Recruitment") {
                    ns.bladeburner.startAction("General", "Recruitment");
                }
                break
            }
            // Check accuracy of data and do Field Analysis if not good, otherwise Train
            ns.print("Checking estimates...")
            let estimate = get_success_chance("Black Operations", get_blackop().name)
            if (estimate[1] - estimate[0] >= 0.001) {
                ns.print(`${ANSI.fg.cyan}Performing Field Analysis to improve estimates (${(estimate[1] - estimate[0]).toFixed(4)} > 0.0010).${ANSI.reset}`);
                if (ns.bladeburner.getCurrentAction() == null || ns.bladeburner.getCurrentAction().name != "Field Analysis") {
                    ns.bladeburner.startAction("General", "Field Analysis");
                }
                break
            } else {
                ns.print(`${ANSI.fg.cyan}Performing Training to improve skills.${ANSI.reset}`)
                if (ns.bladeburner.getCurrentAction() == null || ns.bladeburner.getCurrentAction().name != "Training") { ns.bladeburner.startAction("General", "Training") }
            }
            // If no jobs available, return `false`
            ns.print(`Checking ${city}...`);
            ns.bladeburner.switchCity(city);
            await ns.bladeburner.nextUpdate()
        }
        // If no action was chosen, wait for the next update. <== REMOVE (after General Actions section is added)
        await ns.bladeburner.nextUpdate()
    };


    // ===== FUNCTIONS =====
    /**
     * Attempts to start the action, printing accordingly and waiting for the next update.
     * @param {String} type "Black Operations" | "Contracts" | "General" | "Operations"
     * @param {String} name Exact string of the desired action.
     * @returns After the action is completed (BlackOps) or an Update has occurred.
     */
    async function do_action(type, name) {
        let current = ns.bladeburner.getCurrentAction()
        ns.print(`${ANSI.fg.green}Doing ${name}${ANSI.reset}`);
        if (current != null && name == current.name) { await ns.bladeburner.nextUpdate(); return };
        if (ns.bladeburner.startAction(type, name)) {
            ns.print(`${ANSI.fg.green}Started ${name}${ANSI.reset}`);
            if (type == "Black Operations") { await wait_for_blackop_end() }
            else { await ns.bladeburner.nextUpdate() };
        } else { ns.tprint(`${ANSI.fg.red}Failed to start ${name}${ANSI.reset}`) };
        return
    }
    /**
     * Waits for the current BlackOp to complete before returning
     * @returns on the next update after the BlackOp has completed
     */
    async function wait_for_blackop_end() {
        let action = ns.bladeburner.getCurrentAction()
        while (action != null && action.type == "Black Operations") {
            await ns.bladeburner.nextUpdate();
            action = ns.bladeburner.getCurrentAction();
        };
        return
    }
    /**
     * Fetches Next BlackOp details (Name and Rank)
     * @returns {{String:String,String:Number}} Dict with "name" and "rank"
     */
    function get_blackop() { return ns.bladeburner.getNextBlackOp() }
    /**
     * Get's the player's current Bladeburner Rank
     * @returns {Number}
     */
    function get_rank() { return ns.bladeburner.getRank() }
    /**
     * Fetches the min and max success chance for a given action.
     * @param {String} type "Black Operations" | "Contracts" | "General" | "Operations"
     * @param {String} name Exact string of the desired action.
     * @returns {[Number,Number]} Returns a Dict containing the min and max success probabilities from 0 to 1.
    */
    function get_success_chance(type, name) { return ns.bladeburner.getActionEstimatedSuccessChance(type, name) };
}
