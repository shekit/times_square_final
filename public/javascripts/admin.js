$(document).ready(function(){
	var socket = io();


	socket.on('approval', function(msg){

		if(msg){
			console.log("yay");
			var html = "<div><textarea class='form-control' rows='3'>"+msg+"</textarea><input type='text' class='form-control' placeholder='name of sender'><a class='approve btn btn-success'>Approve</a><a class='reject btn btn-danger'>Reject</a></div>";
			$(".messages").append(html)
		}	
	})

	$("body").on('click', '.approve', function(event){
		event.preventDefault();

		var self = $(this)
		var parent = self.parent();

		var msg = parent.find("textarea").val();
		var senderName = parent.find("input").val();

		console.log("MSG: "+ msg)
		console.log("FROM: "+senderName)

	})

	$("body").on("click", ".reject", function(event){
		event.preventDefault();

		var self = $(this)
		var parent = self.parent();

		var msg = parent.find("textarea").val();
		var senderName = parent.find("input").val();

		console.log("MSG: "+ msg)
		console.log("FROM: "+senderName)

	})
})