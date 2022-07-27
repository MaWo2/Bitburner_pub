/** @param {NS} ns */
/**
 * Intention:
 * - Test if scan can be run from any host --> yes
 * - is the "parent"-server always the first in the list? --> yes
 * - tprint the connection path to be copied to the terminal
 *   - According to this: https://steamcommunity.com/app/1812820/discussions/0/3200369647705810506/?ctp=2
 *   - navigator.clipboard.writeText(commandString); --> puts commandString into clipboard
 */
export async function main(ns) {
	var serverToConnectTo = ns.args[0]; // server we are looking for
	var childList; // list of servers, the current server is connected to
	var parentServer; // first item of childList is the parent server
	var pathList = []; // list of servers, that lead the path to the target
	var commandString; // string of commands to connect to the target

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

	//generate the string to use as a command
	commandString = "home; "
	for (let i = 1; i < pathList.length; i++) {
		commandString = commandString + "connect " + pathList[i] + "; "
	}

	//ns.tprint(commandString);
	navigator.clipboard.writeText(commandString);
	ns.tprint("INFO: Script finished. The command was copied to the clipboard. Press CRTL+V to input.");
}

// enable autocomplete of server names, also found in steamcommunity-link
export function autocomplete(data, args) {
	return [...data.servers]; // This script autocompletes the list of servers.
}