/**
 * Intention: Always develop new products in a working corporation
 */

/** @param {NS} ns */
export async function main(ns) {
	while (true) {
		var corpName = "Moses";
		var divName = "Tobac";
		//get product names
		var prodNames = ns.corporation.getDivision("Tobac").products;

		//collect product ratings
		//it would be better to use the actual selling price of a product
		//however, this value is not exposed
		var prodRatings = [];
		for (let i = 0; i < prodNames.length; i++) {
			prodRatings.push(ns.corporation.getProduct(divName, prodNames[i]).rat);
		}

		//discontinue least rated product
		var leastRatedProd = prodRatings.indexOf(Math.min(...prodRatings));
		ns.corporation.discontinueProduct(divName, prodNames[leastRatedProd]);

		//create new product
		//get new name
		var lastIndex = prodNames.length - 1;
		var lastName = prodNames[lastIndex];
		var newNumber = parseInt(lastName.slice(1)) + 1;
		var newName = "v" + newNumber;
		//ns.tprint(newName);
		ns.corporation.makeProduct(divName, "Aevum", newName, 1000000000, 1000000000);

		//wait some time
		//hireAvert, if possible
		await ns.sleep(4000);
		if (ns.corporation.getCorporation().funds >= ns.corporation.getHireAdVertCost(divName)) {
			ns.corporation.hireAdVert(divName);
		}

		//set selling values
		ns.corporation.sellProduct(divName, "Aevum", newName, "MAX", "MP", true);
		ns.corporation.setProductMarketTA2(divName, newName, true);

		//wait until product was developed
		var progress = ns.corporation.getProduct(divName, newName).developmentProgress;
		while (progress < 100) {
			await ns.sleep(5000);
			progress = ns.corporation.getProduct(divName, newName).developmentProgress;
		}
		//wait for the product to receive a rating
		await ns.sleep(30000);
	}
}
