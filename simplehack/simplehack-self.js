/** @param {NS} ns */
// This script is mainly intended to gain experience and optimising servers.
// Accordingly, thresholds are rather high.
export async function main(ns) {
	var target = ns.getHostname();
	var securityThreshold = 1; //e.g. 1
	var moneyThreshold = 0.9; //e.g. 0.9
	var isFaction = false;
	//list of faction servers, because those cannot be hacked (money = 0)
	//if server is faction server, switch target to harakiri-sushi
	var factionServers = ["CSEC", "avmnite-02h", "I.I.I.I", "run4theh111z", "." ,"The-Cave", "w0r1d_d43m0n"];
	if (factionServers.includes(target)) {
		target = "harakiri-sushi";
		isFaction = true;
	}
	
	//assume, target is already nuked
	
	//initial loop to generate some early-game income
	//hack server to 1% money, but avoid server getting too strong. If server starts out too strong, this should not trigger at all.
	while ((isFaction == false) && (ns.getServerMoneyAvailable(target) > ns.getServerMaxMoney(target) * 0.01) && (ns.getServerSecurityLevel(target) < ns.getServerMinSecurityLevel(target) + 10)) {
		await ns.hack(target);
	}

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
