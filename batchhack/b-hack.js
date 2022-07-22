/** @param {NS} ns */
export async function main(ns) {
	let target = ns.args[1];
	await ns.sleep(ns.args[0]);
	//only hack, if server is at max money
	if ((ns.getServerMoneyAvailable(target) == ns.getServerMaxMoney(target)) && (ns.getServerSecurityLevel(target) == ns.getServerMinSecurityLevel(target))) {
		await ns.hack(target);
	}
}