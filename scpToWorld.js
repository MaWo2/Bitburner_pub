/** @param {NS} ns */
/**
 * Intention:
 * - Copy useful file to all servers
 * - to be used only once at the beginning of a run, because there are no checks for overwriting.
 */
export async function main(ns) {
	var target = ns.read("ServersOfTheWorld.txt").split(",");
	var foldersToCopy = ["/simplehack", "/batchhack", "/loophack"];
	var filesToCopy = ["monitor.js", "n-monitor.js", "purchaseServer8GB.js", "connect-to.js"];
	for (let i = 0; i < target.length; i++) {
		//copy files to servers
		for (let j = 0; j < foldersToCopy.length; j++) {
			await ns.scp(ns.ls("home", foldersToCopy[j]), target[i], "home");
		}
		await ns.scp(filesToCopy, target[i], "home");
	}	
}
