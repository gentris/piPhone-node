class Helper {
	constructor() {
		this.BlenoState = {
			StateChange: 'stateChange ',
			PoweredOn: 'poweredOn',
			PoweredOff: 'poweredOff'
		};

		Object.freeze(this.BlenoState);
	}
}

module.exports = Helper;
