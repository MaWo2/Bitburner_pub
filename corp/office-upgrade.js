/**
 * Intention:
 * - upgrade office of a certain devision in a certain city
 * - hire new employees
 * - assign to jobs
 */
/** @param {NS} ns */
export async function main(ns) {
	//currently hardcoded
	var divName = "Tobac";
	// "Aevum", "Chongqing", "Sector-12", "New Tokyo", "Ishima", "Volhaven"
	var cityName = "Volhaven";
	var upgradeSize = 108;
	//upgrade Size of office
	ns.corporation.upgradeOfficeSize(divName, cityName, upgradeSize);
	//hire new employees
	var emplName = [];
	for (let i = 0; i < upgradeSize; i++) {
		emplName.push(ns.corporation.hireEmployee(divName, cityName).name);
	}
	//assign employee to job
	//stating the same job name several times provides weighting
	var jobName = [];
	if (cityName == "Aevum") {
		jobName = ["Operations", "Engineer", "Business", "Management", "Research & Development"];
	} else {
		jobName = ["Operations", "Engineer", "Operations", "Engineer", "Business", "Management", "Research & Development", "Management", "Research & Development"];
	}
	for (let i = 0; i < emplName.length; i++) {
		var jIndex = i % jobName.length; //modulo
		ns.corporation.assignJob(divName, cityName, emplName[i], jobName[jIndex]);
	}	
}
