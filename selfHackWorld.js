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
	var batchHackTargets = ["harakiri-sushi", "foodnstuff", "iron-gym", "the-hub"];
	var scriptRAM = ns.getScriptRam(attackScript);
	var scriptRAM2 = ns.getScriptRam(attackScript2);
	for (let i = 0; i < target.length; i++) {
		if (ns.getServerRequiredHackingLevel(target[i]) <= playerHackingLevel) {
			//check, if this server is possibly attacked by a HWGW script. If so, don't hack self, because then HWGW does not earn properly.
			if (batchHackTargets.includes(target)) {
				if (ns.hasRootAccess(target[i])) {
					var maxThreads = Math.floor((ns.getServerMaxRam(target[i]) - ns.getServerUsedRam(target[i])) / scriptRAM2);
					if (maxThreads > 0) {
						ns.exec(attackScript2, target[i], maxThreads, "joesguns");
					}
				}
			} else {
				//kill possibly running hacking templates
				ns.scriptKill(attackScript2, target[i]);
				var maxThreads = Math.floor((ns.getServerMaxRam(target[i]) - ns.getServerUsedRam(target[i])) / scriptRAM);
				if (maxThreads > 0) {
					ns.exec(attackScript, target[i], maxThreads);
				}
			}
		} else {
			//if hacking level not high enough, but root access available, hack joesguns
			if (ns.hasRootAccess(target[i])) {
				var maxThreads = Math.floor((ns.getServerMaxRam(target[i]) - ns.getServerUsedRam(target[i])) / scriptRAM2);
				if (maxThreads > 0) {
					ns.exec(attackScript2, target[i], maxThreads, "joesguns");
				}
			}
		}
	}
}
