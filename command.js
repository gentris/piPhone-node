const { spawn } = require('child_process');

class Command extends spawn{
	constructor(query, currentDirectory) {
		let effectiveQuery = "cd " + currentDirectory + " && " + query;
		super(effectiveQuery, {
			shell: true,
			stdio: ['pipe', 'pipe', 'pipe']
		});
	}

	// prepare(query, currentDirectory) {
	// 	let requestToChangeDir = query.startsWith("cd ")
	// 				|| query.includes("&& cd ")
	// 				|| query.includes("|| cd ");

	// 	if (requestToChangeDir) {
	// 		let directoryQuery = query;
	// 		let directoryQueryArray = directoryQuery.toString().split(" ");
	// 		let directoryIndex = directoryQueryArray.lastIndexOf("cd") + 1;
	// 		let directory = directoryQueryArray[directoryIndex].toString().replace(/(\r\n|\n|\r)/gm, "");
	// 		let directoryQuery = "cd " + directory + " && pwd";

	// 		// const changeDirCommand = super(directoryQuery, {
	// 		// 	shell: true,
	// 		// 	stdio: 'pipe'
	// 		// });

	// 		// changeDirCommand.stdout.on('data', function(newDirectory) {
	// 		// 	currentDirectory = newDirectory;
	// 		// 	console.log("[+] Directory changed to: " + currentDirectory);
	// 		// }
	// 	} 

	// 	query = "cd " + currentDirectory + " && " + query;
	// }

	execute() {

	}
}

module.exports = Command;
