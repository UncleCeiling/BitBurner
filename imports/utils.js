export class Server {
    /** Creates an object for a given server name
     * @param {NS} ns 
     * @param {String} name Name of server
     * @param {String} parent Name of parent
     * @param {Number} depth Depth of parent
     */
    constructor(ns, name, parent = null, depth = 0) {
        this.ns = ns
        this.name = name;
        this.parent = this.name == "home" ? null : parent;
        this.depth = depth;
    }
    get details() { return this.ns.getServer(this.name) }
    /** @returns {Array<Server>} */
    get children() {
        return this.ns.scan(this.name).filter((a) => a != this.parent).map((a) => new Server(this.ns, a, this.name, this.depth + 1))
    }
    /** @returns {Number} */
    get upgrade_cost() { return this.ns.getPurchasedServerUpgradeCost(this.name, this.details.maxRam * 2) }
    /** @returns {Boolean} */
    get is_mine() { return (this.details.moneyMax > 0 && this.details.backdoorInstalled) ? true : false }
    /** @returns {Boolean} */
    get is_miner() { return (this.details.maxRam >= 2 && this.details.backdoorInstalled) ? true : false }
}

export class AllServers {
    /** Creates a dynamic object containing all servers
     * @param {NS} ns 
     */
    constructor(ns) { this.ns = ns }
    /** Returns a set containing all servers
     * @returns {Set<Server>} 
    */
    get set() {
        let set = new Set([new Server(this.ns, "home")]);
        for (let item of set) {
            for (let child of item.children) { set.add(child); };
        };
        return set
    };
    /** Returns an Array containing all servers
     * @returns {Array<Server>} 
    */
    get array() { return Array.from(this.set) };
    /** Returns an Array containing all purchased servers
     * @returns {Array<Server>} 
    */
    get purchased() { return this.ns.getPurchasedServers().map((a) => new Server(this.ns, a)) }
}

/** Removes the old map and writes a new one
 * @param {NS} ns 
 */
export function write_map(ns) {
    ns.rm("map.txt", "home"); // Remove old map
    let data = iterate(new Server(ns, "home"))
    ns.write("map.txt", data.join("\n"), "w"); // Write the new one

    /** Checks the stats of the children of the specified server in a depth-first manner.
     * @param {Server} server 
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
    }
}
