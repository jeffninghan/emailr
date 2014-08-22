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
//                     API Template Routes
//
///////////////////////////////////////////////////////////////////////////////
router.post('/:id/createTemplate', function(req, res) {
	var id = req.params.id;
	var recipients = req.body.recipients // sent as JSON.stringify
	var name = req.body.name
	var messages = req.body.messages
	var interval = req.body.interval
	account.findOneById(id, function(err, account) {
		if (err || (!account)) {
			return res.send({success: false, error: err, message: 'Unable to create template.'})
		}
		template.create(account, name, recipients, messages, interval, function(err, template) {
			return res.send({success: true, template: template});
		})
	})
})  

router.post('/:id/editTemplate/:templateId', function(req, res) {
	var id = req.params.id;
	var templateId = req.params.templateId;
	var recipients = req.body.recipients
	var name = req.body.name
	var messages = req.body.messages
	var interval = JSON.parse(req.body.interval);	
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

router.post('/:id/deleteTemplate/:templateId', function(req, res) {
	var id = req.params.id;
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
//                     API Contact Routes
//
///////////////////////////////////////////////////////////////////////////////
router.post('/:id/createContact', function(req, res) {
	var id = req.params.id;
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
			return res.send({success: true, contact: contact})
		})
	})
})

router.post('/:id/deleteContact/:contactId', function(req, res) {
	var id = req.params.id;
	var contactId = req.params.contactId
	contact.findOneById(contactId, function(err, contact) {
		if (err || !contact) {
			return res.send({success: false, error: err, message: 'Unable to delete contact.'})
		}
		contact.remove(function(err) {
			return res.send({success:true, contact: contact})
		})
	})
})


///////////////////////////////////////////////////////////////////////////////
//
//                     API Getter Routes
//
///////////////////////////////////////////////////////////////////////////////

router.get('/:id/getEmails', function(req, res) {
	var id = req.params.id
	email.findAllBySenderId(id, function(err, emails) {
		if (err) {
			return res.send({success: false, error: err, message: 'Unable to get emails.'})
		}
		return res.send({success:true, emails: emails});
	})
})

router.get('/:id/getContacts', function(req, res) {
	var id = req.params.id
	contact.findAllByOwnerId(id, function(err, contacts) {
		if (err) {
			return res.send({success: false, error: err, message: 'Unable to get contacts.'})
		}
		return res.send({success:true, contacts: contacts})
	})
})

router.get('/:id/getTemplates', function(req, res) {
	var id = req.params.id
	template.findAllByOwnerId(id, function(err, templates) {
		if (err) {
			return res.send({success: false, error: err, message: 'Unable to get templates.'})
		}
		return res.send({success:true, templates: templates})
	})
})

module.exports = router;