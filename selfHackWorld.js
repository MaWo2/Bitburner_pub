/** @param {NS} ns */
/**
 * Intention
 * - Start self-hacking script on all hackable servers, with as many threads as possible
 * - uses only available RAM to not disturb running scripts
 */
export async function main(ns) {
	var target = ns.read("ServersOfTheWorld.txt").split(",");
	var playerHackingLevel = ns.getHackingLevel();
	var attackScript = "/simplehack/simplehack-self.js"
	var attackScript2 = "/simplehack/simplehack-template.js"
	var scriptRAM = ns.getScriptRam(attackScript);
	var scriptRAM2 = ns.getScriptRam(attackScript2);
	for (let i = 0; i < target.length; i++) {
		if (ns.getServerRequiredHackingLevel(target[i]) <= playerHackingLevel) {
			var maxThreads = Math.floor((ns.getServerMaxRam(target[i]) - ns.getServerUsedRam(target[i])) / scriptRAM);
			if (maxThreads > 0) {
				ns.exec(attackScript, target[i], maxThreads);
			}
		} else {
			if (ns.hasRootAccess(target[i])) {
				var maxThreads = Math.floor((ns.getServerMaxRam(target[i]) - ns.getServerUsedRam(target[i])) / scriptRAM2);
				if (maxThreads > 0) {
					ns.exec(attackScript2, target[i], maxThreads, "joesguns");
				}
			}
		}
	}
}
