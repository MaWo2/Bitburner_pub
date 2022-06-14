/**
 * This script should produce a list of all available servers.
 * The list should not include home or player-owned servers.
 * 
 * This is a conversion to a function to be called from another script
 */

/**@param {NS} ns */
export function scanner (ns, startServer) {
	var worldList = []; // list of all servers found, initialised as empty array
	var playerServerList; // list of servers owned by player
	var currentList; // list of servers scanned from currently recursed server

	// start list by scan from home, this can contain player-owned servers
	//currentList = ns.scan("home"); //0.2 GB RAM 
	currentList = ns.scan(startServer); //0.2 GB RAM 
	
	// find list of player servers
	playerServerList = ns.getPurchasedServers(); // this call needs >2GB of RAM; might be more efficient to just provide the values
	//playerServerList = ["n00dles", "foodnstuff"]; // for testing purposes
	
	// add all servers not owned by player to worldList
	for (let i = 0; i < currentList.length; i++) {
		if (! playerServerList.includes(currentList[i])) {
			worldList.push(currentList[i]);
		}
	}

	
	// Recurse through servers in list and scan from there
	for (let i = 0; i < worldList.length; i++) {
		currentList = ns.scan(worldList[i]); // no extra RAM cost
		// Loop through result list and add any unknown servers to worldList
		for (let j = 0; j < currentList.length; j++) {
			if (currentList[j] != "home") { // make sure it is not "home"
				if (! worldList.includes(currentList[j])) { //make sure, server is not alread in list
					worldList.push(currentList[j]);
				}
				
			}
		}
	}
	
	//ns.tprint(worldList);
	return worldList;

}
