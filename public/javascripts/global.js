$(document).ready(function(){

	var outrages = [
					{"name":"abhishek","msg":"People suggesting we bar Syrian refugees from this country and the general racist fear-mongering that dominates the news."},
					{"name":"AJ", "msg":"Police brutality"},
					{"name":"Rebecca", "msg":"Mark Zuckerberg's letter to his daughter"}
				]

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

			outrageLoopRunning = true;
			smsDiv.html(outrages[outrageCount]["msg"]);
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
			smsDiv.html(queuedOutrageArray[0]["msg"])
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
			smsDiv.html(msg["msg"]);
			queuedOutrageRunning = true;
			runQueuedOutrageLoop();
		}
	}

	runOutrageLoop();

})