/**
 * Intention:
 * - restart HWGW hacking, if it had to be killed
 */
/** @param {NS} ns */
export async function main(ns) {
	var targetList = ["harakiri-sushi", "iron-gym", "the-hub", "sigma-cosmetics", "hong-fang-tea", "zer0", "nectar-net", "max-hardware", "neo-net"]; //changed order: fns generates most hacking exp, which makes hacking of other servers easier --> try attacking it on home
	var threadList = [50, 50, 50, 50, 50, 50, 50, 50, 50];
	var hostList = [];
	var pservList = ns.getPurchasedServers();
	var pservCounter = targetList.length;
	var index; 
	for (let i = 1; i <= pservCounter; i++) {
		index = pservList.length - i;
		hostList.push("pserv-" + index);
	}
	var i = 0;
	while (i < targetList.length) {
		//start HWGW-attack on newly upgraded server
		ns.exec("/batchhack/hwgw-queen.js", hostList[i], 1, targetList[i], threadList[i]);
		//stop self-hacking scripts on target servers, because the block HWGW attacks
		ns.scriptKill("/simplehack/simplehack-self.js", targetList[i]);
		//increment counter
		i++;
		// wait for more money
		await ns.sleep(1000);
	}

}
