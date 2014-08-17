var mongoose = require('mongoose');

var contact = new mongoose.Schema(
	{
		owner: {type: Object, required: true},
		name: { type: String, required: true},
		email: { type: String, required: true},
		dateCreated: { type: Date, default: Date.now }
	}
);

module.exports = mongoose.model('contact', contact);