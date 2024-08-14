/** @param {NS} ns */
export async function main(ns) {
    let target = ns.args[0]
    let currentPorts = 0

    //Check level
    let req_level = ns.getServerRequiredHackingLevel(target)
    let player_level = ns.getHackingLevel()
    if (req_level > player_level) {
        ns.print(`ERROR - Hacking level not high enough to hack ${target} - ${player_level}/${req_level}`)
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
            ns.relaysmtp(target)
            ns.print(`SUCCESS - Redirected SMTP data for ${target}`)
            currentPorts++
        }
        // ns.tprint(`SUCCESS - Opened ${currentPorts} ports on ${target}.`)
        if (ns.getServerNumPortsRequired(target) > currentPorts) {
            ns.tprint(`WARN - Opened ${currentPorts}/${ns.getServerNumPortsRequired(target)} ports on ${target}.`)
        } else {
            //Nuke.exe
            if (ns.hasRootAccess(target) === false) {
                ns.nuke(target)
                ns.tprint(`SUCCESS - Nuked ${target}.`)
            }
        }
    }
}