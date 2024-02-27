"use strict";

/**
 * Based on parts extracted from vacuum.js of iobroker-community-adapters/ioBroker.mihome-vacuum .
 */

class VacuumCustom {
	constructor(adapterInstance, Miio) {
		this.Miio = Miio;
		this.adapter = adapterInstance;
	}

	async getMapPointer() {
		for (let index = 0; index < 5; index++) {
			let answer = await this.Miio.sendMessage("get_map_v1");
			if (answer.result) {
				answer = answer.result[0];

				if (answer.split("%").length === 1) {
					if (answer.startsWith("map_slot")) {
						return;
					}
				} else if (answer.split("%").length === 3) {
					this.adapter.log.debug("got Mappointer");
					return answer;
				}
			}
			// robo need some time to generate mappointer if he wants a "retry"
			await this.delay(300);
		}
		throw new Error("Failed to get map pointer");
	}

	async delay(time) {
		return new Promise((resolve) => setTimeout(resolve, time));
	}
}

module.exports = VacuumCustom;
