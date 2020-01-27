const { spawn } = require('child_process');
const Command = require('./command');

class Helper {
	constructor() {
		this.BlenoState = {
			StateChange: 'stateChange',
			PoweredOn: 'poweredOn',
			PoweredOff: 'poweredOff'
		};

		Object.freeze(this.BlenoState);
	}

	static preparePayloads(data, maxLength) {
		data = data.toString();
		let payloads = [];
		const numberOfPayloads = Math.ceil(data.length / maxLength);
		for (let i = 0; i < numberOfPayloads; i++) {
			let payload = data.substring(i * maxLength, maxLength + i * maxLength); 
			payloads.push(payload);
		}
		return payloads;
	}

	static setCurrentDirectory(query, session) {
		console.log("Setting new current directory....");
		let requestToChangeDir = query.startsWith("cd ")
					|| query.includes("&& cd ")
					|| query.includes("|| cd ");

		console.log("Request to change dir, true or false: " + requestToChangeDir);

		if (requestToChangeDir) {
			let directoryQuery = query;
			let directoryQueryArray = directoryQuery.toString().split(" ");
			let directoryIndex = directoryQueryArray.lastIndexOf("cd") + 1;
			let newDirectory = directoryQueryArray[directoryIndex].toString().replace(/(\r\n|\n|\r)/gm, "");
			directoryQuery = "cd " + newDirectory + " && pwd";

			const changeDirCommand = new Command(directoryQuery, session.directory);

			changeDirCommand.stdout.on('data', function(newDirectory) {
				session.directory = newDirectory.toString().replace(/(\r\n|\n|\r)/gm, "");
				console.log("[+] Directory changed to: " + session.directory);
			});

			changeDirCommand.stderr.on('error', function(error) {
				console.log("[+] Failed to set the current directory. Response: " + error.toString());
			});
		} 
	}
}

module.exports = Helper;
