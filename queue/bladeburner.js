import { ANSI } from "imports/ANSI";

/** @param {NS} ns */
export async function main(ns) {

    // ===== CLASSES =====

    /** Class representing a City */
    class City {
        /** Create instance of the city object
         * @param {String} name The name of the city
         */
        constructor(name) { this.name = name; }
        /** Get the amount of chaos in the city
         * @returns {Number} Amount of chaos
         */
        get chaos() { return ns.bladeburner.getCityChaos(this.name) }
        /** Get the amount of communities in the city
         * @returns {Number} Number of communities
         */
        get communities() { return ns.bladeburner.getCityCommunities(this.name) }
        /** Get the estimated population of the city
         * @returns {Number} Estimated number of Synthoids in the specified city.
         */
        get pop_estimate() { return ns.bladeburner.getCityEstimatedPopulation(this.name) }
    }

    /** Class representing an Action */
    class Action {
        /**
         * @param {String} type 
         * @param {String} name 
         */
        constructor(type, name) {
            this.type = type;
            this.name = name;
        }
    }

    /** Class representing an individual job */
    class Job {
        /**
         * @param {Action} action 
         * @param {City} city 
         */
        constructor(action, city, rep_gain = 0) {
            this.type = action.type;
            this.name = action.name;
            this.city = city.name;
            this.rep_gain = rep_gain;
        }
    }

    /** Class for maintaining the current job */
    class CurrentJob {
        constructor() {
            let current_action = ns.bladeburner.getCurrentAction()
            if (current_action != null) {
                this.name = current_action.name
                this.type = current_action.type
                this.rep_gain = ns.bladeburner.getActionRepGain(this.type, this.name);
            } else {
                this.name = ""
                this.type = ""
                this.rep_gain = 0
            }
            this.city = ns.bladeburner.getCity();
        }
        update() {
            let current_action = ns.bladeburner.getCurrentAction()
            if (current_action != null) {
                this.name = current_action.name
                this.type = current_action.type
                this.rep_gain = ns.bladeburner.getActionRepGain(this.type, this.name);
            } else {
                this.name = ""
                this.type = ""
                this.rep_gain = 0
            }
            this.city = ns.bladeburner.getCity()
        }

    }
    /** Class representing all acceptable jobs */
    class Job_List {
        /**
         * @param {Job[]} jobs 
         */
        constructor(jobs = []) { this.jobs = jobs }
        /** Updates the list of doable jobs and returns the new list (Will travel to all cities during this process)
         * @returns {Job[]}
         */
        update() {
            ns.print(`${ANSI.fg.cyan}Updating job list:${ANSI.reset}`);
            this.clear();
            const CITIES = Object.values(ns.enums.CityName).map((a) => new City(a)).sort((a, b) => b.pop_estimate - a.pop_estimate);
            const GENERAL = ns.bladeburner.getGeneralActionNames().map((a) => new Action("General", a));
            const CONTRACTS = ns.bladeburner.getContractNames().map((a) => new Action("Contracts", a));
            const OPERATIONS = ns.bladeburner.getOperationNames().map((a) => new Action("Operations", a));
            let max_team = ns.bladeburner.getTeamSize()
            let next_black_op = ns.bladeburner.getNextBlackOp();
            if (next_black_op != null) { ns.bladeburner.setTeamSize("Black Operations", next_black_op.name, max_team) }
            const BLACKOP = next_black_op != null ? [new Action("Black Operations", ns.bladeburner.getNextBlackOp().name)] : [new Action("Black Operations", "")];
            const ALL_ACTIONS = BLACKOP[0].name != "" ? BLACKOP.concat(OPERATIONS, CONTRACTS, GENERAL) : OPERATIONS.concat(CONTRACTS, GENERAL);
            ns.print(`${ANSI.fg.cyan}Checking ${ALL_ACTIONS.length * CITIES.length} jobs across ${CITIES.length} cities.${ANSI.reset}`);
            for (let city of CITIES) {
                ns.bladeburner.switchCity(city.name);
                for (let action of ALL_ACTIONS) {
                    if (action.type == "Black Operations" && ns.bladeburner.getNextBlackOp().rank >= ns.bladeburner.getRank()) { continue }
                    let job = new Job(action, city, ns.bladeburner.getActionRepGain(action.type, action.name));
                    ns.bladeburner.setTeamSize(job.type, job.name, max_team)
                    if (ns.bladeburner.getActionEstimatedSuccessChance(job.type, job.name)[0] < 1) { continue }
                    else if (ns.bladeburner.getActionCountRemaining(job.type, job.name) < 1) { continue }
                    this.jobs.push(job);
                }
            }
            ns.print(`${ANSI.fg.cyan}Found ${this.jobs.length} doable jobs.${ANSI.reset}`);
            return this.jobs;
        }
        /** Clears the job list */
        clear() { this.jobs = [] }
        /** Finds the best rep job in the list
         * Preferences Raids
         * @returns {(Job|null)}
         */
        rep_job() {
            let rep_jobs = [];
            if (this.jobs.length < 1) {
                ns.print(`${ANSI.fg.red}No doable jobs in job list.${ANSI.reset}`);
                return null;
            }
            for (let job of this.jobs) {
                if (job.type == "General") { continue }
                else if (job.type == "Contracts") { continue }
                else if (job.name == "Raid" && ns.bladeburner.getCityCommunities(job.city) > 0) { return job }
                rep_jobs.push(job);
            }
            return rep_jobs.sort((a, b) => b.rep_gain - a.rep_gain)[0];
        }/** Finds the blackop job
         * @returns {(Job|null)}
        */
        black_job() {
            if (this.jobs.length < 1) {
                ns.print(`${ANSI.fg.red}No doable BlackOps in job list.${ANSI.reset}`);
                return null;
            }
            for (let job of this.jobs) {
                if (job.type == "Black Operations") { return job }
            }
            return null
        }
        /** Finds the best money job in the list
         * @returns {(Job|null)}
        */
        cash_job() {
            if (this.jobs.length < 1) {
                ns.print(`${ANSI.fg.red}No doable jobs in job list.${ANSI.reset}`);
                return null;
            }
            return this.jobs.filter((a) => a.type == "Contracts").sort((a, b) => ns.bladeburner.getActionCountRemaining(b.type, b.name) - ns.bladeburner.getActionCountRemaining(a.type, a.name))[0]
        }
        /** Finds the best chaos job in the list
         * @param {Number} chaos Chaos to aim for
         * @returns {(Job|null)}
        */
        chaos_job(chaos = 50) { // 50 is the effective floor for chaos (see src/Bladeburner/data/Constants.ts - line 31)
            if (this.jobs.length < 1) {
                ns.print(`${ANSI.fg.red}No doable jobs in job list.${ANSI.reset}`);
                return null;
            }
            for (let job of this.jobs) {
                if (job.name == "Diplomacy" && ns.bladeburner.getCityChaos(job.city) > chaos) { return job }
            }
            return null
        }
        /** Finds the best recruiting job in the list
         * @returns {(Job|null)}
        */
        recruit_job() {
            if (this.jobs.length < 1) {
                ns.print(`${ANSI.fg.red}No doable jobs in job list.${ANSI.reset}`);
                return null;
            }
            for (let job of this.jobs) {
                if (job.name == "Recruitment") { return job }
            }
            return null
        }
    }

    // ===== MAIN =====
    const MIN_FREE_RAM = ns.ls("home", "queue/").map((a) => ns.getScriptRam(a, "home")).sort((a, b) => b - a)[0]
    if (!ns.bladeburner.inBladeburner()) { return }
    ns.disableLog("ALL");
    // ns.ui.openTail();
    let job_list = new Job_List;
    let current_job = new CurrentJob();
    while (true) {
        ns.clearLog();
        // Update stats
        current_job.update();
        job_list.update();
        ns.bladeburner.switchCity(current_job.city);
        // Run a safety check
        if (current_job.name != "" && current_job.type != "") {
            if (ns.bladeburner.getActionEstimatedSuccessChance(current_job.type, current_job.name)[0] < 1) {
                ns.print(`${ANSI.fg.red}${current_job.name} too risky to continue.${ANSI.reset}`);
                ns.bladeburner.stopBladeburnerAction();
            } else if (ns.bladeburner.getActionCountRemaining(current_job.type, current_job.name) < 1) {
                ns.print(`${ANSI.fg.red}${current_job.name} ran out of contracts.${ANSI.reset}`);
                ns.bladeburner.stopBladeburnerAction();
            }
        }
        // Do BlackOp if doable
        let next_black_op = ns.bladeburner.getNextBlackOp()
        if (next_black_op == null) { ns.tprint(`${ANSI.fg.green}Bladeburner complete - Destroy Node to continue${ANSI.reset}`) }
        if (next_black_op?.rank <= ns.bladeburner.getRank() && await do_job(job_list.black_job(), current_job)) { continue }
        // Check accuracy of data and do Field Analysis if not good, otherwise Train
        if (await improve_accuracy(current_job)) { continue }
        // Gain Rep
        if (await do_job(job_list.rep_job(), current_job)) { continue }
        // If taking up too much RAM - stop
        if (ns.getServerMaxRam('home') - ns.getServerUsedRam('home') < MIN_FREE_RAM) {
            ns.ui.closeTail();
            ns.tprint(`${ANSI.fg.red}Bladeburner Stopped - Not enough spare RAM on 'home',${ANSI.reset}`);
            ns.toast("Bladeburner Stopped - Not enough spare RAM on 'home'.", "error");
            await do_job(new Job(new Action("General", "Training"), new City(ns.bladeburner.getCity())), current_job);
            return;
        };
        // If stamina penalty too high, Train for a bit
        if (await stamina_check(0.5, 0.6, current_job)) { continue }
        // Make money
        if (await do_job(job_list.cash_job(), current_job)) { continue }
        // Reduce Chaos
        await chaos_reduction(current_job);
        // Recruit if possible
        if (await do_job(job_list.recruit_job(), current_job)) { continue }
        // Otherwise just train
        await do_job(new Job(new Action("General", "Training"), new City(ns.bladeburner.getCity())), current_job);
    }

    // ===== FUNCTIONS =====

    /** Starts the job by checking the current job and moving to the correct city.
     * @param {Job} job The job to be started
     * @param {CurrentJob} current_job 
     * @returns {Promise<Boolean>} True if successful
     */
    async function do_job(job, current_job) {
        if (job == null) { return false };
        ns.bladeburner.switchCity(job.city);
        current_job.update();
        if (job.name == current_job.name) {
            ns.print(`${ANSI.fg.cyan}Continuing ${job.name}.${ANSI.reset}`);
            await ns.bladeburner.nextUpdate();
            return true;
        } else if (ns.bladeburner.startAction(job.type, job.name)) {
            ns.print(`${ANSI.fg.cyan}Starting ${job.name}.${ANSI.reset}`);
            await ns.bladeburner.nextUpdate();
            return true;
        } else {
            ns.print(`${ANSI.fg.red}Failed to start ${job.name}.${ANSI.reset}`);
            return false;
        }
    }

    /** Recovers stamina if necessary. 
     * @param {Number} start 
     * @param {Number} stop 
     * @param {CurrentJob} current_job
    */
    async function stamina_check(start, stop, current_job) {
        const REGENERATION = new Job(new Action("General", "Hyperbolic Regeneration Chamber"), new City(ns.bladeburner.getCity()));
        const TRAINING = new Job(new Action("General", "Training"), new City(ns.bladeburner.getCity()));
        let stamina = ns.bladeburner.getStamina();
        if (stamina[0] / stamina[1] <= start) {
            while (stamina[0] / stamina[1] <= stop) {
                ns.print(`${ANSI.fg.yellow}Recovering Stamina: ${(100 * ((stamina[0] - (stamina[1] * start)) / (stamina[1] * stop))).toPrecision(3)}% Complete${ANSI.reset}`);
                let hp = ns.getPlayer().hp;
                current_job.update();
                if ((100 * ((stamina[0] - (stamina[1] * start)) / (stamina[1] * stop))) <= 20) {
                    if (current_job.name != REGENERATION.name) {
                        await do_job(REGENERATION, current_job)
                    }
                } else if (hp.current < hp.max) {
                    if (current_job.name != REGENERATION.name) {
                        await do_job(REGENERATION, current_job);
                    }
                } else if (current_job.name != TRAINING.name) {
                    await do_job(TRAINING, current_job);
                }
                await ns.bladeburner.nextUpdate();
                stamina = ns.bladeburner.getStamina();
                ns.clearLog();
            }
            return true
        } else { return false }
    }

    /** Reduces Chaos if necessary
     * @param {CurrentJob} current_job 
     */
    async function chaos_reduction(current_job) {
        current_job.update();
        while (await do_job(job_list.chaos_job(), current_job)) { ns.clearLog(); current_job.update() };
    }

    /** Improves accuracy if necessary
     * @param {CurrentJob} current_job 
     * @returns {Promise<Boolean>} True if successful
     */
    async function improve_accuracy(current_job) {
        const ACCURACY_ACTIONS = [
            new Action("Operations", "Undercover Operation"),
            new Action("Operations", "Investigation"),
            // new Action("Contracts", "Tracking"),
            new Action("General", "Field Analysis")
        ];
        let black_op = ns.bladeburner.getNextBlackOp();
        let estimate = ns.bladeburner.getActionEstimatedSuccessChance("Operations", "Assassination");
        if (black_op != null) { estimate = ns.bladeburner.getActionEstimatedSuccessChance("Black Operations", black_op.name) };
        current_job.update();
        if (estimate[0] != estimate[1]) {
            for (let action of ACCURACY_ACTIONS) {
                if (
                    ns.bladeburner.getActionEstimatedSuccessChance(action.type, action.name)[0] >= 1 &&
                    ns.bladeburner.getActionCountRemaining(action.type, action.name) >= 1
                ) {
                    ns.print(`${ANSI.fg.green}Performing ${action.name} to improve estimates. (${((estimate[1] - estimate[0]) * 100).toPrecision(3)}%).\nEst. Pop. ${Math.floor(ns.bladeburner.getCityEstimatedPopulation(ns.bladeburner.getCity())).toLocaleString()}${ANSI.reset}`);
                    let city = new City(ns.bladeburner.getCity());
                    let job = new Job(action, city);
                    ns.print(job.city);
                    await do_job(job, current_job);
                    return true;
                }
            }
            ns.print(`${ANSI.fg.red}Couldn't find way to improve estimates. (${((estimate[1] - estimate[0]) * 100).toPrecision(3)}%).\nEst. Pop. ${Math.floor(ns.bladeburner.getCityEstimatedPopulation(ns.bladeburner.getCity())).toLocaleString()}${ANSI.reset}`);
            return false;
        }
        // ns.print(`${((estimate[1] - estimate[0]) * 100).toPrecision(3)}%`);
        return false;
    }
}