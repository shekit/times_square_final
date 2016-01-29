
var twilio = require('twilio');
var config = require('../config/configdev');

var client = twilio(config.accountSid, config.authToken);



