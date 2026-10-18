/** @param {NS} ns */
export async function main(ns) {
  var servers = ns.cloud.getServerNames();
  for (let server of servers) {
    ns.killall(server);
    ns.cloud.deleteServer(server);
    ns.tprint(`Deleted ${server}`);
  }
}
