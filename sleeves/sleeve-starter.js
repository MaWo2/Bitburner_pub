/**
 * Intention:
 * - start sleeve tasks at beginning of game
 * - try to assign sleeves to faction work or jobs, if available
 * 
 * Problem:
 * - there is no command to get the actual available tasks for a sleeve
 * - I try to get the factions from the player object, tasks are hardcoded
 */
/** @param {NS} ns */
export async function main(ns) {
	var plyrObj = ns.getPlayer();
	var pFactions = plyrObj.factions;
	var sFactions = [];
	var factionsAvailable = false;
	// check, if we have a gang
	var plyrGang = ns.gang.inGang();
	var gangName = "";
	if (plyrGang == true) {
		gangName = ns.gang.getGangInformation().faction;
		//remove gang faction from list, because sleeves cannot work for them
		//if we have a gang, we are also member of the faction (by default)
		//accordingly, we do not need to check for the factions here
		//problem: All solutions on the web suggest to convert the array to a list. However, this does not seem to be possible.
		//I'll just iterate over the factions and copy them to another array
		for (var faction in pFactions) {
			if (pFactions[faction] != gangName) {
				sFactions.push(pFactions[faction]);
			}
		}
	}



	//check, if factions are available
	if (sFactions.length > 0) {
		factionsAvailable = true;
	}



	//ns.tprint(sFactions);
	//ns.tprint(factionsAvailable);

	//create list of tasks
	//priorise hacking work, but make 2 sleeves commit "Mug" crime for stats
	var taskList = [];
	for (let i = 0; i < 6; i++) {
		if (i < 4) {
			//check if factions are available
			if (i < sFactions.length) {
				taskList.push("Faction");
			} else {
				taskList.push("University");
			}
		} else {
			taskList.push("Crime");
		}
	}
	//ns.tprint(taskList);

	for (let i = 0; i < taskList.length; i++) {
		switch (taskList[i]) {
			case "Faction":
				ns.sleeve.setToFactionWork(i, sFactions[i], "Hacking Contracts");
				break;
			case "Crime":
				ns.sleeve.setToCommitCrime(i, "Mug")
				break;
			default:
				ns.sleeve.setToUniversityCourse(i, "Rothman University", "Study Computer Science");
		}
	}
}
