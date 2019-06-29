const Bleno = require('bleno');
const { spawn } = require('child_process');
const Session = require('./session');

class CommandCharacteristic extends Bleno.Characteristic {
	constructor(options) {
		super(options);

	}

	onSubscribe(maxValueSize, updateValueCallback) {
		console.log("[+] Central subscribed.");
		console.log("[+] Central's max value size is: " + maxValueSize);
		this.updateValueCallback = updateValueCallback;
		this.session = new Session();
	}
	
	onUnsubscribe() {
		console.log("[+] Unsubscribed.");
	}

	onWriteRequest(data, offset, withoutResponse, callback) {
		console.log("[+] Received request to execute command.");
		const query = data.toString();
		if (offset) {
			console.log("[+] Offset is set.");
			console.log("[+] Terminating application.");
			process.exit();
		}

		let command = spawn(query, {
			shell: true,
			stdio: 'pipe'
		});

		command.stdout.on('data', (output) => {
			console.log('[+] Command output: ' + output);
			this.updateValueCallback(Buffer.from(output));
		});

		callback(this.RESULT_SUCCESS);
	};

}

module.exports = CommandCharacteristic;
