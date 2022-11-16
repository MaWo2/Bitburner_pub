/** @param {NS} ns */
/**
 * Intention
 * - start several scripts
 * - only run once
 */
export async function main(ns) {
	var filesToExecute = [
		//"/sleeves/sleeve-starter.js", //--> moved to different caller
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
	// no longer necessary, as the waiting time between execs was reduced in worldcracker script
	//ns.spawn("selfHackWorld.js", 1); //call the script again, because in endgame situation worldcracker is not finished before selfhack starts
}
