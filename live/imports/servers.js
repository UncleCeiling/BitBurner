export class UtilServer {
    /** Creates an object for a given server name
     * @param {NS} ns 
     * @param {String} name Name of server
     * @param {String} parent Name of parent
     * @param {Number} depth Depth of parent
     */
    constructor(ns, name, parent = null, depth = 0) {
        this.ns = ns;
        this.name = name;
        this.parent = this.name == "home" ? null : parent;
        this.depth = depth;
    };
    get details() { return this.ns.getServer(this.name) }
    /** @returns {Array<UtilServer>} */
    get children() { return this.ns.scan(this.name).filter((a) => a != this.parent).map((a) => new UtilServer(this.ns, a, this.name, this.depth + 1)) };
    /** @returns {Number} */
    get upgrade_cost() { return this.ns.getPurchasedServerUpgradeCost(this.name, this.details.maxRam * 2) };
    /** @returns {Boolean} */
    get is_mine() { return (this.details.moneyMax > 0 && this.details.backdoorInstalled) ? true : false };
    /** @returns {Boolean} */
    get is_miner() { return (this.details.maxRam >= 2 && this.details.hasAdminRights && !this.name.includes("hacknet")) ? true : false };
    /** @returns {Number} */
    get free_RAM() {
        let free = this.details.maxRam - this.details.ramUsed
        if (this.name == "home") { free = free - this.ns.getScriptRam("queue/foreman.js") - this.ns.getScriptRam("queue/bladeburner.js") - this.ns.getScriptRam("queue/stanek.js") - this.ns.getScriptRam("main.js") }
        return free
    }
    /** @returns {Boolean} */
    get can_backdoor() {
        if (this.details.openPortCount >= 5 && this.details.requiredHackingSkill <= this.ns.getPlayer().skills.hacking) {
            return true
        } else { return false }
    }
    /** @returns {Boolean} */
    get backdoored() { return this.details.backdoorInstalled }
};
export class AllServers {
    /** Creates a dynamic object containing all servers
     * @param {NS} ns 
     */
    constructor(ns) { this.ns = ns };
    /** Returns a set containing all servers
     * @returns {Set<UtilServer>} 
    */
    get set() {
        let set = new Set([new UtilServer(this.ns, "home")]);
        for (let item of set) {
            for (let child of item.children) { set.add(child); };
        };
        return set;
    };
    /** Returns an Array containing all servers
     * @returns {Array<UtilServer>} 
    */
    get array() { return Array.from(this.set) };
    /** Returns an Array containing all purchased servers
     * @returns {Array<UtilServer>} 
    */
    get purchased() { return this.ns.getPurchasedServers().map((a) => new UtilServer(this.ns, a)) };
    /** Returns an Array containing all mines
     * @returns {Array<UtilServer>} 
    */
    get mines() { return this.array.filter((a) => a.is_mine) }
    /** Returns an Array containing all miners
     * @returns {Array<UtilServer>} 
    */
    get miners() { return this.array.filter((a) => a.is_miner) }
};

/** Removes the old map and writes a new one
 * @param {NS} ns 
 */
export function write_map(ns) {
    ns.rm("data/map.txt", "home"); // Remove old map
    let data = iterate(new UtilServer(ns, "home"));
    ns.write("data/map.txt", data.join("\n"), "w"); // Write the new one

    /** Checks the stats of the children of the specified server in a depth-first manner.
     * @param {UtilServer} server 
     */
    function iterate(server) {
        let output = [`${"|>".padStart((server.depth * 2), "  ")}${server.details.hasAdminRights ? "R" : "X"}${server.details.backdoorInstalled ? "B" : "X"} \`${server.name}\` ${server.details.requiredHackingSkill}`];
        if (server.children.length > 0) {
            for (let child of server.children) {
                if (child.details.purchasedByPlayer) { continue };
                output = output.concat(iterate(child));
            };
        };
        return output;
    };
};

/** Removes the old server_stats file and writes a new one
 * @param {NS} ns 
 */
export function server_stats(ns) {
    ns.rm('data/server_stats.txt'); // Remove old file
    let servers = new AllServers(ns).purchased; // Get servers
    if (servers.length <= 0) {
        ns.tprint(`${ANSI.fg.red}No Purchased Servers${ANSI.reset}`); return;
    }; // Can't map what doesn't exist
    let data = servers.map((a) => `${a.name}: ${ns.formatRam(a.details.maxRam)}`); // Turn servers into string to add to file
    ns.write('data/server_stats.txt', data.join('\n'), 'w'); // Write new file
    ns.tprint(`${ANSI.fg.magenta}Wrote ${data.length} lines to 'server_stats.txt'${ANSI.reset}`);
};