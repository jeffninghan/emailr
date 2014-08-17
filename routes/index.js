var express = require('express');
var router = express.Router();
var account = require('../src/repository/account');
var contact = require('../src/repository/contact');
var email = require('../src/repository/email');
var template = require('../src/repository/template');
var async = require('async');

/* GET home page. */
router.get('/', function(req, res) {
	if (req.session.account) {
		return res.render('index', 
			{	title: 'Emailr - all you need to keep up with friends', 
				message:'Welcome back ' + req.session.account.name,
				account: req.session.account,
				contacts: req.session.contacts,
				emails: req.session.emails,
				templates: req.session.templates
			}
		)
	}
	else {
		res.render('login');
	}
})

router.post('/login', function(req, res) {
	var _email = req.body.email;
	var password = req.body.password;  // this is hashed!!
	account.findOneByEmail(_email, function(err, account) {
		if (err) {
			return res.send(err)
		}
		if (!account) {
			return res.send({success: false, error: 'Email does not exists.'})
		}
		var valid = (account.password === password)
		if (valid) {
			req.session.account = account
			var id = String(account._id)
			async.waterfall([
			    function(cbk){
			    	contact.findAllByOwnerId(id, function(err, contacts) {
			    		req.session.contacts = contacts;
			    		cbk(null)
			    	})
			    },
			    function(cbk){
				    template.findAllByOwnerId(id, function(err, templates) {
				    	req.session.templates = templates
				    	cbk(null)
				    })
			    },
			    function(cbk){
			        email.findAllBySenderId(id, function(err, emails) {
			        	req.session.emails = emails
			        	cbk(null)
			        })
			    }
			], function (err, result) {
			   res.redirect('/')   
			});
			
			//return res.send({success: true, account: account})
		}
		else {
			return res.send({success:false, error: "Email/password combination is incorrect."})
		}
	})
})

router.get('/signup', function(req, res) {
	res.render('signup')
})

//x-www-form-urlencoded data
router.post('/signup', function(req, res) {
	var name = req.body.name;
	var email = req.body.email;
	var password = req.body.password;  // this is hashed!!
	Account.create(email, password, name, function(err, account) {
		if (err || !account) {
			return res.send(err)
		}
		req.session.account = account

		res.redirect('/')
	})
})

router.get('/createContact', function(req, res) {
	res.render('createcontact')
})

router.get('/createTemplate', function(req, res) {
	res.render('createtemplate')
})

router.get('/logout', function(req, res) {
    req.session.destroy(function(){
        res.redirect('/')
    })
});

module.exports = router;
