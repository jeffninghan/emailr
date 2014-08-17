var express = require('express');
var router = express.Router();

var Account = require('../src/repository/account');

//x-www-form-urlencoded data
router.post('/', function(req, res) {
	var email = req.body.email;
	var password = req.body.password;  // this is hashed!!
	Account.findOneByEmail(email, function(err, account) {
		if (err) {
			return res.send(err)
		}
		if (!account) {
			return res.send({success: false, error: 'Email does not exists.'})
		}
		var valid = (account.password === password)
		if (valid) {
			return res.send({success: true, account: account})
		}
		return res.send({success:false, error: "Email/password combination is incorrect."})
	})
})

module.exports = router;
