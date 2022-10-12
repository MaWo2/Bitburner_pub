/**
 * Intention:
 * - buy a corporation
 * - increase funds
 * - do basic preparations
 * 
 * Prereq.:
 * - 200b money (needed to buy back shares)
 * - takes about 5 minutes, because of waiting times
 */
/** @param {NS} ns */
export async function main(ns) {
	var corpName = "AbZ";
	var divName = "Software";
	var cityNames = ["Sector-12", "Aevum"];


	// create the corporation
	ns.corporation.createCorporation(corpName, true);

	// get some more funding
	await ns.sleep(60000);
	ns.corporation.acceptInvestmentOffer();
	// get some more funding
	await ns.sleep(60000);
	ns.corporation.acceptInvestmentOffer();
	// wait for stock price to stabilise, then go public and sell all shares
	await ns.sleep(60000);
	ns.corporation.goPublic(550000000);
	// buy back shares immediately
	// --> could also wait some time to buy back, but not intended here
	// will probably cost about 30b
	ns.corporation.buyBackShares(550000000);

	//purchase upgrades
	ns.corporation.unlockUpgrade("Warehouse API"); // 50b
	ns.corporation.unlockUpgrade("Office API"); // 50b
	// build the corporation
	ns.corporation.expandIndustry("Software", divName); // 25b
	ns.corporation.expandCity(divName, cityNames[1]); // 4b
	ns.corporation.purchaseWarehouse(divName, cityNames[1]); // 5b

	// upgrade warehouses
	for (let city of cityNames) {
		ns.corporation.upgradeWarehouse(divName, city, 1);
	}
	// buy production multipliers, stop after one cycle
	// sync to cycle
	for (let city of cityNames) {
		while (ns.corporation.getCorporation().state != "START") {
			await ns.sleep(100);
		}
		ns.corporation.buyMaterial(divName, city, "Real Estate", 20);
		ns.corporation.buyMaterial(divName, city, "AI Cores", 30);
		ns.corporation.buyMaterial(divName, city, "Robots", 10);
		ns.corporation.buyMaterial(divName, city, "Hardware", 50);
		// wait a little bit to get desynced from start of cycle
		await ns.sleep(2500);
		// sync to cycle
		while (ns.corporation.getCorporation().state != "START") {
			await ns.sleep(100);
		}
		ns.corporation.buyMaterial(divName, city, "Real Estate", 0);
		ns.corporation.buyMaterial(divName, city, "AI Cores", 0);
		ns.corporation.buyMaterial(divName, city, "Robots", 0);
		ns.corporation.buyMaterial(divName, city, "Hardware", 0);
		// set selling price for AI-cores
		ns.corporation.sellMaterial(divName, city, "AI Cores", "PROD", "MP", true);

	}
	// desync from cycle
	await ns.sleep(15000);
	// setup smart supply
	ns.corporation.unlockUpgrade("Smart Supply"); // 25b
	for (let city of cityNames) {
		// activate Smart supply
		ns.corporation.setSmartSupply(divName, city, true);
		// prevent use of material, needed as prod. multiplier
		ns.corporation.setSmartSupplyUseLeftovers(divName, city, "Hardware", false);
	}
	// buy upgrades for employees
	for (let i = 1; i <= 4; i++) {
		ns.corporation.levelUpgrade("FocusWires");
		ns.corporation.levelUpgrade("Neural Accelerators");
		ns.corporation.levelUpgrade("Speech Processor Implants");
		ns.corporation.levelUpgrade("Nuoptimal Nootropic Injector Implants");
	}
	// upgrade office size
	ns.corporation.upgradeOfficeSize(divName, cityNames[0], 12);
	ns.corporation.upgradeOfficeSize(divName, cityNames[1], 6);
	// hire employees and set to work
	var emplName;
	var jobList = ["Operations", "Engineer", "Business", "Management", "Research & Development", "Operations", "Engineer", "Business", "Management", "Research & Development", "Operations", "Engineer", "Management", "Operations", "Engineer"];
	for (let i = 0; i < 15; i++) {
		emplName = ns.corporation.hireEmployee(divName, cityNames[0]).name;
		ns.corporation.assignJob(divName, cityNames[0], emplName, jobList[i]);
	}
	var jobList2 = ["Operations", "Engineer", "Business", "Management", "Research & Development", "Operations", "Engineer", "Management", "Research & Development"];
	for (let i = 0; i < 9; i++) {
		emplName = ns.corporation.hireEmployee(divName, cityNames[1]).name;
		ns.corporation.assignJob(divName, cityNames[1], emplName, jobList2[i]);
	}

	// spawn product generation script
	ns.spawn("/corp/corp-init-products.js", 1, corpName, divName, "Sector-12", "v");

}
