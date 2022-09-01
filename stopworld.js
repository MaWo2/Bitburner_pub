/**
* Intention:
* - Stop scripts on all world servers
*/
/** @param {NS} ns */
export async function main(ns) {
  var target = ns.read("ServersOfTheWorld.txt").split(",");
  for (let i = 0; i < target.length; i++) {
    ns.killall(target[i]);
  }
}
