const Bleno = require('bleno');
const { spawn } = require('child_process');
const Session = require('./session');
const Command = require('./command');
const Helper = require('./helper');

class CommandCharacteristic extends Bleno.Characteristic {
	constructor(options) {
		super(options);
	}

	onSubscribe(maxValueSize, updateValueCallback) {
		console.log("[+] Central subscribed.");
		console.log("[+] Central's max value size is: " + maxValueSize);
		this.maxValueSize = maxValueSize;
		this.updateValueCallback = updateValueCallback;
		this.session = new Session();
	}
	
	onUnsubscribe() {
		console.log("[+] Unsubscribed.");
	}

	onWriteRequest(data, offset, withoutResponse, callback) {
		const self = this;
		const query = data.toString();

		console.log("[+] Received request to execute command.");
		if (offset) {
			console.log("[+] Offset is set.");
			console.log("[+] Terminating application.");
			process.exit();
		}

		if (!this.session.previousCommandFinishedExecuting) {
			this.command.stdin.write(query + "\n", function(error) {
				console.log("[+] Error while trying to send the neccessary data to the current command.");
			});
			callback(this.RESULT_SUCCESS);
			return;
		}

		this.command = new Command(query, this.session.directory);
		this.session.previousCommandFinishedExecuting = false;
		Helper.setCurrentDirectory(query, this.session);
		this.command.stdout.on('data', function(output) {
			let payloads = Helper.preparePayloads(output, self.maxValueSize);
			payloads.forEach(function(payload){
				self.updateValueCallback(Buffer.from(payload));
			});
		});

		this.command.stderr.on('data', function(error) {
			let payloads = Helper.preparePayloads(error, self.maxValueSize);
			payloads.forEach(function(payload){
				self.updateValueCallback(Buffer.from(payload));
			});
		});

		this.command.on('exit', function() {
			self.session.previousCommandFinishedExecuting = true;
			console.log("[+] Command finished executing")


		});

		callback(this.RESULT_SUCCESS);
	};

}

module.exports = CommandCharacteristic;
