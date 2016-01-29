$(document).ready(function(){

	var socket = io();

	var outrages = [];

	var outrageCount = 0;

	var displayCounter = 0;

	var numOfVariations = 4;

	var outrageLoopRunning = false;

	var autoStartLoopTimer = 10000;

	

	var outrageTimerDuration = 22000;
	var outrageTimerDurationPadded = 22100; //keep about 100 ms more than above variable


	var gifShowSceneTwo = 5000; // show next gif scene after so many seconds of showing name
	var gifShowSceneThree = 10000; // show next gif scene after so many seconds of showing machine

	var gifs = $(".gif-bg")
	var gifIntro = $("#gif-intro")
	var gifName = $("#gif-name")
	var gifNoName = $("#gif-no-name")
	var gifMachine = $("#gif-machine")
	var gifOutput = $("#gif-output")
	var senderName = $("#sender-name");
	var outrageText = $("#outrage");

	var introGifArray = $(".img-intro")
	var nameGifArray = $(".img-name")
	var noNameGifArray = $(".img-no-name")
	var machineGifArray = $(".img-machine")
	var outputGifArray = $(".img-output")
	var funnelInArray = $(".funnel-in")
	var funnelOutArray = $(".funnel-out")

	var queuedOutrageArray = [];

	var queuedOutrageRunning = false;

	var introScreenInterval = 180000;
	var introScreenShowing = false;
	var introScreenDuration = 10000;

    var introTimer = null;
    var animOneTimer = null;
    var animTwoTimer = null;
    var animThreeTimer = null;
    var outrageInterval = null;
    var queuedInterval = null;

	function resetCss(){
		//reset css
	}

	// $("#trial-outrage").animate({
	// 	fontSize:"34px",
	// 	left:"45%",
	// 	top:"30%"
	// },1500)

	function showIntroScreen(){
		console.log("INTRO")
		introScreenShowing = true;
		
		if(outrageLoopRunning){
			console.log("STOP LOOP")
			stopLoopInterval();
		}
		
		if(queuedOutrageRunning){
			console.log("STOP QUEUED")
			stopQueuedOutrage();
		}
		if(animOneTimer){
			console.log("CLEARED ANIM ONE")
			clearTimeout(animOneTimer);
			animOneTimer=null
		}
		if(animTwoTimer){
			console.log("CLEARED ANIM TWO")
			clearTimeout(animTwoTimer);
			animTwoTimer=null
		}

		
		
		
		// show random bg img
		gifs.hide();
		var num = Math.floor(Math.random()*numOfVariations);
		introGifArray.hide();
		$(introGifArray[num]).show();

		// after duration check if any msgs have piled up
		// start loop of piled up msgs or run regular loop
		if(introTimer){
			clearTimeout(introTimer);
			introTimer = null;
		}

		introTimer = setTimeout(function(){
			if(queuedOutrageArray.length>0 && queuedOutrageRunning == false){
				console.log("SHOW QUEUE")
				introScreenShowing = false;
				runQueuedOutrages();
			} else if(outrages.length>0 && outrageLoopRunning == false){
				console.log("SHOW LOOP")
				introScreenShowing = false;
				runOutrageLoop();
			} else if(outrageLoopRunning == false && queuedOutrageRunning == false){
				//if no msg has come in then restart
				console.log("NOTHING TO SHOW")
				showIntroScreen();
			}

		}, introScreenDuration)
	}

	function runIntroScreenLoop(){

		introInterval = setInterval(function(){
			
			if(!introScreenShowing){
				console.log("INTRO LOOP")
				showIntroScreen();
			}
			
		}, introScreenInterval)
	}

	// show intro screen on startup
	showIntroScreen();
	runIntroScreenLoop();



	function runOutrageLoop(){
		
		if(queuedOutrageRunning){
			stopQueuedOutrage();
		}

		if(outrageInterval){
			clearInterval(outrageInterval);
		}
		loopy();
		//console.log("STARTED ARRAY LOOP");
		outrageInterval = setInterval(loopy, outrageTimerDurationPadded);

		function loopy(){
			console.log("STARTED LOOP")
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
		}
	}


	function stopLoopInterval(){
		//console.log("STOP REGULAR LOOP");
		clearInterval(outrageInterval);
		outrageLoopRunning = false;
		outrageCount = 0;
	}

	function runQueuedOutrageLoop(){
		//console.log("STARTED queued Array");
		if(queuedInterval){
			clearInterval(queuedInterval);

		}
		toopy();

		queuedInterval = setInterval(toopy, outrageTimerDurationPadded);

		function toopy(){
			//console.log("IN INTERVAL")

			queuedOutrageRunning = true;

			if(queuedOutrageArray.length){
				var gotName = queuedOutrageArray[0]["name"]
				var msg = queuedOutrageArray[0]["msg"]
			} else {
				return;
			}

			console.log("got name: " + gotName)

			gifs.hide();

			queuedOutrageArray.splice(0,1);

			startAnimation(gotName, msg, true)

		}

	}

	function startAnimation(name,msg,loopCheck){

		var randomGif = Math.floor(Math.random()*numOfVariations); //get random number to vary gif images

		outrageText
		.animate({
				opacity: "0"
			})
			.delay(50)
			.animate({
				top: "90%",
				fontSize: "0"
			})

		if(name){
			//hide and show random img
			nameGifArray.hide();
			funnelInArray.hide();

			$(nameGifArray[randomGif]).show();
			$(funnelInArray[randomGif]).show();

			gifName.show();
			senderName.html(name);

			senderName
			.delay(200)
			.animate({
				fontSize:"100px",
				opacity: "1"
			},200)
			.delay(2700)
			.animate({
				fontSize:"40px",
				top:"90%"
			},1500)
			.animate({
				fontSize:"0",
				opacity:"0"
			})
			.delay(50)
			.animate({
				top:"40%"
			})
		} else {
			noNameGifArray.hide();
			$(noNameGifArray[randomGif]).show();

			gifNoName.show();
		}

		if(animOneTimer){
			console.log("CLEARED ANIM ONE INSIDE")
			clearTimeout(animOneTimer);
			animOneTimer=null
		}

		animOneTimer = setTimeout(function(){
			gifName.hide();
			gifNoName.hide();

			machineGifArray.hide();
			$(machineGifArray[randomGif]).show();

			gifMachine.show();
		}, gifShowSceneTwo)

		if(animTwoTimer){
			console.log("CLEARED ANIM TWO INSIDE")
			clearTimeout(animTwoTimer);
			animTwoTimer=null
		}
		animTwoTimer = setTimeout(function(){
			gifMachine.hide();

			outputGifArray.hide();
			funnelOutArray.hide();
			$(outputGifArray[randomGif]).show();
			$(funnelOutArray[randomGif]).show();

			gifOutput.show();
			outrageText.html(msg);

			outrageText
			.delay(500)
			.animate({
				fontSize:"50px",
				opacity: "1",
				top:"35%"
			},1000)
			

		}, gifShowSceneThree)


		// tel outrage loop to start only if animation is over
		// and there are no more queued outrages
		if(loopCheck){
			
			animThreeTimer = setTimeout(function(){
				if(queuedOutrageArray.length == 0 && outrageLoopRunning==false){
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

	function runQueuedOutrages(){
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

		if(!introScreenShowing){
			runQueuedOutrages();
		}
		
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
				if(!outrageLoopRunning){
					runOutrageLoop();
				}
			}, introScreenDuration)
		} else {
			console.log("no data")
		}
	})





})