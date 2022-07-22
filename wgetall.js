/** @param {NS} ns */
export async function main(ns) {
	const baseURL = "https://raw.githubusercontent.com/MaWo2/Bitburner_pub/master/";
	var filesToPull = [];
	var fileInfo =[];
	var gitPath;
	var localPath;

	//Define files to pull
	//will be pulled into the same folder structure
	filesToPull = [
		["", "monitor.js"],
		["", "purchaseServer8GB.js"],
		["", "scpToWorld.js"],
		["", "selfHackWorld.js"],
		["", "worldcracker.js"],
		["simplehack/", "simplehack-self.js"],
		["simplehack/", "simplehack-template.js"],
		["loophack/", "grow_loop.js"],
		["loophack/", "grow_once.js"],
		["loophack/", "hack_loop.js"],
		["loophack/", "hack_once.js"],
		["loophack/", "weaken_loop.js"],
		["loophack/", "weaken_once.js"],
		["loophack/", "loop-queen-pserv.js"],
		["loophack/", "loop-queen-outside.js"],
		["batchhack/", "hwgw-queen.js"],
		["batchhack/", "b-grow.js"],
		["batchhack/", "b-hack.js"],
		["batchhack/", "b-weaken.js"],
		["data-mining/", "world-profiler.js"],
		["data-mining/", "func_world-scanner.js"]
	]

	//Pull them
	for (let i = 0; i < filesToPull.length; i++) {
		//seperate the current info from the list
		fileInfo[i] = filesToPull[i];
		//generate full path info of github
		gitPath = baseURL + fileInfo[i][0] + fileInfo[i][1];
		//prepare local path info
		if (fileInfo[i][0] == "") {
			//copy to home folder
			localPath = fileInfo[i][1];
		} else {
			//copy to subfolder, needs leading "/"
			localPath = "/" + fileInfo[i][0] + fileInfo[i][1];
		}
		//actual pull command
		await ns.wget(gitPath, localPath);
	}
	ns.tprint("Script done running.");
}