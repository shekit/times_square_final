$(document).ready(function(){
	var socket = io();

	var url = "http://104.131.178.129:3000/"


	//display incoming msgs when notified by server
	socket.on('gotText', function(msg){

		if(msg){
			console.log("yay");
			var html = "<div class='single-msg'><textarea class='form-control sender-msg' rows='3'>"+msg+"</textarea><input type='text' class='form-control sender-name' placeholder='name of sender'><div class='btn-wrapper'><a class='approve btn btn-success'>Approve</a><a class='reject btn btn-danger'>Reject</a></div></div>";
			$(".messages").append(html)
		}	
	})

	// approve sms
	$("body").on('click', '.approve', function(event){
		event.preventDefault();

		var self = $(this)
		var parent = self.parents('.single-msg');

		var msg = parent.find("textarea").val();
		var senderName = parent.find("input").val();

		console.log("MSG: "+ msg)
		console.log("FROM: "+senderName)

		$.ajax({
			"method": "POST",
			"url": url+'approve',
			"data":{"msg":msg,"name":senderName}
		})
		.done(function(resp){
			console.log(resp)
			parent.hide();
		})
		.error(function(err){
			alert("Error: "+ err)
		})

	})

	//reject sms
	$("body").on("click", ".reject", function(event){
		event.preventDefault();

		var self = $(this)
		var parent = self.parents('.single-msg');

		var msg = parent.find("textarea").val();
		var senderName = parent.find("input").val();

		console.log("MSG: "+ msg)
		console.log("FROM: "+senderName)

		$.ajax({
			"method": "POST",
			"url": url+'reject',
			"data":{"msg":msg,"name":senderName}
		})
		.done(function(resp){
			console.log(resp)
		})
		.error(function(err){
			alert("Error: "+ err)
		})

		parent.hide();

	})
})