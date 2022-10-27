/**
* Script to
*  - generate/save a list of servers (no player servers)
*  - profile all servers and save their value to a CSV-file
*
* Requires function to recursively scan all servers.
*/

import * as worldScan from 'data-mining/func_world-scanner.js'
/** @param {NS} ns */
export async function main(ns) {
	var list;
	var serverListFile = "/ServersOfTheWorld.txt";
	var serverProfileFile = "/ServerProfiles.txt";
	list = worldScan.scanner(ns, "home"); // the ns-package has to be passed to the scanner function
	//ns.tprint(list);
	
	//write list to file
	//since BBv2 this does not work any longer, because the command expects a string, but receives an object
	//generate string first, then write to file
	//await ns.write(serverListFile, list, "w");
	// create empty file or overwrite existing one
	await ns.write(serverListFile, "", "w");
	var serverNames = "";
	for (let server in list) {
		serverNames += list[server] + ",";
	}
	//remove "," behind last name from string
	var outString = serverNames.substring(0, serverNames.length - 1);
	await ns.write(serverListFile, outString, "a" );


	//create empty profile file or overwrite existing file with ""
	await ns.write(serverProfileFile, "", "w");
	var serverProfileInfo;
	
	//write headlines to file
	//get headlines from server
	serverProfileInfo = ns.getServer("n00dles");
	//ns.tprint(serverProfileInfo);
	var headlines = ""; //generate emtpy string; if used w/o ...="" part, this generates an entry "undefined"
	for (let property in serverProfileInfo) {
		if (headlines == "") {
			headlines = property
		} else {
			headlines += "," + property;
		}
	}
	await ns.write(serverProfileFile, headlines, "a" );

	//write properties to file
	for (let i = 0; i < list.length; i++) {
	//for (let i = 0; i < 1; i++) {
		serverProfileInfo = ns.getServer(list[i]);
		var infoString = ""; //generate emtpy string; if used w/o ...="" part, this generates an entry "undefined"
		for (let property in serverProfileInfo) {
			if (infoString == "") {
				infoString = "\n" + serverProfileInfo[property];
			} else {
				infoString += "," + serverProfileInfo[property];
			}
		}
		
		//ns.tprint(infoString);
		await ns.write(serverProfileFile, infoString, "a" );
	}
}

//Some properties are missing: --> Hacking times and so on
