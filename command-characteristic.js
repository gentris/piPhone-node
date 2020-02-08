const Bleno = require('bleno');
const { spawn } = require('child_process');
const Session = require('./session');
const Command = require('./command');
const Helper = require('./helper');
const pty = require('pty.js')

class CommandCharacteristic extends Bleno.Characteristic {
	constructor(options, session) {
		super(options);
		this.session = session;
	}

	initShell({cols, rows}) {
		const self = this;

		if (this.shell) {
			console.log("RESIZING: ", cols, " ", rows);
			this.shell.resize(cols, rows);
			return
		}

		this.shell = pty.spawn('/bin/bash', [], {
			name: 'xterm-color',
			cols: cols,
			rows: rows,
			cwd: process.env.HOME,
			env: process.env
		});

		this.shell.on('data', (data) => {
			self.lastData = data;
			this.writeToCentral(data);
			// let payloads = Helper.preparePayloads(data, self.maxValueSize);
			
			// console.log("Payloads: ", payloads);

			// payloads.forEach(function(payload){
			// 	self.updateValueCallback(Buffer.from(payload));
			// });
		});	
	}

	onSubscribe(maxValueSize, updateValueCallback) {
		console.log("[+] Central subscribed.");
		console.log("[+] Central's max value size is: " + maxValueSize);

		const self = this
		this.maxValueSize = maxValueSize;
		this.updateValueCallback = updateValueCallback;

		if (this.lastData) {
			this.writeToCentral(this.lastData);
		}


		// this.shell = pty.spawn('/bin/bash', [], {
		// 	name: 'xterm-color',
		// 	cols: 49, 
		// 	rows: 50,
		// 	// cols: self.session.cols, 
		// 	// rows: self.session.rows,
		// 	cwd: process.env.HOME,
		// 	env: process.env
		// });

		// this.shell.on('data', (data) => {
		// 	// console.log('data: ', data); console.log("**END**");
		// 	let payloads = Helper.preparePayloads(data, self.maxValueSize);
			
		// 	console.log("Payloads: ", payloads);

		// 	payloads.forEach(function(payload){
		// 		self.updateValueCallback(Buffer.from(payload));
		// 	});
		// });
	}
	
	onUnsubscribe() {
		console.log("[+] Unsubscribed.");
	}

	onWriteRequest(data, offset, withoutResponse, callback) {
		const query = data.toString();

		console.log("[+] Received request to execute command.");

		if (offset) {
			console.log("[+] Offset is set.");
			console.log("[+] Terminating application.");
			process.exit();
		}

		this.shell.write(query)

		callback(this.RESULT_SUCCESS);
	};

	writeToCentral(data) {
		const self = this;
		let payloads = Helper.preparePayloads(data, this.maxValueSize);

		console.log("Payloads: ", payloads);

		payloads.forEach(function(payload){
			self.updateValueCallback(Buffer.from(payload));
		});	
	}

}

module.exports = CommandCharacteristic;
