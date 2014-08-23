var express = require('express');
var router = express.Router();
var account = require('../src/repository/account');
var contact = require('../src/repository/contact');
var email = require('../src/repository/email');
var template = require('../src/repository/template');
var helpers = require('../src/helpers');
var async = require('async');

// Constants
const EMAIL_LIMIT = 10
/* GET home page. */
router.get('/', function(req, res) {
	if (req.session.account) {
		getObjects(String(req.session.account._id), function(err, obj) {
			if (err) { return res.render('index', {error: {name: err.name, message: err.message}}) }
			req.session.contacts = helpers.orderByAttribute(obj.contacts, 'name', 'desc')
			req.session.emails = obj.emails
			req.session.emails.reverse()
			req.session.templates = helpers.orderByAttribute(obj.templates, 'name', 'desc')
			return res.render('index', 
				{	title: 'Emailr - all you need to keep up with friends', 
					message:'Welcome back ' + req.session.account.name,
					account: req.session.account,
					contacts: req.session.contacts,
					emails: req.session.emails.slice(0, EMAIL_LIMIT),
					templates: req.session.templates
				}
			)
		})
	}
	else {
		res.render('login');
	}
})

router.post('/login', function(req, res) {
	var _email = req.body.email;
	var password = req.body.password;  // this is hashed!!
	password = helpers.encrypt(password);
	account.findOneByEmail(_email, function(err, account) {
		if (err) {
			return res.send(err)
		}
		if (!account) {
			return res.render('login', {error: {name: 'Invalid Login', message: "Account does not exist."}})
		}
		var valid = (account.password === password)
		if (valid) {
			req.session.account = account
			var id = String(account._id)
			getObjects(id, function(err, obj) {
				if (err) {
					return res.render('login', {error: {name: err.name, message: err.message}})
				}
				req.session.contacts = obj.contacts
				req.session.templates = obj.templates
				req.session.emails = obj.emails
				req.session.emails.reverse()
				return res.redirect('/') 

			})		
		}
		else {
			return res.render('login', {error: {name:'Invalid Login', message: "Email/password combination is incorrect."}})
		}
	})
})

router.get('/signup', function(req, res) {
	res.render('signup')
})

router.post('/signup', function(req, res) {
	var name = req.body.name;
	var email = req.body.email;
	var password = req.body.password;
	if (!name || !email || !password) {
		return res.render('signup', {error: {name: 'Invalid Input', message: 'Input fields are missing.'}})
	}
	password = helpers.encrypt(password);
	if (!helpers.checkEmailFormat(email)) {
		return res.render('signup', {error: {name:'Invalid Input', message:"Email is incorrectly formatted."}})
	}
	account.findOneByEmail(email, function(err, acc) {
		if (err) {
			return res.render('signup', {error: {name: err.name, message: err.message}})
		}
		if (acc) {
			return res.render('signup', {error: {name: "Invalid Input", message:'Email already in use.'}})
		}
		account.create(email, password, name, function(err, account) {
			if (err) {
				return res.render('signup', {error: {name: err.name, message: err.message}})
			}
			if (!account) {
				return res.render('signup', {error: {name: 'Account Failure', message: 'Unable to create account.'}})
			}
			req.session.account = account
			req.session.contacts = []
			req.session.emails = []
			req.session.templates = []
			return res.redirect('/')
		})
	})
})

router.get('/createContact', function(req, res) {
	res.render('createcontact')
})

router.get('/createTemplate', function(req, res) {
	res.render('createtemplate', {contacts: req.session.contacts})
})

router.get('/viewTemplate/:templateId', function(req, res) {
	var templateId = req.params.templateId
	template.findOneById(templateId, function(err, template) {
		if (err) {
			return res.render('viewtemplate', {error: {name: err.name, message: err.message}})
		}
		if (!template) {
			return res.render('viewtemplate', {error: {name: 'Invalid Template', message: 'Unable to find template.'}})
		}
		contact.findByIds(template.recipients, function(err, contacts) {
			if (err) {
				return res.render('viewtemplate', {error: {name: err.name, message: err.message}})
			}
			res.render('viewtemplate', {template: template, contacts: contacts || []})
		})
	})
})

router.get('/viewEmail/:emailId', function(req, res) {
	var emailId = req.params.emailId
	email.findOneById(emailId, function(err, email) {
		if (err) {
			return res.render('viewemail', {error: {name: err.name, message: err.message}})
		}
		if (!template) {
			return res.render('viewemail', {error: {name: 'Invalid Email', message: 'Unable to find email.'}})
		}
		var message = helpers.parseMessage(email.message)
		res.render('viewemail', {email: email, message: message || ''})
	})
})

router.get('/allEmail', function(req, res) {
	return res.render('allemail', {emails: req.session.emails})
})

router.get('/logout', function(req, res) {
    req.session.destroy(function(){
        return res.redirect('/')
    })
});

var getObjects = function(id, cbk) {
	var obj = {}
	async.waterfall([
	    function(cbk1){
	    	contact.findAllByOwnerId(id, function(err, contacts) {
	    		obj.contacts = contacts;
	    		cbk1(err)
	    	})
	    },
	    function(cbk2){
		    template.findAllByOwnerId(id, function(err, templates) {
		    	obj.templates = templates
		    	cbk2(err)
		    })
	    },
	    function(cbk3){
	        email.findAllBySenderId(id, function(err, emails) {
	        	obj.emails = emails
	        	cbk3(err)
	        })
	    }
	], function (err) {
		return cbk(err, obj)
	});	
}

module.exports = router;