/** @param {NS} ns */
export async function main(ns) {
    ns.run('/remoteScript/layOfTheLand.js', 1)
    await ns.sleep(10000)
    ns.run('/remoteScript/homeDeployer.js', 1)
    var currentLevel = ns.getHackingLevel()
    while (true) {
        if (currentLevel < ns.getHackingLevel()) {
            ns.run('/remoteScript/layOfTheLand.js', 1)
            currentLevel = ns.getHackingLevel()
        }
        await ns.sleep(60000)
        ns.run('/remoteScript/homeDeployer.js', 1)
    }
}