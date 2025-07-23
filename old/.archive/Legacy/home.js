/** @param {NS} ns */
export function main(ns) {
    ns.tprint('INFO - Housekeeping has arrived!')
    var target = 'home'
    var threads = 0
    var maxRam = 0
    //Backdoor
    if (ns.getServer(target).backdoorInstalled == false) {
        ns.singularity.connect(target)
        ns.singularity.installBackdoor
        ns.tprint('Installed Backdoor on home')
    }
    if ((ns.getServerMaxRam(target) - 256) >= (ns.getServerMaxRam(target) * 0.5)) {
        maxRam = (ns.getServerMaxRam(target) - 256)
    } else { maxRam = (ns.getServerMaxRam(target) * 0.5) }
    var ram = (maxRam - ns.getServerUsedRam(target))
    var script = ns.getScriptRam('helper.js')
    var query = 1
    // ns.tprint('Ram = ' + ram)
    // ns.tprint('Deploying to ' + target + ' now...');
    if ((ram / script) > 1) {
        while (threads == 0) {
            if ((script * query) <= ram && (script * query * 2) > ram) {
                // ns.tprint('Query'+query)
                threads = query
            } else {
                query = query * 2
            }
        }
    }
    // ns.tprint('running helper ' + target + threads)
    if (threads >= 1) {
        if (ns.exec('helper.js', target, threads, target, Date.now()) == 0) {
            ns.tprint('ERROR - Helpers failed to deploy on Home')
        } else {
            ns.tprint('SUCCESS - Deployed ' + threads + ' Helpers to Home')
        }
    }
    ns.tprint('INFO - Housekeeping has finished managing Home.')
    ns.spawn('gang.js')
}