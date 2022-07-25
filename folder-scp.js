/** @param {NS} ns **/
export async function main(ns) {
	var folderName = ns.args[0];
	var targetServer = ns.args[1];
	await ns.scp(ns.ls('home', folderName), 'home', targetServer)
}