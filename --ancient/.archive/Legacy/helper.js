/** @param {NS} ns */
export async function main(ns) {
    while (true) {
        // ns.tprint('=====Initialising...=====')
        var toScanList = ns.scan('home')
        var scannedList = ['home']
        var targetsList = []
        var targetsPercent = []
        var targetsType = []
        var currentSecPercent = 0
        var currentMoneyPercent = 0
        var target = []
        var type = []
        var percent = []
        // ns.tprint('=====Scanning...=====')
        while (toScanList.length !== 0) {
            toScanList.forEach(function (current) {
                currentSecPercent = Math.floor(ns.getServerMinSecurityLevel(current) / ns.getServerSecurityLevel(current) * 100)
                currentMoneyPercent = Math.floor(ns.getServerMoneyAvailable(current) / ns.getServerMaxMoney(current) * 100)
                if (ns.hasRootAccess(current) == true) {
                    if (currentSecPercent <= currentMoneyPercent) {
                        targetsList.push(current)
                        targetsPercent.push(currentSecPercent)
                        targetsType.push('Sec')
                    } else {
                        targetsList.push(current)
                        targetsPercent.push(currentSecPercent)
                        targetsType.push('Money')
                    }
                }
                scannedList.push(current)
                toScanList = toScanList.concat(ns.scan(current))
            })
            scannedList.forEach(function (remove) {
                toScanList = toScanList.filter(v => v !== remove)
            })
        }
        // ns.tprint('=====Finding target...=====')
        // ns.tprint(targetsList+'\n'+targetsPercent)
        percent = Math.min(...targetsPercent)
        target = targetsList[targetsPercent.indexOf(percent)]
        type = targetsType[targetsPercent.indexOf(percent)]
        // ns.tprint('Target is '+target+' - Percent is '+percent+' - Type is '+type)
        // ns.tprint('=====Helping...=====')
        if (percent > 95) {
            await ns.hack(target)
            ns.print('Hacking ' + target)
        } else if (type == 'Sec') {
            ns.print('Weakening ' + target)
            await ns.weaken(target)
        } else {
            ns.print('Growing ' + target)
            await ns.grow(target)
        }
    }
}