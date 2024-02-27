const fs = require("fs");
const readline = require("readline");
const Miio = require("./lib/miio");
const VacuumCustom = require("./lib/vacuum-custom");
const MapHelper = require("./lib/maphelper");

async function input(prompt) {
	const rl = readline.createInterface({
		input: process.stdin,
		output: process.stdout,
	});
	return new Promise((resolve) =>
		rl.question(prompt, (answer) => {
			rl.close();
			resolve(answer);
		}),
	);
}

const adapter_helper = {
	config: {
		email: "",
		password: "",
		server: "",
		ip: "",
		enableMiMap: true,
	},
	log: {
		info: function (msg) {
			console.log(msg);
		},
		error: function (msg) {
			console.log("ERROR: " + msg);
		},
		debug: function (msg) {
			process.env.debug && console.log("DEBUG: " + msg);
		},
		warn: function (msg) {
			console.log("WARN:  " + msg);
		},
	},
	msg: {
		info: [],
		error: [],
		debug: [],
		warn: [],
	},
	setConnection: () => {
		/* dummy */
	},
};

async function main() {
	const email = await input("Enter email: ");
	const password = await input("Enter password: ");
	const server = await input("Enter server (cn, de, i2, ru, sg, us): ");
	adapter_helper.config.email = email;
	adapter_helper.config.password = password;
	adapter_helper.config.server = server;

	const miApi = new MapHelper(undefined, adapter_helper);
	const devices = await miApi.getDeviceStatus(email, password, server);

	adapter_helper.log.info("------------------");
	adapter_helper.log.info("Found devices:");
	adapter_helper.log.info("------------------");
	for (let i = 0; i < devices.length; i++) {
		const dev = devices[i];
		adapter_helper.log.info(`${i + 1}. Name:     ${dev.name}`);
		adapter_helper.log.info(`   Model:    ${dev.model}`);
		adapter_helper.log.info(`   DID:      ${dev.did}`);
		adapter_helper.log.info(`   Token:    ${dev.token}`);
		adapter_helper.log.info(`   IP:       ${dev.localip}`);
		adapter_helper.log.info("------------------");
	}
	if (!devices.length) {
		adapter_helper.log.info("No devices found!");
		adapter_helper.log.info("------------------");
		process.exit(1);
	}
	let device = null;
	while (device === null) {
		const num = Number(await input("Enter device no: "));
		if (isNaN(num)) {
			adapter_helper.log.error("Entered value is not a number!");
		} else if (num > devices.length) {
			adapter_helper.log.error("Entered number is too big!");
		} else if (num < 1) {
			adapter_helper.log.error("Entered number is too low!");
		} else {
			device = devices[num - 1];
		}
	}

	adapter_helper.config.ip = device.localip;
	adapter_helper.config.token = device.token;

	const miio = new Miio(adapter_helper);
	const vac = new VacuumCustom(adapter_helper, miio);
	const mapPointer = await vac.getMapPointer();
	adapter_helper.log.info(`Got map pointer: ${mapPointer}`);
	miio.close();
	const mapData = await miApi.updateMap(mapPointer);

	const filename = await input("Enter output filename: ");
	fs.writeFileSync(filename, mapData);
}

main();
