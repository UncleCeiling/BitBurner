import { ANSI } from "../imports/ANSI";
/** @param {NS} ns */
export async function main(ns) {
    // Disable logs
    ns.disableLog("ALL");
    // Set Constants
    const HOST = 'home';
    const DELAY = 1;
    const PROCESSES = 10;
    const QUEUE_LIST = ns.ls("home", "queue/");
    const MIN_FREE_HOME_RAM = QUEUE_LIST.map((a) => ns.getScriptRam(a)).sort((a, b) => b - a)[0] + ns.getScriptRam("main.js");
    const MAX_FREE_HOME_RAM = QUEUE_LIST.reduce((a, b) => a + ns.getScriptRam(b), 0) + ns.getScriptRam("main.js");
    // Create Working variable
    let working = {};
    // If not running on home, say so and return
    if (ns.getHostname() != HOST) {
        ns.tprint(`${ANSI.fg.red}Script must be run on 'home', not '${ns.getHostname()}'.${ANSI.reset}`);
        ns.toast(`Foreman Stopped - Script must be run on 'home', not '${ns.getHostname()}`, "error");
        return;
    };
    ns.ui.openTail();
    await ns.asleep(100);
    resize_tail();
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
            await ns.asleep(200);
            // Get list of miners
            let miners = get_miners();
            // If no miners, stop
            if (miners.size <= 0) { continue };
            // For each miner, take a job.
            for (let miner of miners) {
                // Pull first job and get details
                if (queue.length <= 0) { continue };
                let job = get_job_details(queue[0]);
                if (job == false) { continue };
                // If too many processes, skip
                if (too_many_processes(miner)) { continue };
                // Get free RAM on miner (-12 if HOST)
                let free_ram = ns.getServerMaxRam(miner) - ns.getServerUsedRam(miner);
                // ns.print(miner, free_ram, MIN_FREE_HOME_RAM)
                if (miner == HOST) { free_ram -= MAX_FREE_HOME_RAM };
                // If not enough RAM, skip
                // if (free_ram < job.ram) { ns.print(`WARN - ${miner} - Not enough RAM.`); continue }
                if (free_ram < job.ram) { continue };
                // Find max threads
                let max_threads = Math.floor(free_ram / job.ram);
                // If job is already working, subtract those threads
                if (job.host in Object.keys(working)) { job.threads = job.threads - working[job.host].threads };
                // If max threads too small for job, make job.threads = max threads , else remove the job from the queue
                if (max_threads < job.threads) { job.threads = max_threads } else { queue.shift() };
                // If job already has working threads, update the threads
                if (job.host in Object.keys(working)) {
                    // Add threads
                    working[job.host].threads += job.threads;
                    // If this job will end after the previous, update the time.
                    let end_time = Date.now() + job.time;
                    if (working[job.host].end < end_time) { working[job.host].end = end_time };
                } else { working[job.host] = { 'threads': job.threads, 'end': Date.now() + job.time } };
                // Run the job
                run_job(job, miner);
            };
            if (ns.getServerMaxRam('home') - ns.getServerUsedRam('home') < MIN_FREE_HOME_RAM) {
                ns.ui.closeTail();
                ns.tprint(`${ANSI.fg.red}Foreman Stopped - Not enough spare RAM on 'home',${ANSI.reset}`);
                ns.toast("Foreman Stopped - Not enough spare RAM on 'home'.", "error");
                return;
            };
            await ns.asleep((DELAY * 1000));
        };
        await ns.asleep((DELAY * 1000));
    };

    function run_job(job, miner) {
        ns.scp(job.script, miner, HOST);
        let success = ns.exec(job.script, miner, job.threads, job.host);
        if (success > 0) { ns.print(`${ANSI.fg.green}${job.script}|t=${job.threads}|${ANSI.fg.cyan}${miner} >> ${job.host}${ANSI.reset}`) }
        else { ns.print(`${ANSI.fg.red}Failed to execute ${job.script} | ${miner} >> ${job.host} | t=${job.threads}${ANSI.reset}`) };
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
        if (server.minDifficulty < server.hackDifficulty) {
            job.script = 'scripts/_weaken.js';
            job.threads = get_weaken_threads(server);
            job.time = ns.getWeakenTime(job.host);
            job.ram = ns.getScriptRam(job.script, HOST);
        } else if (server.moneyAvailable < server.moneyMax && server.moneyMax > 0 && server.moneyAvailable > 0) {
            job.script = 'scripts/_grow.js';
            job.threads = get_grow_threads(server);
            job.time = ns.getGrowTime(job.host);
            job.ram = ns.getScriptRam(job.script, HOST);
        } else if (server.moneyAvailable == server.moneyMax && server.moneyMax > 0 && server.moneyAvailable > 0) {
            job.script = 'scripts/_hack.js';
            job.threads = get_hack_threads(server);
            job.time = ns.getHackTime(job.host);
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
        if (custom.length > 0) {
            for (let resource of custom) {
                miners.push(resource);
            };
        };
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
        if (miner == "") { return true }
        if (miner == HOST) { if (ns.ps(HOST).length >= PROCESSES) { return true } else { return false } }
        else if (ns.ps(miner).length >= Math.ceil(Math.log2(ns.getServerMaxRam(miner)) / 2)) { return true } else { return false };
    };

    function clean_working_list(working) {
        for (let item of Object.keys(working)) {
            if (Date.now() > working[item].end) { delete working[item] };
        };
        return working;
    };

    function resize_tail() {
        let screen = ns.ui.windowSize();
        let characters_wide = 72;
        let font_size = ns.ui.getStyles().tailFontSize;
        let line_size = ns.ui.getStyles().lineHeight;
        let tail_width = (characters_wide * font_size * 0.6) + 3;
        let tail_height = (2 * font_size * line_size) + 9;
        ns.ui.resizeTail(tail_width, tail_height);
        ns.ui.moveTail((screen[0] - tail_width) / 2, 0);
    };
};