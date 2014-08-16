var mongoose = require('mongoose');

var email = new mongoose.Schema(
	{
		sender: { type: Object, required: true},
		recipients: [{ type: Object, required: true}],
		subject: { type: String, required: true},
		message: { type: String, required: true},
		date: { type: Date, default: Date.now }
	}
);

module.exports = mongoose.model('email', email);