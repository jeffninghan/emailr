var express = require('express');
var account = require('../src/repository/account');
var contact = require('../src/repository/contact');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res) {
	account.findById('53efd7f5191f1dcc33939fe8', function(err, account) {
		res.send(JSON.stringify(account));
	})
	// account.findOneByEmail('jeff', function(err, account) {
	// 	contact.create(account, 'jane', 'jane', function(err, contact) {
	// 		res.send(JSON.stringify(contact));
	// 	})
	// })
});

module.exports = router;
