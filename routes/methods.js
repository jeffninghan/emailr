var express = require('express');
var account = require('../src/repository/account');
var contact = require('../src/repository/contact');
var email = require('../src/repository/email');
var template = require('../src/repository/template');

var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res) {
	res.send('get to /')
});

router.post('/', function(req, res) {
	res.send('post to /')
})

///////////////////////////////////////////////////////////////////////////////
//
//                     Template Routes
//
///////////////////////////////////////////////////////////////////////////////
router.post('/createTemplate', function(req, res) {
	var id = String(req.session.account._id);
	var recipients = req.body.recipients // sent as JSON.stringify
	var name = req.body.name
	var messages = req.body.messages
	var interval = req.body.interval
	account.findOneById(id, function(err, account) {
		if (err || (!account)) {
			return res.send({success: false, error: err, message: 'Unable to create template.'})
		}
		template.create(account, name, recipients, messages, interval, function(err, template) {
			req.session.templates.push(template)
			return res.redirect('/')
		})
	})
})

router.post('/editTemplate/:templateId', function(req, res) {
	var id = String(req.session.account._id);
	var templateId = req.params.templateId;
	var recipients = req.body.recipients
	var name = req.body.name
	var messages = req.body.messages
	var interval = req.body.interval;	
	template.findOneById(templateId, function(err, template) {
		if (err || !template || (template.owner._id != id)) {
			return res.send({success: false, error: 'Unable to edit template.'})
		}
		template.recipients = (recipients == undefined) ? template.recipients : recipients;
		template.name = (name == undefined) ? template.name : name;
		template.messages = (messages == undefined) ? template.messages : messages;
		template.interval = (interval == undefined) ? template.interval : interval;
		template.save(function(err) {
			if (err) {
				return res.send({success: false, error: err, message: 'Error saving template'})
			}
			return res.send({success: true, template: template})
		})
	})
})

router.post('/deleteTemplate/:templateId', function(req, res) {
	var id = String(req.session.account._id);
	var templateId = req.params.templateId;
	template.findOneById(templateId, function(err, template) {
		if (err || !template || (template.owner._id != id)) {
			return res.send({success: false, err: err, message: 'Unable to delete template.'})
		}
		template.remove(function(err) {
			if (err) {
				return res.send({success: false, error: err, message: 'Error deleting template'})
			}
			return res.send({success: true, template: template})
		})
	})
})

///////////////////////////////////////////////////////////////////////////////
//
//                     Contact Routes
//
///////////////////////////////////////////////////////////////////////////////
router.post('/createContact', function(req, res) {
	var id = String(req.session.account._id);
	var name = req.body.name;
	var email = req.body.email;
	account.findOneById(id, function(err, account) {
		if (err || !account) {
			return res.send({success: false, error: err, message: 'Unable to find account.'})
		}
		contact.create(account, name, email, function(err, contact) {
			if (err) {
				return res.send({success: false, error: err, message: 'Unale to create contact.'})
			}
			req.session.contacts.push(contact)
			return res.redirect('/')
		})
	})
})

router.post('/deleteContact/:contactId', function(req, res) {
	var id = String(req.session.account._id);
	var contactId = req.params.contactId
	contact.findOneById(contactId, function(err, contact) {
		if (err || !contact) {
			return res.send({success: false, error: err, message: 'Unable to delete contact.'})
		}
		contact.remove(function(err) {
			//req.session.contacts.pop()
			return res.redirect('/')
		})
	})
})

module.exports = router;