var Email = require('../document/email');

exports.create = function(sender, recipients, subject, message) {
	var email = new Email(
		{	sender: sender,
			recipients: recipients,
			subject: subject,
			message: message
		}
	);

	email.save(function(err) {
		return cbk(err, email)
	})
}

exports.findById = function(id, cbk) {
	Email.find({_id: id}).exec(function(err, email) {
		return cbk(err, email);
	})
}
