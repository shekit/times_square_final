$(document).ready(function(){

	var socket = io();


	var outrages = [];

	var outrageCount = 0;

	var displayCounter = 0;

	var queuedOutrages=[];

	var outrageLoopRunning = false;

	var autoStartLoopTimer = 10000;

	var outrageTimerDuration = 15000;
	var outrageTimerDurationPadded = 15100; //keep about 100 ms more than above variable


	var gifShowSceneTwo = 5000; // show next gif scene after so many seconds of showing name
	var gifShowSceneThree = 10000; // show next gif scene after so many seconds of showing machine

	var gifIntro = $(".gif-intro")
	var gifs = $(".gif-bg")
	var gifName = $("#gif-name")
	var gifNoName = $("#gif-no-name")
	var gifMachine = $("#gif-machine")
	var gifOutput = $("#gif-output")
	var senderName = $("#sender-name");
	var outrageText = $("#outrage");

	var queuedOutrageArray = [];

	var queuedOutrageRunning = false;

	function showIntroScreen(){
		gifs.hide();
		gifIntro.show();
	}

	function runOutrageLoop(){
		
		if(queuedOutrageRunning){
			stopQueuedOutrage();
		}


		//console.log("STARTED ARRAY LOOP");
		outrageInterval = setInterval(function(){

			outrageLoopRunning = true;

			var gotName = outrages[outrageCount]["name"]
			var msg = outrages[outrageCount]["msg"]

			gifs.hide();

			startAnimation(gotName, msg, false);

			if(outrageCount >= outrages.length-1){
				outrageCount = 0;
				return;
			}
			
			outrageCount++;
		}, outrageTimerDurationPadded);
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

			startAnimation(gotName, msg, true)

		}, outrageTimerDurationPadded);

	}

	function startAnimation(name,msg,loopCheck){

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
		if(loopCheck){
			setTimeout(function(){
				if(queuedOutrageArray.length == 0){
					//console.log("RESET LOOP")
					runOutrageLoop();
					return;
				}
				console.log("More in QUEUE")
			}, outrageTimerDuration);
		}
	}


	function stopQueuedOutrage(){
		//console.log("Stop queued array");
		clearInterval(queuedInterval);
		queuedOutrageRunning = false;
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
		displayCounter = msg;

		$(".outrage-counter").html(displayCounter)
	})

	// get data from server to deal with page refresh
	socket.on('outrageList', function(msg){
		if(msg.length){
			outrages = msg
			console.log(msg)

			//if there is data, start loop in 10 secs
			setTimeout(function(){
				runOutrageLoop();
			}, autoStartLoopTimer)
		} else {
			console.log("no data")
		}
	})



})