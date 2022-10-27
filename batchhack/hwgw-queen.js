// HWGW queen gets frequently out of sync, even though no change in hacking level occurs
// Trying to improve the script, at least trying to clean it up
// Copy of version 4 script with several changes:
// - General offset = 0
// - batches timed to start during Hacktime not Weakentime
// - waiting until each set of batches has finished, before starting a new one.
// - batchcounter starts with =1 not =0
// Copy of version 5 with changes
// - Trying to dispatch the bath without waiting times (prepare for dispatch on other server)
// - batchcounter back to 0, but checking for < max batches -1
// Cleaned-up version 6
// Formerly named 6a_DEV

/**
 * Script to perform HWGW hacking on a specified target
 * Would normally require Formulas.exe for certain calculations. Might be overcome by drop-in replacement or using own functions.
 * In this version, I will try to work without the formulas.
 * 
 * Parameters for the script
 * 	- args[0] --> server to attack
 * 	- args[1] --> portion to be hacked from the server (e.g. 50 = 50% of max money)
 *  - args[2] --> server that hosts the attacking workers --> not yet implemented
 */

/** @param {NS} ns */
export async function main(ns) {
	const target = ns.args[0]; // server to be hacked
	const attackHost = ns.getHostname(); // server that performs the HWGW attack
	const queenScript = ns.getScriptName();
	const hackScript = "/batchhack/b-hack.js";
	const growScript = "/batchhack/b-grow.js";
	const weakenScript = "/batchhack/b-weaken.js";

	var hackPortion; // Not sure, if we want this; Could be used later to prepare for less powerful getServerSecurityLevel

	//check if all parameters where provided
	switch (ns.args.length) {
		case 0:
			ns.tprint("ERROR: No target to hack defined!");
			break;
		case 1:
			ns.tprint("WARNING: Portion of hacked money not provided. Assuming 10%.");
			hackPortion = 0.1;
			break;
		default:
			hackPortion = ns.args[1] / 100;
			// it might be necessary to check if the value is larger than 100, to prevent hacking to 0 (grow will take very long then)
			ns.tprint(`Will attack ${target}, trying to steal ${hackPortion * 100}% per cycle.`);
	}

	//get host stats; most values are constant
	const maxHostRAM = ns.getServerMaxRam(attackHost); //0.1 GB RAM
	const queenRAM = ns.getScriptRam(queenScript); //0.1 GB
	const hackRAM = ns.getScriptRam(hackScript);
	const growRAM = ns.getScriptRam(growScript);
	const weakenRAM = ns.getScriptRam(weakenScript);
	//var availHostRAM = maxHostRAM - queenRAM; // available RAM on host, while queen is running --> outdated, because other scripts might be running
	var availHostRAM = maxHostRAM - ns.getServerUsedRam(attackHost);

	//get target stats
	var targetMaxMoney = ns.getServerMaxMoney(target); //0.1 GB
	var targetCurrMoney = ns.getServerMoneyAvailable(target); //0.1
	var targetCurrSec = ns.getServerSecurityLevel(target); //0.1
	var targetMinSec = ns.getServerMinSecurityLevel(target); //0.1
	var targetGrowBackFactor; //factor that is necessary to grow the money back to max
	var targetHackSecIncr; //security increase through hack --> usually 0.002
	var targetGrowSecIncr; //security increase through grow --> usually 0.004
	var targetWeakenSecDec; //security decrease through weaken --> usually 0.05
	var targetHackTime = ns.getHackTime(target); //0.05 GB
	var targetGrowTime = ns.getGrowTime(target); //0.05 GB
	var targetWeakenTime = ns.getWeakenTime(target); //0.05 GB;

	//get player stats --> not yet; necessary for formulas.exe

	//variables for the batching
	var hackThreads;
	var growThreads;
	var weakenThreads; //Total; for preparation
	var weakenThreadsG; //Only counter grow
	var weakenThreadsH; //Only counter hack
	var maxThreads;
	var neededThreads;

	//stop self-hacking scripts on target server
	ns.scriptKill("/simplehack/simplehack-self.js", target);

	//prepare target
	//Currently, I weaken to minimum first and then grow.
	//Assuming, this script runs on a server with enough recourses, it could just start with growing, although Sec is not min.
	//This would require more grow threads than necessary, but reduce the time.
	//However, this would probably require more than 16 TB RAM on higher servers.
	//1: weaken to minimum
	//targetWeakenSecDec = ns.weakenAnalyze(1, 1); //1 GB RAM
	targetWeakenSecDec = 0.05;
	if (targetCurrSec > targetMinSec) {
		weakenThreads = Math.ceil((targetCurrSec - targetMinSec) / 0.05);
		//dispatch weaken workers
		ns.exec(weakenScript, attackHost, weakenThreads, 0, target); //1.3GB RAM
		await ns.sleep(targetWeakenTime + 1000);
	}
	//2: grow money to maximum, but keep security at minimum
	//Catch error: If too many threads are necessary, split into more than one run.
	targetCurrMoney = ns.getServerMoneyAvailable(target);
	while (targetCurrMoney < targetMaxMoney) {
		targetGrowBackFactor = Math.ceil(targetMaxMoney / targetCurrMoney);
		//asume weaken always takes longer than grow
		targetGrowTime = ns.getGrowTime(target); //could have changed already
		targetWeakenTime = ns.getWeakenTime(target); //could have changed already
		growThreads = Math.ceil(ns.growthAnalyze(target, targetGrowBackFactor)); //1GB RAM
		targetGrowSecIncr = ns.growthAnalyzeSecurity(growThreads, target, 1); //1GB RAM
		weakenThreads = Math.ceil(targetGrowSecIncr / targetWeakenSecDec);
		//check if enough RAM is available for preparation, if not --> use max RAM
		neededThreads = growThreads + weakenThreads;
		maxThreads = Math.floor(availHostRAM / growRAM);
		if (neededThreads <= maxThreads) {
			//dispatch grow and weaken workers as calculated
			ns.exec(growScript, attackHost, growThreads, 0, target);
			ns.exec(weakenScript, attackHost, weakenThreads, 0, target);
			await ns.sleep(targetWeakenTime + 1000);
			targetCurrMoney = ns.getServerMoneyAvailable(target);
		} else {
			//dispatch grow and weaken workers at max
			maxThreads = Math.floor(availHostRAM / growRAM); //9358 on 16 TB server
			growThreads = Math.floor(maxThreads / (1 + (ns.growthAnalyzeSecurity(1, target, 1) / targetWeakenSecDec)));
			weakenThreads = Math.ceil(growThreads * (ns.growthAnalyzeSecurity(1, target, 1) / targetWeakenSecDec));
			ns.exec(growScript, attackHost, growThreads, 0, target);
			ns.exec(weakenScript, attackHost, weakenThreads, 0, target);
			await ns.sleep(targetWeakenTime + 1000);
			targetCurrMoney = ns.getServerMoneyAvailable(target);
		}
	}

	//Dispatch batches
	var loopCounter = 0;
	var totalBatchRAM;
	var maxBatchCount;
	var batchOffsetTime;
	var scriptOffsetTime;
	var w1Sleep;
	var w2Sleep;
	var gSleep;
	var hSleep;
	var batchCounter = 0;
	var individualOffset;


	//While in the loop, every once in a while this was calculated, while server sec is not at min.
	//--> too many hacking threads are calculated/dispatched, but not matched by later grow
	//assume: Only time changes, but not the other parameters
	//Other parameters don't change until player augments or server is upgraded.
	//Both actions actually require a restart of the script.
	targetGrowBackFactor = 1 / (1 - hackPortion); //--> this could be improved to match the actual hack. But therefore I need the current value. Other option: Make sure to only hack to 50% total (not 50% of current value). If negative count --> 0;
	hackThreads = Math.floor(ns.hackAnalyzeThreads(target, targetMaxMoney * hackPortion)); //1GB RAM //Math.floor --> rather hack a little less, than not being able to properly grow back
	targetHackSecIncr = hackThreads * 0.002;
	growThreads = Math.ceil(ns.growthAnalyze(target, targetGrowBackFactor)) * 1.0;
	//targetGrowSecIncr = ns.growthAnalyzeSecurity(growThreads, target, 1);
	targetGrowSecIncr = growThreads * 0.004
	weakenThreadsH = Math.ceil(targetHackSecIncr / targetWeakenSecDec) * 1.0;
	weakenThreadsG = Math.ceil(targetGrowSecIncr / targetWeakenSecDec) * 1.0;
	totalBatchRAM = (hackThreads * hackRAM) + (growThreads * growRAM) + ((weakenThreadsH + weakenThreadsG) * weakenRAM);
	maxBatchCount = Math.floor(availHostRAM / totalBatchRAM); // only used half of the available RAM so far

	//update values
	availHostRAM = maxHostRAM - ns.getServerUsedRam(attackHost);
	targetWeakenTime = ns.getWeakenTime(target); //could have changed already
	targetGrowTime = ns.getGrowTime(target); //could have changed already
	targetHackTime = ns.getHackTime(target); //could have changed already


	while (true) {

		//update values
		availHostRAM = maxHostRAM - ns.getServerUsedRam(attackHost);
		targetWeakenTime = ns.getWeakenTime(target); //could have changed already
		targetGrowTime = ns.getGrowTime(target); //could have changed already
		targetHackTime = ns.getHackTime(target); //could have changed already

		//order of finishing is H-W-G-W
		//order of dispatching or script-starting is W-W-G-H
		//time the scripts

		if (maxBatchCount == 1) {
			batchOffsetTime = 2000; // no need to wait much longer
		} else {
			batchOffsetTime = (targetHackTime / maxBatchCount); //dispatch batches over the time of 1 hack only (not 1 weaken) to make sure, they all start at optimum conditions
		}
		scriptOffsetTime = batchOffsetTime / 4
		w1Sleep = 0;
		w2Sleep = scriptOffsetTime;
		gSleep = targetWeakenTime - targetGrowTime + (scriptOffsetTime / 4);
		hSleep = targetWeakenTime - targetHackTime - (scriptOffsetTime / 2);

		//check if RAM is available to dispatch a batch or several batches
		if (availHostRAM > totalBatchRAM) {

			loopCounter++; //increment loop counter; used to "distinguish" the scripts from each other. Otherwise, game will not allow two scripts with the same parameters.
			individualOffset = batchCounter * batchOffsetTime;
			ns.exec(weakenScript, attackHost, weakenThreadsH, w1Sleep + individualOffset, target, loopCounter);
			ns.exec(weakenScript, attackHost, weakenThreadsG, w2Sleep + individualOffset, target, loopCounter);
			ns.exec(growScript, attackHost, growThreads, gSleep + individualOffset, target, loopCounter);
			//ns.exec(hackScript, attackHost, hackThreads, hSleep + individualOffset, target, loopCounter);
			
			if (batchCounter < maxBatchCount - 1) {
				//do not dispatch hack in last batch
				//trying to reduce out-of sync effects
				ns.exec(hackScript, attackHost, hackThreads, hSleep + individualOffset, target, loopCounter);
				batchCounter++;
			} else {
				await ns.sleep(targetWeakenTime + (batchOffsetTime * maxBatchCount) + 1000); // sleep until all scripts finished
				batchCounter = 0;
			}
		} else {
			await ns.sleep(1000);
		}
	}
}
