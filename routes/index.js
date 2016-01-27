var express = require('express');
var router = express.Router();
var Subscriber = require("../models/subscriber");

var socket = require('socket.io');
var io = socket();

var approvedOutrages = [];

var rejectedOutrages = [];
/* GET home page. */
router.post('/message', function(req, res, next){

	// get users number
	var phone = req.body.From;
	var msg = req.body.Body || '';

	//msg = msg.toLowerCase().trim();
	io.emit("sms",msg);
	io.emit("approval",msg)

	console.log("Phone: " + phone);
	console.log("Message: " + msg);

	res.type('text/xml');
	res.render('twiml');
})

router.post('/approve', function(req,res,next){

	var data = req.body;
	console.log("APPROVED")
	console.log(data);
	approvedOutrages.push(data)
	io.emit("approvedSms",data)
	console.log("APPROVED LIST")
	console.log(approvedOutrages)
	res.send("approved")
})

router.post('/reject', function(req, res, next){
	var data = req.body;
	console.log("REJECTED")
	console.log(data);
	rejectedOutrages.push(data);
	console.log("REJECTED LIST")
	console.log(rejectedOutrages)
	res.send("reject")
})

router.get('/nimda', function(req, res, next){
	res.render('admin')
})


router.get('/', function(req, res, next) {
  	res.render('index', { title: 'Express' });
});



module.exports = {"router":router, "io":io};
