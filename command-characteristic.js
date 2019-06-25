const Bleno = require('bleno');
const { spawn } = require('child_process');
const Session = require('./session');

class CommandCharacteristic extends Bleno.Characteristic {
	constructor(options) {
		super(options);

		this.onReadRequest = function(offset, callback){}; 
		this.onWriteRequest = function(data, offset, withoutResponse, callback){
			console.log("[+] Request to execute command just received.");
			const command = data.toString();
			if (offset) {
				console.log("[+] Offset is set.");
				console.log("[+] Terminating application.");
				process.exit();
			}
			callback(this.RESULT_SUCCESS);
		};
		this.onSubscribe =  function(maxValueSize, updateValueCallback) {
			console.log("[+] Central subscribed.");
			this.updateValueCallback = updateValueCallback;
			this.session = new Session();
		};
		this.onUnsubscribe = function() {};
	}
}

module.exports = CommandCharacteristic;
