var Account = require('../document/account');

exports.create = function(email, password, name, cbk) {
	var account = new Account(
		{	email: email, 
			password: password,
			name: name
		}
	);

	account.save(function(err) {
		return cbk(err, account)
	})
}

exports.findById = function(id, cbk) {
	Account.find({_id: id}).exec(function(err, account) {
		return cbk(err, account)
	})
}

exports.findOneByEmail = function(email, cbk) {
	Account.findOne({email: email}).exec(function(err, account) {
		return cbk(err, account)
	})
}
