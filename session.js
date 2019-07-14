class Session {
	constructor() {
		this.directory = ".";
		this.command = { };
		this.numberOfCommandsExecuted = 0;
		this.previousCommandFinishedExecuting = true;
	}
}

module.exports = Session;
