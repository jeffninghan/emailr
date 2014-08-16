var mongoose = require('mongoose');

var account = new mongoose.Schema(
	{ 	
	  	email: { type: String, required: true},
	  	password: { type: String, required: true},
	  	name: { type: String, required: false},
	  	dateCreated: { type: Date, default: Date.now }
	}
);

module.exports = mongoose.model('account', account);