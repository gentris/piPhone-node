const fs = require('fs');
const Bleno = require('bleno');
const SpasService = require('./spas-service');
const CommandCharacteristic = require('./command-characteristic');
const Helper = require('./helper');
const BlenoState = Helper.BlenoState;

console.log("[+] Application started.");
console.log("[+] Reading the coonfiguration file.");
fs.readFile('./config.json', (error, fileData) => {
	if (error) {
		console.log("[+] Error reading the configuration file to start the server.");
		console.log("[+] Terminating application.");
		process.exit();
	}

	const appConfig = JSON.parse(fileData);
	console.log("[+] File was read successfully.");

	if (Bleno.state == 'poweredOff') {
		console.log("[+] Bluetooth is OFF. Make sure to turn it on.");
	}

	Bleno.on('stateChange', function(state) {
		console.log('[+] Bluetooth state changed to: ' + state);
		
		if (state === 'poweredOn') {
			Bleno.startAdvertising('pi', [appConfig.serviceUUID]);
		} else {
			Bleno.stopAdvertising();
		}
	});

	Bleno.on('advertisingStart', function(error) {
		if (error) {
			console.log("[+] Advertising failed.");
			return;
		}
		
		Bleno.setServices([
			new SpasService({
				uuid: appConfig.serviceUUID,
				characteristics: [
					new CommandCharacteristic({
						uuid: appConfig.characteristicUUID,
						properties: ['read', 'write', 'notify']
					})
				]
			})
		]);
	});
});
