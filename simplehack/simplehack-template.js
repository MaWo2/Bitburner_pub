/** @param {NS} ns */
export async function main(ns) {
	var target = ns.args[0];
	//I usually forget to supply these values...
	//let's hardcode them
	//var securityThreshold = ns.args[1]; //e.g. 1
	//var moneyThreshold = ns.args[2]; //e.g. 0.9
	var securityThreshold = 1
	var moneyThreshold = 0.9
	
	//assume, target is already nuked

	while (true) {
		if (ns.getServerSecurityLevel(target) > ns.getServerMinSecurityLevel(target) + securityThreshold) {
			//if server security is too high --> weaken
			await ns.weaken(target);
		} else if (ns.getServerMoneyAvailable(target) < ns.getServerMaxMoney(target) * moneyThreshold) {
			//if server has too little money --> grow
			await ns.grow(target);
		} else {
			//if everything is right --> hack
			await ns.hack(target);
		}
	}
}
