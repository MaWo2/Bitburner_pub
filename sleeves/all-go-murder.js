/**
 * Intention:
 * - switch all sleeves to Homicide to decrease karma to -54k
 * - switch back to hacking tasks afterwards.
 */
/** @param {NS} ns */
export async function main(ns) {
	var targetKarma = ns.args[0] || -54000;

	var slvCount = ns.sleeve.getNumSleeves();
	for (let i = 0; i < slvCount; i++) {
		ns.sleeve.setToCommitCrime(i, "Homicide");
	}

	while (ns.heart.break() > targetKarma) {
		await ns.sleep(10000);
	}

	ns.tprint("Karma threshold reached. Karma is now: ", ns.heart.break());
	ns.tprint("Setting sleeves back to faction work in 20 sec.");
	//set back to faction work
	//ns.exec("/sleeves/sleeve-starter.js", "home", 1, "nocrime");
	ns.spawn("/sleeves/sleeve-starter.js", 1, "nocrime");

}
