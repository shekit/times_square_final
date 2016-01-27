$(document).ready(function(){

	var outrages = ["People suggesting we bar Syrian refugees from this country and the general racist fear-mongering that dominates the news.","Police brutality.", "Mark Zuckerberg's letter to his daughter","guns. civilians, police, anyone using a gun.","environmental disaster in brazil that was neglected by the media","stereotypical assumptions of some countries","Cecil the Lion did!"];
	var outrageCount = 0;

	var socket = io();

	var queuedOutrages=[];

	var queuedOutrageObj = {};

	var queueNumber = 0;

	var ul = $("#messages");

	var smsDiv = $("#outrage");

	var outrageLoopRunning = false;

	var outrageTimerDuration = 5000;

	smsDiv.html(outrages[0]);

	// function runOutrageLoop(){
	// 	outrageInterval = setInterval(function(){
	// 		outrageLoopRunning = true;

	// 		if(outrageCount >= outrages.length){
	// 			outrageCount = 0;
	// 			return
	// 		}
	// 		smsDiv.html(outrages[outrageCount]);
	// 		outrageCount++;
	// 	}, outrageTimerDuration)
	// }

	// function stopOutrageLoop(){
	// 	clearInterval(outrageInterval);
	// 	outrageLoopRunning = false;
	// }

	// socket.on('sms', function(msg){

	// 	queuedOutrages.push(msg);

	// })

	// socket.on('sms', function(msg){
	// 	stopOutrageLoop();
	// 	outrages.push(msg);
	// 	setTimeout(function(){
	// 		smsDiv.html(msg);
	// 		outrageCount++;
	// 		if(!outrageLoopRunning){
	// 			console.log("Restart loop");
	// 			runOutrageLoop();
	// 		}
	// 	}, 5000)
	// })

	// runOutrageLoop();

	// function runOutrageLoop(){

	// 	outrageInterval = setInterval(function(){
	// 		//console.log(outrageCount)
	// 		outrageLoopRunning = true;

	// 		if(outrageCount >= outrages.length){
	// 			outrageCount = 0;
	// 			return;
	// 		}
	// 		smsDiv.html(outrages[outrageCount]);
	// 		outrageCount++;
	// 	}, 1500);
	// }

	// socket.on("sms", function(msg){
	// 	if(outrageLoopRunning){
	// 		clearInterval(outrageInterval);
	// 	}
		
	// 	outrageLoopRunning = false;
	// 	queuedOutrages.push(msg);
	// 	console.log(queuedOutrages.length);
	// 	var key = queuedOutrages.indexOf(msg);
	// 	if(queuedOutrages.length == 1){
	// 		smsDiv.html(msg);
	// 	} else {
	// 		setTimeout(function(){
	// 			smsDiv.html(msg);
	// 		}, 1500*queuedOutrages.length);
	// 	}
	// 	outrages.push(msg);
	// 	//queuedOutrages.splice(key,1);
	// 	console.log(queuedOutrages.length);

	// 	checkToRestartInterval(key);
	// 	// outrages.push(msg);
	// 	// console.log(msg)
	// 	// smsDiv.html(msg);
	// 	// outrages.push(msg);
	// 	// queuedOutrages.push(msg);
	// 	// if(queuedOutrage)
	// 	// clearInterval(outrageInterval);
	// 	// outrageCount=0;
	// });

	// function checkToRestartInterval(key){
	// 	console.log("Checking to restart or not");
	// 	setTimeout(function(){
	// 		//queuedOutrages.splice(key,1);
	// 		delete queuedOutrages[key];
	// 		console.log(queuedOutrages.length);
	// 		if(!outrageLoopRunning){
	// 			console.log("restart loop");
	// 			outrageCount = 0;
	// 			runOutrageLoop();
	// 		}
	// 	}, 1500)
	// }

	// runOutrageLoop();

	// function stopInterval(){
	// 	clearInterval(outrageInterval);
	// 	outrageLoopRunning = false;
	// }

	// function runOutrageLoop(){
	// 	console.log("STARTED ARRAY LOOP");
	// 	outrageInterval = setInterval(function(){
	// 		//console.log(outrageCount)
	// 		outrageLoopRunning = true;

	// 		if(outrageCount >= outrages.length){
	// 			outrageCount = 0;
	// 			return;
	// 		}
	// 		smsDiv.html(outrages[outrageCount]);
	// 		outrageCount++;
	// 	}, outrageTimerDuration);
	// }

	// socket.on('sms', function(msg){
	// 	console.log("GOT MSG");
	// 	if(outrageLoopRunning){
	// 		console.log("CLEAR INTERVAL");
	// 		clearInterval(outrageInterval);
	// 	}

	// 	queueNumber++;
	// 	console.log("CURRENT QUEUE NUMBER: "+queueNumber);
	// 	queuedOutrageObj[queueNumber] = msg;

	// 	if(queueNumber == 1){
	// 		console.log("Display immediately");
	// 		smsDiv.html(msg);
	// 		checkToResetLoop(queueNumber,msg);
	// 	} else if(queueNumber > 1){
	// 		console.log("Cant display immediately");
	// 		setTimeout(function(){
	// 			smsDiv.html(msg);
	// 			checkToResetLoop(queueNumber,msg);
	// 		}, outrageTimerDuration*queueNumber)
	// 	}
		
	// })

	// function stopLoopInterval(){
	// 	clearInterval(outrageInterval);
	// 	outrageLoopRunning = false;
	// }

	// function checkToResetLoop(id, msg){
	// 	delete queuedOutrageObj[id];
	// 	queueNumber--;
	// 	console.log("UPDATED QUEUE NUMBER: "+queueNumber);
	// 	setTimeout(function(){
	// 		console.log("ADDED TO ARRAY")
	// 		outrages.push(msg);
	// 		if(queueNumber == 0){
	// 			console.log("RESET LOOP");
	// 			runOutrageLoop(msg);
	// 		}
	// 	}, outrageTimerDuration);
	// }

	// runOutrageLoop();

	var queuedOutrageArray = [];

	var queuedOutrageRunning = false;

	var queuedOutrageCount = 0;

	//var queuedInterval = null;

	function runOutrageLoop(){
		
		if(queuedOutrageRunning){
			stopQueuedOutrage();
		}


		console.log("STARTED ARRAY LOOP");
		outrageInterval = setInterval(function(){
			//console.log("I'm HERE")
			//console.log(outrageCount)
			outrageLoopRunning = true;
			smsDiv.html(outrages[outrageCount]);
			if(outrageCount >= outrages.length-1){
				outrageCount = 0;
				return;
			}
			
			outrageCount++;
		}, outrageTimerDuration);
	}


	function stopLoopInterval(){
		console.log("STOP REGULAR LOOP");
		clearInterval(outrageInterval);
		outrageLoopRunning = false;
		outrageCount = 0;
	}

	function runQueuedOutrageLoop(){
		console.log("STARTED queued Array");
		queuedInterval = setInterval(function(){
			console.log("IN INTERVAL")
			//console.log(outrageCount)
			queuedOutrageRunning = true;
			//smsDiv.html(queuedOutrageArray[queuedOutrageCount]);
			smsDiv.html(queuedOutrageArray[0])
			// if(queuedOutrageCount >= queuedOutrageArray.length-1){
			// 	runOutrageLoop();
			// 	return;
			// }
			queuedOutrageArray.splice(0,1);

			if(queuedOutrageArray.length == 0){
				console.log("RESET LOOP IN 2 Secs")
				runOutrageLoop();
				return;
			}
			
			//queuedOutrageCount++;
		}, outrageTimerDuration);
	}

	function stopQueuedOutrage(){
		console.log("Stop queued array");
		clearInterval(queuedInterval);
		queuedOutrageRunning = false;
		queuedOutrageCount = 0;
	}

	socket.on('sms', function(msg){
		if(outrageLoopRunning){
			console.log("CLEAR LOOP INTERVAL");
	 		clearInterval(outrageInterval);
		}

		queuedOutrageArray.push(msg);
		outrages.push(msg);

		runQueuedOutrages(msg);
	})

	function runQueuedOutrages(msg){
		if(queuedOutrageRunning == false){
			smsDiv.html(msg);
			queuedOutrageRunning = true;
			runQueuedOutrageLoop();
		}
	}

	runOutrageLoop();

})