/** @param {NS} ns */
/**
 * Intention
 * - Try to nuke all servers; to be run after a new file was purchased or developed
 */
export async function main(ns) {
	var target = [];

	//check, if argument was provided
	//if so, crack that server
	//if not, try to find a list of servers and use that.
	if (ns.args.length == 0) {
		if (ns.fileExists("ServersOfTheWorld.txt", "home")) {
			ns.tprint("INFO: No argument provided, but file with servers found. Using this instead.");
			target = ns.read("ServersOfTheWorld.txt").split(",");
			//ns.tprint(target);
			//ns.exit();
		} else {
			ns.tprint("ERROR: no argument provided and no list found. Exiting script.");
			ns.exit();
		}
	} else {
		target.push(ns.args[0]); //due to whatever reason, this scripts interprets the input string as individual characters
	}
	
	//ns.tprint(target);
	ns.tprint(target.length);

	//recurse over list
	for (let i = 0; i < target.length; i++) {
		var openPorts = 0;
		//ns.tprint(target[i]);

		//check if files exist, use them if so
		if (ns.fileExists("BruteSSH.exe", "home")) {
			ns.brutessh(target[i]);
			openPorts++;
			await ns.sleep(200);
		}
		if (ns.fileExists("FTPCrack.exe", "home")) {
			ns.ftpcrack(target[i]);
			openPorts++;
			await ns.sleep(200);
		}
		if (ns.fileExists("relaySMTP.exe", "home")) {
			ns.relaysmtp(target[i]);
			openPorts++;
			await ns.sleep(200);
		}
		if (ns.fileExists("HTTPWorm.exe", "home")) {
			ns.httpworm(target[i]);
			openPorts++;
			await ns.sleep(200);
		}
		if (ns.fileExists("SQLInject.exe", "home")) {
			ns.sqlinject(target[i]);
			openPorts++;
			await ns.sleep(200);
		}

		//try to nuke the target
		if (ns.getServerNumPortsRequired(target[i]) <= openPorts) {
			ns.nuke(target[i]);
		} else {
			if (target.length == 1) {
				ns.tprint('ERROR: Server could not be nuked yet. Requires ${ns.getServerNumPortsRequired(target[i])} open ports.')
			}
		}
	}
	ns.tprint("Script done running.");
}