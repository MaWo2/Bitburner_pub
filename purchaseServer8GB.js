/** @param {NS} ns */
export async function main(ns) {
	var ram = 8; //RAM for the new server
	var i = 0; //counter for new servers
	var attackScript = "/simplehack/simplehack-template.js";
	var target = "joesguns";
	var secThresh = 1;
	var moneyThresh = 0.9;
	var baseName = "pserv-";
	var loopQueenScript = "/loophack/loop-queen-pserv.js";

	while (i < ns.getPurchasedServerLimit()) {
		//check if enough money is available
		if (ns.getServerMoneyAvailable("home") >= ns.getPurchasedServerCost(ram)) {
			//1. buy one
			//2. copy file over
			//3. execute file
			//4. increment iterator
			
			var hostname = ns.purchaseServer(baseName + i, ram);
			await ns.scp(attackScript, "home", hostname);
			ns.exec(attackScript, hostname, 3, target, secThresh, moneyThresh);
			i++;
		}
		//wait some time to prevent strange names, if script is started with enough money to buy several servers
		await ns.sleep(5000);
	}
	//Once we got all servers we could buy, we start loop-hacking on them.
	ns.spawn(loopQueenScript, 1, "joesguns");

}