export class Exe {
    /** Creates an instance of an Exe object
     * @param {NS} ns
     * @param {String} name
     * @param {Number} skill_req
    */
    constructor(ns, name, skill_req) {
        this.ns = ns;
        this.name = name;
        this.skill_req = skill_req - (this.ns.getPlayer().skills.intelligence / 2);
    };
    /** @returns {Boolean} */
    get exists() {
        if (!this.ns.fileExists(this.name, "home")) { return false }
        let filename = this.ns.ls("home", this.name)[0];
        if (filename.includes("INC")) { return false };
        return true;
    };
};

export class AllExes {
    /** @param {NS} ns  */
    constructor(ns) {
        this.ns = ns;
        this.details = { "NUKE.exe": 0, "b1t_flum3.exe": 0, "BruteSSH.exe": 50, "FTPCrack.exe": 100, "relaySMTP.exe": 250, "HTTPWorm.exe": 500, "SQLInject.exe": 750 };
    };
    /** @returns {Array<Exe>} */
    get set() { return new Set(Object.entries(this.details).map(([a, b]) => new Exe(this.ns, a, b)).sort((a, b) => a.skill_req - b.skill_req)) };
};