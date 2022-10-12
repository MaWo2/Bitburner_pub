/**
 * Intention:
 * - to be called from the starter-script to produce three inital products for basic income
 */
/** @param {NS} ns */
export async function main(ns) {
	var corpName = ns.args[0];
	var divName = ns.args[1];
	var city = ns.args[2];
	var baseName = ns.args[3];
	// get the list of products
	var prods = ns.corporation.getDivision(divName).products;
	// check if there are any products and if they are under development
	var prodsUnderDev = [];
	if (prods.length > 0) {
		// check those products
		for (let prod of prods) {
			if (ns.corporation.getProduct(divName, prod).developmentProgress != 100) {
				prodsUnderDev.push(prod);
			} else {
				// set price
				ns.corporation.sellProduct(divName, city, prod, "MAX", "MP", true);
			}
		}
	}
	// wait for products under dev to be finished and set their selling price
	for (let prod of prodsUnderDev) {
		// wait for dev to be finished
		while (ns.corporation.getProduct(divName, prod).developmentProgress < 100) {
			await ns.sleep(5000);
		}
		// set price
		ns.corporation.sellProduct(divName, city, prod, "MAX", "MP", true);
	}

	// develop missing products
	var newName;
	for (let i = prods.length; i < 3; i++) {
		newName = baseName + (i + 1);
		// wait for enough funds to be available
		while (ns.corporation.getCorporation().funds < 2500000000) {
			await ns.sleep(10000);
		}
		ns.corporation.makeProduct(divName, city, newName, 1000000000, 1000000000);
		// buy advert, if enough funds
		await ns.sleep(30000);
		if (ns.corporation.getCorporation().funds >= ns.corporation.getHireAdVertCost(divName)) {
			ns.corporation.hireAdVert(divName);
		}
		// wait for dev to be finished
		while (ns.corporation.getProduct(divName, newName).developmentProgress < 100) {
			await ns.sleep(5000);
		}
		// set price
		ns.corporation.sellProduct(divName, city, newName, "MAX", "MP", true);
	}

}
