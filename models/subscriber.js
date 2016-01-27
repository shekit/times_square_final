var mongoose = require('mongoose');
var twilio = require('twilio');
var config = require('../config/config');

var client = twilio(config.accountSid, config.authToken);

var SubscriberSchema = new mongoose.Schema({
	phone: String,
	message: String
});

