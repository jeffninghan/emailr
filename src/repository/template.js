var Template = require('../document/template');

exports.create = function(owner, recipients, messages, interval, cbk) {
	var template = new Template(
		{	owner: owner,
			recipients: recipients,
			messages: messages,
			interval: interval
		}
	);

	template.save(function(err) {
		return cbk(err, template)
	})
}

exports.findOneById = function(id, cbk) {
	Template.findOne({_id: id}).exec(function(err, template) {
		return cbk(err, template);
	})
}

exports.findAllByOwnerId = function(id, cbk) {
	Template.find({}).exec(function(err, templates) {
		t = []
		for (var template in templates) {
			if (templates[template].owner._id == id) {
				t.push(templates[template])
			}
		}
		return cbk(err, t)
	})
}

