var Contact = require('../document/contact');

exports.create = function(owner, name, email, cbk) {
	var contact = new Contact(
		{	owner: owner,
			name: name,
			email: email,	
		}
	);

	contact.save(function(err) {

		return cbk(err, contact);
	})
}

exports.findOneById = function(id, cbk) {
	Contact.findOne({_id: id}).exec(function(err, contact) {
		return cbk(err, contact)
	})
}

exports.findOneByEmail = function(email, cbk) {
	Contact.findOne({email: email}).exec(function(err, contact) {
		return cbk(err, contact)
	})
}

exports.findAllByOwnerId = function(id, cbk) {
	Contact.find({}).exec(function(err, contacts) {
		c = []
		for (var contact in contacts) {
			if (contacts[contact].owner._id == id) {
				c.push(contacts[contact])
			}
		}
		return cbk(err, c)
	})
}

exports.findByIds = function(ids, cbk) {
	Contact.find({_id: { $in: ids} }).exec(function(err, contacts) {
		return cbk(err, contacts)
	})
}