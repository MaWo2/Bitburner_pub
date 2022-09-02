/**
 * Intention:
 * - purchase upgraded servers and run HWGW-attacks on them to mine hacking experience and money
 * - currently hardcoded servers, RAM and targets
 * 
 * - to be used, after lazystarter finished and enough money is available
 * - if home is cappable of HWGW attacks, use it, else upgrade another server
 * 
 */

/** @param {NS} ns */
export async function main(ns) {
	var targetList = ["harakiri-sushi", "foodnstuff", "iron-gym"];
	var hostList = ["pserv-0", "pserv-1", "pserv-2"];
	var ram = 16384;
	var waitTime = 200;

	// if home is strong enough, use it, because it has more power than other servers
	if (ns.getServerMaxRam("home") >= 16384) {
		ns.exec("/batchhack/hwgw-queen.js", "home", 1, "the-hub", 50);
	} else {
		hostList.push("pserv-3");
		targetList.push("the-hub");
	}

	var i = 0;
	while (i < targetList.length) {
		//check, if we have enough money to buy a new server
		if (ns.getServerMoneyAvailable("home") >= ns.getPurchasedServerCost(ram)) {
			//upgrade server
			ns.exec("upgrade-server.js", "home", 1, hostList[i], ram);
			await ns.sleep(waitTime);
			//restart loop-hacking
			ns.exec("/loophack/loop-queen-pserv.js", "home", 1, "joesguns");
			await ns.sleep(waitTime);
			//start HWGW-attack on newly upgraded server
			ns.exec("/batchhack/hwgw-queen.js", hostList[i], 1, targetList[i], 50);
			//increment counter
			i++;
		}
		// wait for more money
		await ns.sleep(1000);
	}
	ns.tprint("Script done running. Servers upgraded and attacking.");
}
