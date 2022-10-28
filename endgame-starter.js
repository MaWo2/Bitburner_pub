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
	var targetList = ["harakiri-sushi", "iron-gym", "the-hub", "sigma-cosmetics", "hong-fang-tea", "zer0", "nectar-net", "max-hardware", "neo-net"]; //changed order: fns generates most hacking exp, which makes hacking of other servers easier --> try attacking it on home
	var threadList = [50, 50, 50, 50, 50, 50, 50, 50, 50]; 
	var hostList = []; // initialise as empty array
	var ram = 16384;
	var waitTime = 200;
	var pservCounter = 0;

	// if home is strong enough, use it; it has more power than other servers
	if (ns.getServerMaxRam("home") >= 16384) {
		ns.exec("/batchhack/hwgw-queen.js", "home", 1, "foodnstuff", 25);
	} else {
		// if not --> push target to target list and add one more
		targetList.unshift("foodnstuff");
		threadList.unshift(25); //initially, foodnstuff needs to many threads to be attacked to 50%; needs several augs
	}
	
	// fill list of attack servers
	// we need as many servers, as items in the target list
	// use pserv's from end of the list, because the low index servers might have different scripts running
	var index;
	var pservList = ns.getPurchasedServers();
	pservCounter = targetList.length;
	for (let i = 1; i <= pservCounter; i++) {
		index = pservList.length - i;
		hostList.push("pserv-" + index);
	}

	var i = 0;
	while (i < targetList.length) {
		//check, if we have enough money to buy a new server
		if (ns.getServerMoneyAvailable("home") >= ns.getPurchasedServerCost(ram)) {
			//check, if server was already upgraded
			if (ns.getServerMaxRam(hostList[i]) >= 16384) {
				//increment counter and get out of loop
				i++
				continue;
			}
			//upgrade server
			ns.exec("upgrade-server.js", "home", 1, hostList[i], ram);
			await ns.sleep(waitTime);
			//restart loop-hacking
			//restarting the loop queen on home kills all running scripts on pserv's --> including already running HWGW-attacks
			ns.exec("/loophack/grow_loop.js", hostList[i], 4, "joesguns");
			
			await ns.sleep(waitTime);
			//start HWGW-attack on newly upgraded server
			ns.exec("/batchhack/hwgw-queen.js", hostList[i], 1, targetList[i], threadList[i]);
			//stop self-hacking scripts on target servers, because the block HWGW attacks
			ns.scriptKill("/simplehack/simplehack-self.js", targetList[i]);
			//increment counter
			i++;
		}
		// wait for more money
		await ns.sleep(1000);
	}
	ns.tprint("Script done running. Servers upgraded and attacking.");
}
