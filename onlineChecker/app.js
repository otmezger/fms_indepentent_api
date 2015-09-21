var ping = require ("net-ping");
var moment = require('moment');


var outputFile = '/home/admfms/sandbox/fms_indepentent_api/onlineChecker/onlineCheckResults.json';
var output = {};
/*
if (process.argv.length < 3) {
	console.log ("usage: node ping <target> [<target> ...]");
	process.exit (-1);
}

var targets = [];

for (var i = 2; i < process.argv.length; i++)
	targets.push (process.argv[i]);
*/
var targets = ['8.8.8.8','8.8.4.4'];
var options = {
	retries: 1,
	timeout: 2000
};

var session = ping.createSession (options);

session.on ("error", function (error) {
	console.trace (error.toString ());
});

for (var i = 0; i < targets.length; i++) {
	session.pingHost (targets[i], function (error, target) {
		var now = moment().format('YYYY-MM-DD HH:MM:SS')
		output.now = now;
		output.target = target;
		if (error){
			if (error instanceof ping.RequestTimedOutError){
				//console.log (target + ": Not alive");
				output.alive = 'dead';
				output.string = 'target is not alive';
			}else{
				//console.log (target + ": " + error.toString ());
				output.alive = 'unknown';
				output.string = error.toString();
			}
		}else{
			//console.log (target + ": Alive");
			output.alive = 'alive';
			output.string = 'ok';
		}
		console.log(JSON.stringify(output));
       		var fs = require('fs');
        	//fs.writeFile(outputFile, JSON.stringify(output), function(err) {
		fs.appendFile(outputFile, JSON.stringify(output) + ",\n", function(err) {
                	if(err) {
                        	return console.log(err);
                	}
                	console.log("The file was saved!");
        	});	
	});
	/*
	console.log(JSON.stringify(output));
	var fs = require('fs');
	fs.writeFile(outputFile, JSON.stringify(output), function(err) {
    		if(err) {
        		return console.log(err);
    		}
 		console.log("The file was saved!");
	}); 
	*/
}

