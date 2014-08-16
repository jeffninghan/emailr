var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId

var contact = new mongoose.Schema(
	{
		owners: [{type: Object, required: true}],
		name: { type: String, required: true},
		email: { type: String, required: true},
		dateCreated: { type: Date, default: Date.now }
	}
);

module.exports = mongoose.model('contact', contact);