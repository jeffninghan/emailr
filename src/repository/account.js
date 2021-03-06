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

exports.findOneById = function(id, cbk) {
	Account.findOne({_id: id}).exec(function(err, account) {
		return cbk(err, account)
	})
}

exports.findOneByEmail = function(email, cbk) {
	Account.findOne({email: email}).exec(function(err, account) {
		return cbk(err, account)
	})
}

exports.findAll = function(cbk) {
	Account.find({}).exec(function(err, accounts) {
		return cbk(err, accounts)
	})
}