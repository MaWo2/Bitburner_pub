/** @param {NS} ns */
/**
 * Intention
 * - upgrade a player-owned server
 */
export async function main(ns) {
	var serverToUpgrade = ns.args[0];
	var upgradeToRAM = ns.args[1]; //16TB = 16384; costs about 0.91 b
	// Add check if enough money available

	// Check if all arguments were provided (name and RAM)
	if (ns.args.length != 2) {
		ns.tprint("ERROR! Please provide name and RAM!");
	} else {
		ns.killall(serverToUpgrade);
		ns.deleteServer(serverToUpgrade);
		ns.purchaseServer(serverToUpgrade, upgradeToRAM);
	}
	
	//copy files to new servers
	var foldersToCopy = ["/simplehack", "/batchhack", "/loophack"];
	var filesToCopy = ["monitor.js", "n-monitor.js", "purchaseServer8GB.js", "connect-to.js"];
	for (let j = 0; j < foldersToCopy.length; j++) {
		await ns.scp(ns.ls("home", foldersToCopy[j]), serverToUpgrade, "home");
	}
	await ns.scp(filesToCopy, serverToUpgrade, "home");
}
