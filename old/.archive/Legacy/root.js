/** @param {NS} ns */
export async function main(ns) {
    var target = ns.args[0]
    var currentPorts = 0
    //Check level
    if (ns.getServerRequiredHackingLevel(target) > ns.getHackingLevel()) {
        ns.print('ERROR - Not high enough Level for ' + target)
    } else {
        //Check ports
        if (ns.fileExists('BruteSSH.exe')) {
            ns.brutessh(target)
            currentPorts++
        }
        if (ns.fileExists('FTPCrack.exe')) {
            ns.ftpcrack(target)
            currentPorts++
        }
        if (ns.fileExists('HTTPWorm.exe')) {
            ns.httpworm(target)
            currentPorts++
        }
        if (ns.fileExists('SQLInject.exe')) {
            ns.sqlinject(target)
            currentPorts++
        }
        if (ns.fileExists('relaySMTP.exe')) {
            ns.relaysmtp(target)
            currentPorts++
        }
        if (ns.getServerNumPortsRequired(target) > currentPorts) {
            ns.print('ERROR - Not enough Ports on ' + target)
        } else {
            //Nuke.exe
            ns.nuke(target)
            //Backdoor
            ns.run('backdoor.js', 1, target)
        }
    }
}