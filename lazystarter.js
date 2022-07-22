/** @param {NS} ns */
/**
 * Intention
 * - start several scripts
 * - only run once
 */
export async function main(ns) {
	var filesToExecute = [
		"/data-mining/world-profiler.js",
		"scpToWorld.js",
		"worldcracker.js",
		"selfHackWorld.js"
	];
	for (let i = 0; i < filesToExecute.length; i++) {
		if (i == 3) {
			//start purchasing script on foodnstuff first
			ns.tprint("starting purchasing server-script on foodnstuff");
			ns.exec("purchaseServer8GB.js", "foodnstuff", 1);
			await ns.sleep(1000);
		}
		ns.tprint("starting script ", filesToExecute[i]);
		ns.exec(filesToExecute[i], "home", 1);
		await ns.sleep(5000);
	}
	ns.tprint("LazyStarter done running. Enjoy!");
}