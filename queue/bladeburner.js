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
            this.rep_gain = rep_gain
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
            this.clear();;
            const CITIES = Object.values(ns.enums.CityName).map((a) => new City(a));
            const GENERAL = ns.bladeburner.getGeneralActionNames().map((a) => new Action("General", a));
            const CONTRACTS = ns.bladeburner.getContractNames().map((a) => new Action("Contracts", a));
            const OPERATIONS = ns.bladeburner.getOperationNames().map((a) => new Action("Operations", a));
            let next_black_op = ns.bladeburner.getNextBlackOp()
            const BLACKOP = next_black_op != null ? [new Action("Black Operations", ns.bladeburner.getNextBlackOp().name)] : [new Action("Black Operations", "")]
            const ALL_ACTIONS = BLACKOP[0].name != "" ? BLACKOP.concat(OPERATIONS, CONTRACTS, GENERAL) : OPERATIONS.concat(CONTRACTS, GENERAL);
            ns.print(`${ANSI.fg.cyan}Checking ${ALL_ACTIONS.length} jobs across ${CITIES.length} cities.${ANSI.reset}`);
            for (let city of CITIES) {
                ns.bladeburner.switchCity(city.name);
                for (let action of ALL_ACTIONS) {
                    if (action.type == "Black Operations" && ns.bladeburner.getNextBlackOp().rank >= ns.bladeburner.getRank()) { continue }
                    let job = new Job(action, city, ns.bladeburner.getActionRepGain(action.type, action.name));
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
        /** Finds the best job in the list
         * Preferences Black-ops, Raids and recruitment
         * @returns {(Job|null)}
         */
        best_job() {
            if (this.jobs.length < 1) {
                ns.print(`${ANSI.fg.red}No doable jobs in job list.${ANSI.reset}`);
                return null
            }
            for (let job of this.jobs) {
                if (job.type == "Black Operations") { return job }
            }
            for (let job of this.jobs) {
                if (job.name == "Hyperbolic Regeneration Chamber") { continue }
                if (job.name == "Recruitment") { return job }
                if (job.name == "Raid" && ns.bladeburner.getCityCommunities(job.city)) { return job }
            }
            return this.jobs.sort((a, b) => b.rep_gain - a.rep_gain)[0]
        }

    }

    // ===== MAIN =====
    if (!ns.bladeburner.inBladeburner()) { return }
    ns.disableLog("ALL");
    ns.ui.openTail()
    let job_list = new Job_List
    let current_job = new CurrentJob()
    while (true) {
        ns.clearLog();
        // Update stats
        await ns.bladeburner.nextUpdate();
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
        // If stamina penalty too high, Train for a bit
        await stamina_check(0.5, 0.6, current_job);
        // Check accuracy of data and do Field Analysis if not good, otherwise Train
        if (await improve_accuracy(current_job)) { continue }
        // Do the best job available
        if (await do_job(job_list.best_job(), current_job)) { continue }
        await stamina_check(0.9, 0.95, current_job)
        // Otherwise just train
        await do_job(new Job(new Action("General", "Training"), new City(ns.bladeburner.getCity())), current_job);
    }

    // ===== FUNCTIONS =====

    /** Starts the job by checking the current job and moving to the correct city.
     * @param {Job} job The job to be started
     * @returns {Promise<Boolean>} True if successful
     */
    async function do_job(job, current_job) {
        current_job.update();
        ns.bladeburner.switchCity(job.city);
        let remaining = ns.bladeburner.getActionTime(job.type, job.name) - ns.bladeburner.getActionCurrentTime();
        let sleep = bonus_time_calc(remaining);
        if (job.name == current_job.name) {
            ns.print(`${ANSI.fg.cyan}Continuing ${job.name}.${ANSI.reset}`);
            await ns.asleep(sleep);
            return true;
        } else if (ns.bladeburner.startAction(job.type, job.name)) {
            remaining = ns.bladeburner.getActionTime(job.type, job.name) - ns.bladeburner.getActionCurrentTime();
            sleep = bonus_time_calc(remaining);
            ns.print(`${ANSI.fg.cyan}Starting ${job.name}.${ANSI.reset}`);
            await ns.asleep(sleep);
            return true;
        } else {
            ns.print(`${ANSI.fg.red}Failed to start ${job.name}.${ANSI.reset}`);
            return false;
        }
    }

    /** Calculates how much real time a bladeburner action should take.
     * @param {Number} time Milliseconds of Bladeburner time
     * @returns {Number} Milliseconds of real time
     */
    function bonus_time_calc(time) {
        let bonus_time = ns.bladeburner.getBonusTime();
        let time_left = 1000
        if (bonus_time > time) { time_left = time / 5 }
        else if (bonus_time > 1000) { time_left = (time - bonus_time) + (time / 5) }
        return time_left
    }

    /** Recovers stamina if necessary. */
    async function stamina_check(start, stop, current_job) {
        const REGENERATION = new Job(new Action("General", "Hyperbolic Regeneration Chamber"), ns.bladeburner.getCity());
        const TRAINING = new Job(new Action("General", "Training"), ns.bladeburner.getCity());
        let stamina = ns.bladeburner.getStamina();
        current_job.update();
        if (stamina[0] / stamina[1] <= start) {
            ns.print(`${ANSI.fg.yellow}Recovering Stamina${ANSI.reset}`)
            while (stamina[0] / stamina[1] <= stop) {
                let hp = ns.getPlayer().hp;
                if (hp.current < hp.max) { await do_job(REGENERATION) }
                else { await do_job(TRAINING, current_job) }
                stamina = ns.bladeburner.getStamina();
            }
        }
    }

    /** Improves accuracy if necessary
     * @param {Job} current_job 
     * @returns {Promise<Boolean>} True if successful
     */
    async function improve_accuracy(current_job) {
        const ACCURACY_ACTIONS = [
            new Action("Operations", "Undercover Operation"),
            new Action("Operations", "Investigation"),
            new Action("Contracts", "Tracking"),
            new Action("General", "Field Analysis")
        ]
        let estimate = ns.bladeburner.getNextBlackOp() != null ? ns.bladeburner.getActionEstimatedSuccessChance("Black Operations", ns.bladeburner.getNextBlackOp().name) : ns.bladeburner.getActionEstimatedSuccessChance("Operations", "Assassination");
        current_job.update();
        if (estimate[0] != estimate[1]) {
            for (let action of ACCURACY_ACTIONS) {
                if (
                    ns.bladeburner.getActionEstimatedSuccessChance(action.type, action.name)[0] >= 1 &&
                    ns.bladeburner.getActionCountRemaining(action.type, action.name) >= 1
                ) {
                    ns.print(`${ANSI.fg.green}Performing ${action.name} to improve estimates.\n(${(estimate[1] - estimate[0])} > 0).\nEst. Pop. ${Math.floor(ns.bladeburner.getCityEstimatedPopulation(ns.bladeburner.getCity())).toLocaleString()}${ANSI.reset}`);
                    let city = new City(ns.bladeburner.getCity());
                    let job = new Job(action, city);
                    ns.print(job.city);
                    await do_job(job, current_job);
                    return true
                }
            }
            return false
        }
        return false
    }
}