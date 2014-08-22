var express = require('express');
var account = require('../src/repository/account');
var contact = require('../src/repository/contact');
var email = require('../src/repository/email');
var template = require('../src/repository/template');
var async = require('async');

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
	var inputs = formatTemplateResponse(req.body)
	var recipients = inputs.recipients //req.body.recipients // sent as JSON.stringify
	var name = inputs.name //req.body.name || 'no name';
	var messages = inputs.messages //req.body.messages
	var time = inputs.interval
	var interval = {interval: time, repeat: false} //req.body.interval

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

router.post('/toggleTemplate/:templateId', function(req, res) {
	var templateId = req.params.templateId
	template.findOneById(templateId, function(err, template) {
		if (err || !template) {
			return res.send({success: false, error: 'Unable to toggle template.'})
		}
		template.interval = {repeat: !template.interval.repeat, interval: template.interval.interval}
		var idx = findElementIndexById(req.session.templates, templateId)
		req.session.templates[idx].interval.repeat = template.interval.repeat
		template.save(function(err) {
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
			var idx = findElementIndexById(req.session.templates, templateId)
			req.session.templates.splice(idx, 1);
			return res.redirect('/') //res.send({success: true, template: template})
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
			var idx = findElementIndexById(req.session.contacts, contactId)
			var deletedContactId = req.session.contacts[idx]._id;
			req.session.contacts.splice(idx, 1);
			var templates = req.session.templates;

			var removeContactFromTemplate = function(temp, cbk) {
				var tempId = temp._id;
				template.findOneById(tempId, function(err, t) {
					var i = t.recipients.indexOf(deletedContactId)
					if (i !== -1) { 
						t.recipients = t.recipients.splice(i, 1);
					}
					t.save(function(err) {
						return cbk();
					})
				})
			}

			async.forEachSeries(templates, removeContactFromTemplate, function(err) {
				return res.redirect('/')
			})

		})
	})
})

var formatTemplateResponse = function(body) {
	var keys = Object.keys(body)
	var template = {}
	var messages = {}
	var recipients = []
	var name = 'no name'
	var interval = 0
	for (var key in body) {
		if (key.indexOf('contactId-') == 0) {
			var id = key.replace('contactId-', '')
			recipients.push(id)
		}
		else if (key === 'name') {
			name = body[key]
		}
		else if (key === 'interval') {
			interval = body[key]
		}
		else {
			messages[key] = stringToArray(body[key]) //.split(',')
		}
	}
	template['messages'] = messages
	template['recipients'] = recipients
	template['name'] = name
	template['interval'] = getSeconds(interval)
	console.log(template)
	return template;
}

var getSeconds = function(interval) {
	var time = interval.toLowerCase()
	var time = time.trim()
	switch(time) {
	    // case 'now':
	    //     return 0
	    case 'hour':
	        return 60 * 60
	    case 'day':
	    	return 60 * 60 * 24
	    case 'week':
	    	return 60 * 60 * 24 * 7
	    case 'month':
	    	return 60 * 60 * 24 * 30
	    case 'year':
	    	return 60 * 60 * 24 * 365
	    default:
	        return 100000000000000
	}
}

var stringToArray = function(str) {
	var arr = str.split(',')
	for (var i = 0; i < arr.length; i ++) {
		arr[i] = arr[i].trim()
	}
	return arr
}

var findElementIndexById = function(arr, id) {
	for (var i = 0; i < arr.length; i ++) {
		if (arr[i]._id == id) {
			return i
		}
	}
}

module.exports = router;