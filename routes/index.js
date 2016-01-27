var express = require('express');
var router = express.Router();
var Subscriber = require("../models/subscriber");

var socket = require('socket.io');
var io = socket();


/* GET home page. */
router.post('/message', function(req, res, next){

	// get users number
	var phone = req.body.From;
	var msg = req.body.Body || '';

	//msg = msg.toLowerCase().trim();
	io.emit("sms",msg);

	console.log("Phone: " + phone);
	console.log("Message: " + msg);

	res.type('text/xml');
	res.render('twiml');
})


router.get('/', function(req, res, next) {
  	res.render('index', { title: 'Express' });
});



module.exports = {"router":router, "io":io};
