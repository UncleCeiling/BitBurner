export class UtilServer {
    /**
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
    get children() {
        return this.ns.scan(this.name).filter((a) => a != this.parent).map((a) => new UtilServer(this.ns, a, this.name, this.depth + 1))
    }
}

export class AllServers {
    /** Returns a set containing all servers
     * @param {NS} ns 
     * @returns {Set<UtilServer>} 
    */
    constructor(ns) { this.ns = ns }
    get set() {
        let map = new Set([new UtilServer(this.ns, "home")]);
        for (let item of map) {
            for (let child of item.children) { map.add(child); };
        };
        return map
    };
    /** Returns an Array containing all servers
     * @returns {Array<UtilServer>} 
    */
    get array() { return Array.from(this.set) };
}

/** Removes the old map and writes a new one
 * @param {NS} ns 
 */
export function write_map(ns) {
    ns.rm("map.txt", "home"); // Remove old map
    let data = iterate(new UtilServer(ns, "home"))
    ns.write("map.txt", data.join("\n"), "w"); // Write the new one

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
    }
}
