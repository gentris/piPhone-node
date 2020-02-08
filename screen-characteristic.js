const Bleno = require('bleno');
const EventEmitter = require('events');

class ScreenCharacteristic extends Bleno.Characteristic {
	constructor(options, session) {
        super(options);
        this.session = session;
        this.emitter = new EventEmitter();
    }

    onSubscribe(maxValueSize, updateValueCallback) {
        console.log("[+] Central subscribed to screen characteristic.");
    }

    onUnsubscribe() {
        console.log("[+] Central usubscribed from screen characteristic.");
    }

    onWriteRequest(data, offset, withoutResponse, updateValueCallback) {
        console.log("[+] Received screen size data.");

        let jsonData = JSON.parse(data.toString());

        if (offset) {
			console.log("[+] Offset is set.");
			console.log("[+] Terminating application.");
			process.exit();
        }

        console.log("SCREEN DATA: ", jsonData.rows);

        // let rows = data["rows"];
        // let cols = data["cols"];

        // this.session.rows = rows;
        // this.session.cols = cols;

        updateValueCallback(this.RESULT_SUCCESS);

        this.emitter.emit('screen-ready', jsonData);
    }
}

module.exports = ScreenCharacteristic;