/**
 * Intention:
 * - Make all sleeves study computer science
 */
/** @param {NS} ns */
export async function main(ns) {
	var slvCount = ns.sleeve.getNumSleeves();
	for (let i = 0; i < slvCount; i++) {
		ns.sleeve.setToUniversityCourse(i, "Rothman University", "Study Computer Science");
	}
}
