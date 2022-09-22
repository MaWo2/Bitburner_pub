/**
 * Intention: controller for loop-hacking algorithem as described in the docs (https://bitburner.readthedocs.io/en/latest/advancedgameplay/hackingalgorithms.html)
 * 
 * Idea:
 * 	- controller script (Queen)
 * 		- checks stats of target server
 * 		- prepares target server (minimise security, maximise money)
 * 		- once prepared it starts the drones for hacking, weakening and growing (1:2:10)
 * 		- monitors target server to check stats are optimal --> not implemented
 * 
 */

/** @param {NS} ns */
export async function main(ns) {
	var targetName = ns.args[0]
	var targetServer;
	var currentSecurityLevel;
	var minimalSecurityLevel;
	var currentMoney;
	var maximalMoney;
	var droneServers = []; // list of servers that can be used as drones, initialised as empty array

	// get stats of target server
	targetServer = ns.getServer(targetName); //2 GB RAM cost
	//ns.tprint(targetServer); //ns.print sends to tailing log
	currentSecurityLevel = targetServer.hackDifficulty;
	minimalSecurityLevel = targetServer.minDifficulty;
	currentMoney = targetServer.moneyAvailable;
	maximalMoney = targetServer.moneyMax;

	// prepare list of drone servers
	// prepare for future changes
	// calling ns.getPurchasedServers costs 2.25 GB RAM
	droneServers = ns.getPurchasedServers();
	/**
	for (let i = 0; i < 25; i++) {
		droneServers.push("pserv-" + i);
	}
	*/
	//ns.tprint(droneServers);

	// prepare drones --> stopp all scripts on drones
	for (let i = 0; i < droneServers.length; i++) {
		//ns.tprint("Killing all scripts on server: ", droneServers[i]);
		ns.killall(droneServers[i]); // 0.5 GB RAM cost
		// copy necessary scripts to drone
		// weaken_once.js; grow_once.js; weaken_loop.js; grow_loop.js; hack_loop.js
		var filesToTransfer = ["/loophack/weaken_once.js","/loophack/grow_once.js","/loophack/weaken_loop.js","/loophack/grow_loop.js","/loophack/hack_loop.js"];
		await ns.scp(filesToTransfer, droneServers[i]);
	}

	// 1 thread of weaken reduces 0.05 security
	// security is not above 100 and not below 0 
	// grow will increase server security by 0.004
	// successful hacking will increase server security by 0.002, but hacking is 3x faster than grow and 3.2 than weaken
	
	// I assume this script uses only player-owned 8 GB servers as drones

	// prepare target server
	// weaken to minimum first, then grow, then weaken again to minimum (or weaken together with grow)
	while (currentSecurityLevel > (minimalSecurityLevel + 0.5)) {
		// check if drone is already running a weaken script
		// if not start it
		//ns.tprint("server needs to be weakened");
		for (let i = 0; i < droneServers.length; i++) {
			if (! ns.isRunning("/loophack/weaken_once.js", droneServers[i], targetName)) {
				ns.exec("/loophack/weaken_once.js", droneServers[i], 4, targetName);
			}
		}
		
		await ns.sleep(1000); // wait a little bit
		//update value
		targetServer = ns.getServer(targetName);
		currentSecurityLevel = targetServer.hackDifficulty;
		minimalSecurityLevel = targetServer.minDifficulty;
	}

	// server is weakened
	// kill scripts on all drones, no longer necessary
	for (let i = 0; i < droneServers.length; i++) {
		ns.killall(droneServers[i]); 
	}

	// grow server to maximum, counter with weaken 10:2 --> 25 servers 21 for growing, 4 to weaken
	// on BN 10 we only have 15 player servers; I'll stick with 4x weaken, although it possibly overweakens.
	while (currentMoney <= (maximalMoney * 0.95)) {
		//ns.tprint(currentMoney/maximalMoney);
		// check if drone is already running a grow/weaken script
		// if not start it
		//ns.tprint("server needs to be grown and weakened");
		for (let i = 0; i < (droneServers.length - 4); i++) {
			if (! ns.isRunning("/loophack/grow_once.js", droneServers[i], targetName)) {
				ns.exec("/loophack/grow_once.js", droneServers[i], 4, targetName);
			}
		}

		for (let i = 0; i < 4; i++) {
			if (! ns.isRunning("/loophack/weaken_once.js", droneServers[droneServers.length - 4 + i], targetName)) {
				ns.exec("/loophack/weaken_once.js", droneServers[droneServers.length - 4 + i], 4, targetName);
			}
		}
		await ns.sleep(1000); // wait a little bit
		//update value
		targetServer = ns.getServer(targetName);
		currentSecurityLevel = targetServer.hackDifficulty;
		minimalSecurityLevel = targetServer.minDifficulty;
		currentMoney = targetServer.moneyAvailable;
		maximalMoney = targetServer.moneyMax;
	}
	
	// server is maximised
	// kill scripts on all drones, no longer necessary
	for (let i = 0; i < droneServers.length; i++) {
		ns.killall(droneServers[i]); 
	}

	// weaken once more to be on the safe side
	while (currentSecurityLevel > (minimalSecurityLevel + 0.5)) {
		// check if drone is already running a weaken script
		// if not start it
		//ns.tprint("server needs to be weakened again");
		for (let i = 0; i < droneServers.length; i++) {
			if (! ns.isRunning("/loophack/weaken_once.js", droneServers[i], targetName)) {
				ns.exec("/loophack/weaken_once.js", droneServers[i], 4, targetName);
			}
		}
		
		await ns.sleep(1000); // wait a little bit
		//update value
		targetServer = ns.getServer(targetName);
		currentSecurityLevel = targetServer.hackDifficulty;
		minimalSecurityLevel = targetServer.minDifficulty;
	}

	// server is weakened and maximised
	// kill scripts on all drones, no longer necessary
	for (let i = 0; i < droneServers.length; i++) {
		ns.killall(droneServers[i]); 
	}

	// start loop hacking algorithm
	// adjust endgame-starter-script to use servers at end of array
	// 2 servers hack, 4 weaken, 19 grow (changed the order)
	// BN 10: 1 hack, 3 weaken, 11 grow
	// index 0 --> always hack
	// index 1 --> switch to growing, if < 25 servers available
	// indices 2, 3, 4 --> always weaken
	// index 5 --> switch to growing, if < 25 servers available
	// ns.tprint("server would be attacked now");
	for (let i = 0; i < droneServers.length; i++) {
		switch (i) {
			case 0:
				ns.exec("/loophack/hack_loop.js", droneServers[i], 4, targetName);
				break;
			case 1:
				if (droneServers.length < 25) {
					// use default action
					ns.exec("/loophack/grow_loop.js", droneServers[i], 4, targetName);
				} else {
					ns.exec("/loophack/hack_loop.js", droneServers[i], 4, targetName);
				}
				break;
			case 2:
				ns.exec("/loophack/weaken_loop.js", droneServers[i], 4, targetName);
				break;
			case 3:
				ns.exec("/loophack/weaken_loop.js", droneServers[i], 4, targetName);
				break;
			case 4:
				ns.exec("/loophack/weaken_loop.js", droneServers[i], 4, targetName);
				break;
			case 5:
				if (droneServers.length < 25) {
					// use default action
					ns.exec("/loophack/grow_loop.js", droneServers[i], 4, targetName);
				} else {
					ns.exec("/loophack/weaken_loop.js", droneServers[i], 4, targetName);
				}
				break;
			default:
				ns.exec("/loophack/grow_loop.js", droneServers[i], 4, targetName);
		}

		
	}


}
