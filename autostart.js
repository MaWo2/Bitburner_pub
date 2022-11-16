/**
 * Intention:
 * - start things after an augmentation reset
 * 
 * Basic plan:
 * 1) set sleeves to study or work for faction
 * 2) set player to study (or faction work)
 * 3) buy hacknet server
 * 4) buy TOR-router (if possible)
 * 5) wait for hacking level 40
 * 6) run lazystarter
 * 
 * Prerequisites:
 * - SF4 (Singularity)
 */
/** @param {NS} ns */
export async function main(ns) {
	//delay, to make sure the game loaded properly
	await ns.sleep(2000);
	//check for faction invites
	var factionsAvailable = ns.singularity.checkFactionInvitations();
	//accept faction invitations, if there were any
	if (factionsAvailable.length > 0) {
		ns.toast("Accepting faction invitations.");
		for (faction in factionsAvailable) {
			ns.singularity.joinFaction(faction);
		}
	}
	//set sleeves to work
	ns.toast("Setting sleeves to work.");
	ns.exec("/sleeves/sleeve-starter.js", "home", 1);
	//set player to study at University
	//LATER: Check, if faction is available, that we can work for
	ns.toast("Studying...");
	ns.singularity.universityCourse("Rothman University", "Study Computer Science", true);
	//buy hacknet server
	//not available???
	//buy TOR browser
	//how to check for TOR price???
	if (ns.getServerMoneyAvailable("home") >= 200000) {
		ns.toast("Purchasing TOR browser.");
		ns.singularity.purchaseTor();
	}
	//wait until player hacking level reached 40
	ns.toast("Waiting for hacking level of 40.");
	while (ns.getHackingLevel() < 40) {
		await ns.sleep(1000);
	}
	//run lazystarter
	ns.toast("Done. Handing over to lazystarter.");
	ns.exec("lazystarter.js", "home", 1);
}
