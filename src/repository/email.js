var Email = require('../document/email');

exports.create = function(sender, recipient, subject, message, cbk) {
	var email = new Email(
		{	sender: sender,
			recipient: recipient,
			subject: subject,
			message: message
		}
	);

	email.save(function(err) {
		return cbk(err, email)
	})
}

exports.findOneById = function(id, cbk) {
	Email.findOne({_id: id}).exec(function(err, email) {
		return cbk(err, email);
	})
}

exports.findAllBySenderId = function(id, cbk) {
	Email.find({}).exec(function(err, emails) {
		sent = []
		for (var email in emails) {
			if (emails[email].sender._id == id) {
				sent.push(emails[email])
			}
		}
		return cbk(err, sent)
	})
}
