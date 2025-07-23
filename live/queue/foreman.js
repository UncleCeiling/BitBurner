import { ANSI } from "../imports/ANSI";
import * as util from "live/imports/utils"
/** @param {NS} ns */
export async function main(ns) {
    // ===== CLASSES =====
    class MineJob {
        constructor(name) {
            this.name = name
        }
        get details() { return ns.getServer(this.name) }
        get hack_time() { return ns.getHackTime(this.name) };
        get hack_delay() { return this.weaken_time - this.hack_time - 100 }
        get hack_threads() { let threads = Math.floor(ns.hackAnalyzeThreads(this.name, this.details.moneyMax * 0.49)); return threads <= 0 ? 1 : threads; };
        get hack_security_increase() { return ns.hackAnalyzeSecurity(this.hack_threads, this.name) };
        get weaken_time() { return ns.getWeakenTime(this.name) };
        get weaken_hack_delay() { return 0 }
        get weaken_grow_delay() { return 200 }
        weaken_threads(cores = 1, decrease) { let threads = 1; while (ns.weakenAnalyze(threads, cores) <= decrease) { threads++ }; return threads };
        weaken_threads_hack(cores = 1) { return this.weaken_threads(cores, this.hack_security_increase) };
        get grow_time() { return ns.getGrowTime(this.name) };
        get grow_delay() { return this.weaken_time - this.grow_time + 100 }
        grow_threads(cores = 1) { return Math.ceil(ns.growthAnalyze(this.name, 2.1, cores)) };
        grow_security_increase(cores = 1) { return ns.growthAnalyzeSecurity(this.grow_threads(cores), this.name, cores) };
        weaken_threads_grow(cores = 1) { return this.weaken_threads(cores, this.grow_security_increase(cores)) };
        get hack_RAM() { return ns.getScriptRam("scripts/_hack.js") * this.hack_threads }
        weaken_hack_RAM(cores = 1) { return ns.getScriptRam("scripts/_weaken.js", "home") * this.weaken_threads_hack(cores) }
        grow_RAM(cores = 1) { return ns.getScriptRam("scripts/_grow.js", "home") * this.grow_threads(cores) }
        weaken_grow_RAM(cores = 1) { return ns.getScriptRam("scripts/_hack.js", "home") * this.weaken_threads_grow(cores) }
        total_RAM(cores = 1) { return this.hack_RAM + this.weaken_hack_RAM(cores) + this.grow_RAM(cores) + this.weaken_grow_RAM(cores) }

    };
    class JobQueue {
        /** @param {Array<String>} mines  */
        constructor(mines) {
            this.mines = mines
        };
        /** @returns {Array<MineJob>} */
        get jobs() { return this.mines.map((a) => new MineJob(a)).sort((a, b) => b.total_RAM() - a.total_RAM()) }
    };
    // ===== MAIN =====
    const MIN_FREE_RAM = ns.ls("home", "queue/").map((a) => ns.getScriptRam(a, "home")).sort((a, b) => b - a)[0]
    ns.disableLog("ALL");
    ns.clearLog();
    // ns.ui.openTail();
    if (check_host() == false) { return };
    var servers = new util.AllServers(ns);
    while (true) {
        let miners = servers.miners;
        let queue = new JobQueue(servers.mines.map((a) => a.name));
        let sec_queue = Array.from(queue.jobs.filter((a) => a.details.hackDifficulty > a.details.minDifficulty).sort((a, b) => b.details.moneyMax - a.details.moneyMax));
        let grow_queue = Array.from(queue.jobs.filter((a) => a.details.moneyAvailable < a.details.moneyMax).sort((a, b) => a.details.moneyAvailable - b.details.moneyAvailable));
        let items = Array.from(queue.jobs);
        while (items.length > 0) {
            let item = items.shift();
            for (let miner of miners) {
                if (miner.free_RAM > item.total_RAM(miner.details.cpuCores) && !ns.getRunningScript("scripts/_weaken.js", miner.name, item.name, 200)) {
                    do_entire_job(item, miner);
                    continue;
                };
                if (miner.details.maxRam < queue.jobs.sort((a, b) => a.total_RAM(miner.details.cpuCores) - b.total_RAM(miner.details.cpuCores))[0].total_RAM(miner.details.cpuCores)) {
                    if (sec_queue.length > 0) { do_single_job(sec_queue.shift(), miner, "scripts/_weaken.js") }
                    else if (grow_queue.length > 0) { do_single_job(grow_queue.shift(), miner, "scripts/_grow.js") };
                };
            };
            if (ns.getServerMaxRam('home') - ns.getServerUsedRam('home') < MIN_FREE_RAM) {
                ns.ui.closeTail();
                ns.tprint(`${ANSI.fg.red}Foreman Stopped - Not enough spare RAM on 'home',${ANSI.reset}`);
                ns.toast("Foreman Stopped - Not enough spare RAM on 'home'.", "error");
                return;
            };
            await ns.asleep(1000)
        };
        await ns.asleep(1000);
    };

    // ===== FUNCTIONS =====
    /**
     * 
     * @param {MineJob} item 
     * @param {util.UtilServer} miner 
     * @param {String} script 
     */
    function do_single_job(item, miner, script) {
        let threads = Math.floor(miner.free_RAM / ns.getScriptRam(script, "home"))
        if (threads <= 0) { return }
        if (ns.getRunningScript(script, miner.name, item.name, 0)) { return }
        ns.scp(script, miner.name, "home")
        if (ns.exec(script, miner.name, threads, item.name, 0) > 0) {
            ns.print(`${ANSI.fg.green}'${script.replace("scripts/", "")}'|${ns.formatRam(threads * ns.getScriptRam(script, "home"))}|${ANSI.fg.cyan}${miner.name} >> ${item.name}${ANSI.reset}`)
        }
    }

    /**
     * 
     * @param {MineJob} item 
     * @param {util.UtilServer} miner 
     */
    function do_entire_job(item, miner) {
        ns.scp(ns.ls("home", "scripts/"), miner.name, "home");
        let failure = false
        if (0 == ns.exec("scripts/_weaken.js", miner.name, item.weaken_threads_hack(miner.details.cpuCores), item.name, item.weaken_hack_delay)) {
            ns.print(`${ANSI.fg.red}Failed to execute "scripts/_weaken.js" | ${miner.name} >> ${item.name} | t=${item.weaken_threads_hack(miner.details.cpuCores)}${ANSI.reset}`);
            failure = true
        }
        if (0 == ns.exec("scripts/_hack.js", miner.name, item.hack_threads, item.name, item.hack_delay)) {
            ns.print(`${ANSI.fg.red}Failed to execute "scripts/_hack.js" | ${miner.name} >> ${item.name} | t=${item.hack_threads}${ANSI.reset}`);
            failure = true
        }
        if (0 == ns.exec("scripts/_weaken.js", miner.name, item.weaken_threads_grow(miner.details.cpuCores), item.name, item.weaken_grow_delay)) {
            ns.print(`${ANSI.fg.red}Failed to execute "scripts/_weaken.js" | ${miner.name} >> ${item.name} | t=${item.weaken_threads_grow(miner.details.cpuCores)}${ANSI.reset}`);
            failure = true
        }
        if (0 == ns.exec("scripts/_grow.js", miner.name, item.grow_threads(miner.details.cpuCores), item.name, item.grow_delay)) {
            ns.print(`${ANSI.fg.red}Failed to execute "scripts/_grow.js" | ${miner.name} >> ${item.name} | t=${item.grow_threads(miner.details.cpuCores)}${ANSI.reset}`);
            failure = true
        }
        if (!failure) { ns.print(`${ANSI.fg.magenta}RAM=${ns.formatRam(item.total_RAM(miner.details.cpuCores))}|${ANSI.fg.cyan}${miner.name} >> ${item.name}${ANSI.reset}`) }
    }

    /** @returns {Boolean} `true` if running on host, otherwise `false`*/
    function check_host() {
        if (ns.getHostname() != "home") { // If not running on home, say so and return
            ns.tprint(`${ANSI.fg.red}Script must be run on 'home', not '${ns.getHostname()}'.${ANSI.reset}`);
            ns.toast(`Foreman Stopped - Script must be run on 'home', not '${ns.getHostname()}'.`, "error");
            return false;
        } else { return true };
    };


    // =====OLD=====
    var working = {}; // Init working variable
    ns.disableLog("ALL"); // Disable logs

    // Set Constants
    const HOST = 'home';
    const DELAY = 5;
    const PROCESSES = 10;
    const MIN_FREE_HOME_RAM = ns.ls("home", "queue/").map((a) => ns.getScriptRam(a)).sort((a, b) => b - a)[0] + ns.getScriptRam("main.js");
    const MAX_FREE_HOME_RAM = ns.ls("home", "queue/").reduce((a, b) => a + ns.getScriptRam(b), 0) + ns.getScriptRam("main.js");
    // Repeat ad-nauseam
    while (true) {
        await ns.asleep(100);
        // Clean working list of any 
        working = clean_working_list(working);
        // Get list of jobs as queue
        let queue = get_queue();
        if (queue[0] == '') { continue };
        // While there are jobs in the queue
        while (queue.length > 0) {
            // Get list of miners
            let miners = get_miners();
            // If no miners, stop
            if (miners.size <= 0) { continue };
            // For each miner, take a job.
            for (let miner of miners) {
                // Pull first job and get details
                if (queue.length <= 0) { continue };
                let job = get_job_details(queue[0]);
                if (job == false) { queue.shift(); continue };
                // If too many processes, skip
                if (too_many_processes(miner)) { continue };
                // Get free RAM on miner (-12 if HOST)
                let free_ram = ns.getServerMaxRam(miner) - ns.getServerUsedRam(miner);
                // ns.print(miner, free_ram, MIN_FREE_HOME_RAM)
                if (miner == HOST) { free_ram -= MAX_FREE_HOME_RAM };
                // If not enough RAM, skip
                if (free_ram < job.ram) { continue };
                // Find max threads
                let max_threads = Math.floor(free_ram / job.ram);
                // If job is already working, subtract those threads
                if (item.name in Object.keys(working)) { job.threads = job.threads - working[item.name].threads };
                // If max threads too small for job, make job.threads = max threads , else remove the job from the queue
                if (max_threads < job.threads) { job.threads = max_threads } else { queue.shift() };
                // If job already has working threads, update the threads
                if (item.name in Object.keys(working)) {
                    // Add threads
                    working[item.name].threads += job.threads;
                    // If this job will end after the previous, update the time.
                    let end_time = Date.now() + job.time;
                    if (working[item.name].end < end_time) { working[item.name].end = end_time };
                } else { working[item.name] = { 'threads': job.threads, 'end': Date.now() + job.time } };
                // Run the job
                run_job(job, miner);
            };
            if (ns.getServerMaxRam('home') - ns.getServerUsedRam('home') < MIN_FREE_HOME_RAM) {
                ns.ui.closeTail();
                ns.tprint(`${ANSI.fg.red}Foreman Stopped - Not enough spare RAM on 'home',${ANSI.reset}`);
                ns.toast("Foreman Stopped - Not enough spare RAM on 'home'.", "error");
                return;
            };
            ns.print(`${ANSI.fg.magenta}${queue.length} jobs in the queue.${ANSI.reset}`);
            ns.print(`${ANSI.fg.magenta}Next job in queue: ${get_job_details(queue[0]).host} | ${get_job_details(queue[0]).script}${ANSI.reset}`)
            ns.print(`${ANSI.fg.magenta}Sleeping for ${DELAY} secs...${ANSI.reset}`)
            await ns.asleep((DELAY * 1000));
        };
        ns.print(`${ANSI.fg.magenta}Refreshing queue in ${DELAY} secs...${ANSI.reset}`)
        await ns.asleep((DELAY * 1000));
    };

    function run_job(job, miner) {
        ns.scp(job.script, miner, HOST);
        let success = ns.exec(job.script, miner, job.threads, item.name);
        if (success > 0) { ns.print(`${ANSI.fg.green}${job.script}|t=${job.threads}|${ANSI.fg.cyan}${miner} >> ${item.name}${ANSI.reset}`) }
        else { ns.print(`${ANSI.fg.red}Failed to execute ${job.script} | ${miner} >> ${item.name} | t=${job.threads}${ANSI.reset}`) };
    };

    function get_weaken_threads(server) {
        let sec_diff = server.hackDifficulty - server.minDifficulty;
        let threads = 1;
        while (true) {
            if (ns.weakenAnalyze(threads) > sec_diff) { return threads } else { threads++ };
            if (threads > 1000000) { return threads };
        };
    };

    function get_grow_threads(server) {
        let growth_factor = server.moneyMax / server.moneyAvailable;
        return Math.ceil(ns.growthAnalyze(server.hostname, growth_factor));
    };

    function get_hack_threads(server) { return Math.ceil(ns.hackAnalyzeThreads(server.hostname, server.moneyAvailable / 4)) };

    function get_job_details(mine) {
        let server = ns.getServer(mine);
        let job = {
            'host': mine,
            'script': '',
            'threads': '',
            'time': 0,
            'ram': 0
        };
        if (server.moneyAvailable == server.moneyMax && ns.formulas.hacking.hackChance(server, ns.getPlayer()) == 1) {
            job.script = 'scripts/_hack.js';
            job.threads = get_hack_threads(server);
            job.time = ns.getHackTime(item.name);
            job.ram = ns.getScriptRam(job.script, HOST);
        } else if (server.minDifficulty < server.hackDifficulty) {
            job.script = 'scripts/_weaken.js';
            job.threads = get_weaken_threads(server);
            job.time = ns.getWeakenTime(item.name);
            job.ram = ns.getScriptRam(job.script, HOST);
        } else if (server.moneyAvailable < server.moneyMax) {
            job.script = 'scripts/_grow.js';
            job.threads = get_grow_threads(server);
            job.time = ns.getGrowTime(item.name);
            job.ram = ns.getScriptRam(job.script, HOST);
        } else { return false };
        return job;
    };

    function get_miners() {
        // Make list of miners (smallest to largest)
        let miners = ns.read('miners.txt').split('\n');
        // Get list of purchased servers
        let custom = ns.getPurchasedServers();
        // Add each purchased server if any
        if (custom.length > 0) { for (let resource of custom) { miners.push(resource) } };
        return miners;
    };

    function get_queue() {
        // Create Queue from Mines.txt
        let mines = ns.read('mines.txt').split('\n');
        // Compare to working list
        let queue = [];
        for (let mine of mines) { if (mine in Object.keys(working)) { continue } else { queue.push(mine) } };
        // If empty, return empty list
        if (queue.length == 0) { return [] };
        return queue;
    };

    /**
     * 
     * @param {String} miner 
     * @returns 
     */
    function too_many_processes(miner) {
        // If too many things running, skip this server
        if (miner == HOST) { if (ns.ps(HOST).length >= PROCESSES) { return true } else { return false } }
        // else if (ns.ps(miner).length >= Math.ceil(Math.log2(ns.getServerMaxRam(miner)) / 2)) { return true }
        else { return false };
    };

    function clean_working_list(working) {
        for (let item of Object.keys(working)) {
            if (Date.now() > working[item].end) { delete working[item] };
        };
        return working;
    };
};