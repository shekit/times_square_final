$(document).ready(function(){

	var socket = io();


	var outrages = [];

	var outrageCount = 0;

	var queuedOutrages=[];

	var outrageLoopRunning = false;

	var outrageTimerDuration = 6000;
	var outrageTimerDurationPadded = 6100; //keep about 100 ms more than above variable

	var gifShowSceneTwo = 2500; // show next gif scene after so many seconds of showing name
	var gifShowSceneThree = 4000; // show next gif scene after so many seconds of showing machine

	var gifs = $(".gif-bg")
	var gifName = $("#gif-name")
	var gifNoName = $("#gif-no-name")
	var gifMachine = $("#gif-machine")
	var gifOutput = $("#gif-output")
	var senderName = $("#sender-name");
	var outrageText = $("#outrage");

	var queuedOutrageArray = [];

	var queuedOutrageRunning = false;


	function runOutrageLoop(){
		
		if(queuedOutrageRunning){
			stopQueuedOutrage();
		}

		console.log("LOOOPY DOOPY")

		//console.log("STARTED ARRAY LOOP");
		// outrageInterval = setInterval(function(){

		// 	outrageLoopRunning = true;
		// 	outrageText.html(outrages[outrageCount]["msg"]);
		// 	if(outrageCount >= outrages.length-1){
		// 		outrageCount = 0;
		// 		return;
		// 	}
			
		// 	outrageCount++;
		// }, outrageTimerDuration);
	}


	function stopLoopInterval(){
		//console.log("STOP REGULAR LOOP");
		clearInterval(outrageInterval);
		outrageLoopRunning = false;
		outrageCount = 0;
	}

	function runQueuedOutrageLoop(){
		//console.log("STARTED queued Array");
		queuedInterval = setInterval(function(){
			//console.log("IN INTERVAL")

			queuedOutrageRunning = true;

			var gotName = queuedOutrageArray[0]["name"]
			var msg = queuedOutrageArray[0]["msg"]

			console.log("got name: " + gotName)

			gifs.hide();

			queuedOutrageArray.splice(0,1);

			startAnimation(gotName, msg)

		}, outrageTimerDurationPadded);
	}

	function startAnimation(name,msg){

		if(name){
			gifName.show();
			senderName.html(name)
		} else {
			gifNoName.show();
		}

		setTimeout(function(){
			gifName.hide();
			gifNoName.hide();
			gifMachine.show();
		}, gifShowSceneTwo)

		setTimeout(function(){
			gifMachine.hide();
			gifOutput.show();
			outrageText.html(msg)
		}, gifShowSceneThree)

		// tel outrage loop to start only if animation is over
		// and there are no more queued outrages
		setTimeout(function(){
			if(queuedOutrageArray.length == 0){
				//console.log("RESET LOOP")
				runOutrageLoop();
				return;
			}
			console.log("More in QUEUE")
		}, outrageTimerDuration);
	}


	function stopQueuedOutrage(){
		//console.log("Stop queued array");
		clearInterval(queuedInterval);
		queuedOutrageRunning = false;
		gifs.hide();
	}

	function runQueuedOutrages(msg){
		if(queuedOutrageRunning == false){
			queuedOutrageRunning = true;
			runQueuedOutrageLoop();
		}
	}

	socket.on('sms', function(msg){
		if(outrageLoopRunning){
			//console.log("CLEAR LOOP INTERVAL");
	 		clearInterval(outrageInterval);
		}

		queuedOutrageArray.push(msg);
		outrages.push(msg);

		runQueuedOutrages(msg);
	})

	socket.on('count', function(msg){
		outrageCount = msg;

		$(".outrage-counter").html(outrageCount)
	})


	runOutrageLoop();

})