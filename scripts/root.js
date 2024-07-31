/** @param {NS} ns */
export async function main(ns) {
    let target = ns.args[0]
    let currentPorts = 0
    //Check level
    if (ns.getServerRequiredHackingLevel(target) > ns.getHackingLevel()) {
        ns.print('ERROR - Not high enough Level for ' + target)
    } else {
        //Check ports
        if (ns.fileExists('BruteSSH.exe')) {
            ns.brutessh(target)
            ns.print(`SUCCESS - Brute-forced ${target}`)
            currentPorts++
        }
        if (ns.fileExists('FTPCrack.exe')) {
            ns.ftpcrack(target)
            ns.print(`SUCCESS - Cracked FTP on ${target}`)
            currentPorts++
        }
        if (ns.fileExists('HTTPWorm.exe')) {
            ns.httpworm(target)
            ns.print(`SUCCESS - Opened HTTP on ${target}`)
            currentPorts++
        }
        if (ns.fileExists('SQLInject.exe')) {
            ns.sqlinject(target)
            ns.print(`SUCCESS - Injected SQL to ${target}`)
            currentPorts++
        }
        if (ns.fileExists('relaySMTP.exe')) {
            ns.print(`SUCCESS - Redirected SMTP data for ${target}`)
            ns.relaysmtp(target)
            currentPorts++
        }
        if (ns.getServerNumPortsRequired(target) > currentPorts) {
            ns.tprint(`WARN - Skipping ${target}. (Needs ${ns.getServerNumPortsRequired(target)} ports open)`)
        } else {
            //Nuke.exe
            if (ns.hasRootAccess(target) === false) {
                ns.nuke(target)
                ns.tprint(`SUCCESS - Nuked ${target}.`)
            }
        }
    }
}