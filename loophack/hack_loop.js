/** @param {NS} ns */
export async function main(ns) {
	var target = ns.args[0];
	while (true) {
		//safety-net to prevent the server from dropping too low
		if (ns.getServerMoneyAvailable(target)>ns.getServerMaxMoney(target)*0.9) {
			await ns.hack(target);
		} else {
			await ns.sleep(1000);
		}
	}
}
