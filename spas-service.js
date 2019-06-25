const Bleno = require('bleno');
const CommandCharacteristic = require('./command-characteristic');

class SpasService extends Bleno.PrimaryService {
	constructor(options) {
		super(options);
	}
}

module.exports = SpasService;
