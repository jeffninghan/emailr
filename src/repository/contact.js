var Contact = require('../document/contact');

exports.create = function(owner, name, email, cbk) {
	var contact = new Contact(
		{	owners: [owner],
			name: name,
			email: email,	
		}
	);

	contact.save(function(err) {

		return cbk(err, contact);
	})
}

exports.findOneByEmail = function(email) {

}