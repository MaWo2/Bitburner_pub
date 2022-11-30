/**
 * Intention:
 * - Create gang in NiteSec
 * - recruit first members and set to training
 * 
 * Strategy (~17 minutes in BN2.1):
 * - train new members until hacking level 80
 * - Ascend
 * - train until hacking level 110
 */
/** @param {NS} ns */
export async function main(ns) {
	
	var memberNames = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L"];

	//check if we have a gang, if not, create it
	if (!ns.gang.inGang()) {
		ns.gang.createGang("NiteSec");
	}

	//check, if we can recruit a member
	//as this is the starter script, we should be able to do so
	//newly created gangs can recruit 3 members
	var i = 0;
	//await ns.sleep(1000); //make sure, everything has time to initialise
	while (ns.gang.canRecruitMember()) {
		ns.gang.recruitMember(memberNames[i]);
		ns.gang.setMemberTask(memberNames[i], "Train Hacking");
		i++;
	}

	/**
	//debug
	var gangInfo = ns.gang.getGangInformation();
	ns.tprint(gangInfo);
	var canRecr = ns.gang.canRecruitMember();
	ns.tprint(canRecr);
	*/
	
	ns.exec("/gangs/gang-recruiter.js", "home", 1);

}
