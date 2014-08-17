var mongoose = require('mongoose');
 
var template = new mongoose.Schema(
	{
		owner: { type: Object, required: true},
		recipients: [{type: String, required: false}],
		messages: { type: Object, required: true},
		interval: { type: Object, required: true},
		dateCreated: { type: Date, default: Date.now },
		dateLastSent: { type: Date, default: Date.now },
	}
);

module.exports = mongoose.model('template', template);