/** @param {NS} ns */
// This script is mainly intended to gain experience and optimising servers.
// Accordingly, thresholds are rather high.
export async function main(ns) {
	var target = ns.getHostname();
	var securityThreshold = 1; //e.g. 1
	var moneyThreshold = 0.9; //e.g. 0.9
	
	//assume, target is already nuked

	while (true) {
		if (ns.getServerSecurityLevel > ns.getServerMinSecurityLevel + securityThreshold) {
			//if server security is too high --> weaken
			await ns.weaken(target);
		} else if (ns.getServerMoneyAvailable < ns.getServerMaxMoney * moneyThreshold) {
			//if server has too little money --> grow
			await ns.grow(target);
		} else {
			//if everything is right --> hack
			await ns.hack(target);
		}
	}
}