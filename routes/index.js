var express = require('express');
var router = express.Router();
var Subscriber = require("../models/subscriber");

var socket = require('socket.io');
var io = socket();

var approvedOutrages = [];

var rejectedOutrages = [];

io.on('connection', function(socket){
	console.log("a user connected");

	io.emit('outrageList',approvedOutrages)
})

/* GET home page. */
router.post('/message', function(req, res, next){

	// get users number
	var phone = req.body.From;
	var msg = req.body.Body || '';

	// let admin know you've received text
	if(msg){
		io.emit("gotText",msg)
	}
	

	console.log("Phone: " + phone);
	console.log("Message: " + msg);

	res.type('text/xml');
	res.render('twiml');
})

router.post('/approve', function(req,res,next){
	console.log("APPROVED")
	
	var data = req.body;

	//add to approved outrages array
	approvedOutrages.push(data)

	var senderName = req.body.senderName;
	var sms = req.body.msg

	//send msg and name data if name is given
	if(senderName){
		io.emit("sms",{"name":senderName, "msg":sms})
	} else {
		io.emit("sms",{"name":'', "msg":sms})
	}
	

	//send number of outrages to increment counter
	io.emit("count", approvedOutrages.length);
	console.log("APPROVED LIST")
	console.log(approvedOutrages)
	res.send("approved")
})

router.post('/reject', function(req, res, next){
	var data = req.body;
	console.log("REJECTED")
	rejectedOutrages.push(data);
	console.log("REJECTED LIST")
	console.log(rejectedOutrages)
	res.send("reject")
})

router.get('/nimda', function(req, res, next){
	res.render('admin')
})


router.get('/', function(req, res, next) {
  	res.render('index1');
});


module.exports = {"router":router, "io":io};
