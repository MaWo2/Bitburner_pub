/**
 * Intention:
 * - recruit new gang members (until 12)
 * - train them to hacking 80
 * - ascend
 * - train again to hacking 110
 * - set to ethical hacking --> gang manager script ignores members in training
 */
/** @param {NS} ns */
export async function main(ns) {
	var memberNames = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L"];

	//get current count of members
	var memberCount = ns.gang.getMemberNames().length;
	//figure out, how many members are already fully trained and working something else
	var fullMembers = 0;
	for (let i = 0; i < memberCount; i++) {
		if (ns.gang.getMemberInformation(memberNames[i]).task != "Train Hacking") {
			fullMembers++;
		}
	}

	//recruit until 12 members
	var recruitLimit = 12;
	//DEV: get current time
	var startTime = new Date();
	var currentTime = new Date();
	var elapsedTime = currentTime - startTime;
	while (fullMembers < recruitLimit) {
		//check, if we can recruit someone; do so, if possible
		if (ns.gang.canRecruitMember()) {
			ns.gang.recruitMember(memberNames[memberCount]);
			//set to training
			ns.gang.setMemberTask(memberNames[memberCount], "Train Hacking");
			currentTime = new Date();
			elapsedTime = currentTime - startTime;
			ns.tprint("Member recruited after ", ns.tFormat(elapsedTime));
		}
		//update count of all members
		memberCount = ns.gang.getMemberNames().length;

		//check for members in training
		//members not in training are skipped
		//members in training with hacking level < 80 are skipped
		for (let i = 0; i < memberCount; i++) {
			var currentMember = ns.gang.getMemberInformation(memberNames[i])
			if (currentMember.task == "Train Hacking") {
				//check hacking level
				if (currentMember.hack <= 110) {
					//check, if member is above hacking level 80 AND member has not been ascended yet
					if ((currentMember.hack >= 80) && (currentMember.hack_asc_mult == 1)) {
						ns.gang.ascendMember(memberNames[i]);
					}
				} else {
					//member was ascended and fully trained
					ns.gang.setMemberTask(memberNames[i], "Ethical Hacking");
					//update full member count
					fullMembers++;
					//ascend all other members
					for (let i = 0; i < (memberCount - 1); i++)	{
						ns.gang.ascendMember(memberNames[i]);
					}
					//assign DDoS-tasks
					//2x EH if more than 5 members
					var eHackMembers = 1;
					if (memberCount >= 6) {
						eHackMembers = 2;
					}
					for (let i = 0; i < (memberCount - eHackMembers); i++) {
						ns.gang.setMemberTask(memberNames[i], "DDoS Attacks");
					}
				}
			}
		}

	await ns.sleep(1000); //safety catch to prevent game freezing
	}

	//after all members have been recruited, lower wanted to 1
	for (let i = 0; i < memberCount; i++) {
		ns.gang.setMemberTask(memberNames[i], "Ethical Hacking");
	}
	//wait until gang's wanted level has reached 1
	while (ns.gang.getGangInformation().wantedLevel > 1) {
		await ns.sleep(5000);
	}
	/**
	//set to work; last one keeps hacking
	for (let i = 0; i < (memberCount - 1); i++) {
		ns.gang.setMemberTask(memberNames[i], "Phishing");
	}
	*/
	//set to work:
	//Combination 1: 7x Money Laundering, 5x Ethical Hacking
	//Combination 2: 6x Money Laundering, 1x Cyberterrorism, 5x Ethical Hacking
	//--> more Respect gain --> more faction reputation gain
	for (let i = 0; i < 6; i++) {
		ns.gang.setMemberTask(memberNames[i], "Money Laundering");
	}
	ns.gang.setMemberTask(memberNames[6], "Cyberterrorism");

	//future plan: --> hand over to script that ascends members and optimises money laundering vs. EH
	ns.exec("/gangs/gang-ascender.js", "home", 1);

}
