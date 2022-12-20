/** @param {NS} ns */
/**
 * Intention:
 * - use singularity functions to connect to a server
 */
export async function main(ns) {
	var serverToConnectTo = ns.args[0]; // server we are looking for
	var childList; // list of servers, the current server is connected to
	var parentServer; // first item of childList is the parent server
	var pathList = []; // list of servers, that lead the path to the target

	pathList[0] = serverToConnectTo;

	//scan from target server
	childList = ns.scan(serverToConnectTo);
	parentServer = childList[0];
	pathList.unshift(parentServer);

	//if parent is not already "home", iterate until home is found
	while (parentServer != "home") {
		childList = ns.scan(parentServer);
		parentServer = childList[0];
		pathList.unshift(parentServer);
	}

	//use singularity functions to connect to the server
	for (let i = 0; i < pathList.length; i++) {
		ns.singularity.connect(pathList[i]);
	}
	
	
}

// enable autocomplete of server names, also found in steamcommunity-link
export function autocomplete(data, args) {
	return [...data.servers]; // This script autocompletes the list of servers.
}
