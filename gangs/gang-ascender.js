/**
 * Intention
 * - ascend members, once their hacking mutlipliers reach 2-3x the previous value
 * - balance money laundering with ethical hacking
 */
/** @param {NS} ns */
export async function main(ns) {
	const memberNames = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L"];
	const ascThreshold = 2;
	const wantedGainThreshold = 0.2;
	var ascInThisLoop = false;

	/**
	//debug
	var currMemberStat = ns.gang.getMemberInformation("A");
	ns.tprint(currMemberStat.hack_asc_mult);
	var testAsc = ns.gang.getAscensionResult("A");
  	ns.tprint(testAsc.hack);
	var currGangWantedLevel = ns.gang.getGangInformation().wantedLevel;
	ns.tprint(currGangWantedLevel);
	*/

	
	//loop forever or loop until a certain ascension level was reached
	while (true) {
		//check, if wanted level is at 1
		//might be increased after ascensions
		if (ns.gang.getGangInformation().wantedLevel > 1) {
			await ns.sleep(1000);
			continue; //restart loop
		}
		//check for each member, whether it can be ascended, or not
		for (let member in memberNames) {
			//check, if gang member is ascendable
			try {
				ns.gang.getAscensionResult(memberNames[member]).hack
			} catch {
				continue;
			}
			if (ns.gang.getAscensionResult(memberNames[member]).hack >= ascThreshold) {
				ns.gang.ascendMember(memberNames[member]);
				ascInThisLoop = true;
				//continue;
			}
		}

		//if members were ascended, wait for 60 sec before doing something new
		//maybe better, wait until wanted level has reached 1 again
		//could be put to the beginning of the while loop
		if (ascInThisLoop == true) {
			//await ns.sleep(60000);
			ascInThisLoop = false;
			continue; //restart loop and let initial test for wanted level handle the recovery
		}



		//check, if members can be reassigned
		//gang work starts out with 6x Money Laundering, 1x Cyberterrorism, 5x Ethical Hacking
		//--> members 7-11 can be reassigned; 12 needs to stay EH
		//idea: make Cyberterror to MoneyLaundering, EH to Cyberterror 
		//calculate wanted-level-gain of all members, but two members get changed task

		//collect all tasks
		var taskArray = [];
		for (let member in memberNames) {
			taskArray.push(ns.gang.getMemberInformation(memberNames[member]).task);
		}
		//debug
		//ns.tprint(taskArray);

		//find index of Cyberterrorist
		var terrorIndex = taskArray.findIndex(findTerror);
		//break out of loop, if Cyberterrorist is already second to last
		if (terrorIndex == 10) {
			continue;
		}
		
		var myGang = ns.gang.getGangInformation();
		//var currentWantedLevelGain = myGang.wantedLevelGainRate;
		var newWantedLevelGain = 0;
		var newTaskArray = taskArray;

		//test assigning new tasks
		newTaskArray[terrorIndex] = "Money Laundering";
		newTaskArray[terrorIndex+1] = "Cyberterrorism";

		//debug
		//ns.tprint(newTaskArray);

		for (let member in memberNames) {
			var currentMember = ns.gang.getMemberInformation(memberNames[member]);
			newWantedLevelGain += calculateWantedLevelGain(myGang, currentMember, ns.gang.getTaskStats(newTaskArray[member])) * 5;
		}

		//if new wanted level gain is low enough, switch tasks
		if (newWantedLevelGain <= wantedGainThreshold) {
			for (let member in memberNames) {
				ns.gang.setMemberTask(memberNames[member], newTaskArray[member]);
			}
		}

		

		await ns.sleep(1000); //safety catch
	}
	

}

function findTerror(task) {
	return (task == "Cyberterrorism");
}

function calculateWantedLevelGain(gang, member, task) {
  if (task.baseWanted === 0) return 0;
  let statWeight =
    (task.hackWeight / 100) * member.hack +
    (task.strWeight / 100) * member.str +
    (task.defWeight / 100) * member.def +
    (task.dexWeight / 100) * member.dex +
    (task.agiWeight / 100) * member.agi +
    (task.chaWeight / 100) * member.cha;
  statWeight -= 3.5 * task.difficulty;
  if (statWeight <= 0) return 0;
  const territoryMult = Math.max(0.005, Math.pow(gang.territory * 100, task.territory.wanted) / 100);
  if (isNaN(territoryMult) || territoryMult <= 0) return 0;
  if (task.baseWanted < 0) {
    return 0.4 * task.baseWanted * statWeight * territoryMult;
  }
  const calc = (7 * task.baseWanted) / Math.pow(3 * statWeight * territoryMult, 0.8);

  // Put an arbitrary cap on this to prevent wanted level from rising too fast if the
  // denominator is very small. Might want to rethink formula later
  return Math.min(100, calc);
}
