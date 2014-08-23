var express = require('express');
var account = require('../src/repository/account');
var contact = require('../src/repository/contact');
var email = require('../src/repository/email');
var template = require('../src/repository/template');
var helpers = require('../src/helpers')
var async = require('async');

var router = express.Router();

///////////////////////////////////////////////////////////////////////////////
//
//                     Template Routes
//
///////////////////////////////////////////////////////////////////////////////
router.post('/createTemplate', function(req, res) {
	var id = req.session.account._id;
	if (!id) { return res.redirect('/') }
	var inputs = formatTemplateResponse(req.body)
	var recipients = inputs.recipients
	var name = inputs.name
	var messages = inputs.messages
	var time = inputs.interval
	var interval = {interval: time, repeat: false}

	account.findOneById(id, function(err, account) {
		if (err) {
			return res.render('createtemplate', {error: {name: err.name, message: err.message}})
		}
		template.create(account, name, recipients, messages, interval, function(err, template) {
			return res.redirect('/')
		})
	})
})

router.post('/toggleTemplate/:templateId', function(req, res) {
	var templateId = req.params.templateId
	if (!templateId) { return res.render('index', {error: {name: 'Invalid Template', message: 'Unable to find template.'}}) }
	template.findOneById(templateId, function(err, template) {
		if (err) {
			return res.render('index', {error: {name: err.name, message: err.message}})
		}
		template.interval = {repeat: !template.interval.repeat, interval: template.interval.interval}
		template.save(function(err) {
			if (err) {
				return res.render('index', {error: {name: err.name, message: err.message}})
			}
			return res.redirect('/')
		})
	})
})

router.post('/editTemplate/:templateId', function(req, res) {
	var id = req.session.account._id;
	var templateId = req.params.templateId;
	var recipients = req.body.recipients
	var name = req.body.name
	var messages = req.body.messages
	var interval = req.body.interval;	
	template.findOneById(templateId, function(err, template) {
		if (err || !template || (template.owner._id != id)) {
			return res.render('index', {error: {name: 'Template Error', message: 'Unable to delete template.'}})
		}
		template.recipients = (recipients == undefined) ? template.recipients : recipients;
		template.name = (name == undefined) ? template.name : name;
		template.messages = (messages == undefined) ? template.messages : messages;
		template.interval = (interval == undefined) ? template.interval : interval;
		template.save(function(err) {
			if (err) {
				return res.render('index', {error: {name: 'Template Error', message: 'Unable to save edited template.'}})
			}
			return res.redirect('/')
		})
	})
})

router.post('/deleteTemplate/:templateId', function(req, res) {
	var id = req.session.account._id;
	if (!id) { return res.redirect('/') }
	var templateId = req.params.templateId;
	template.findOneById(templateId, function(err, template) {
		if (err || !template || (template.owner._id != id)) {
			return res.render('index', {error: {name: 'Template Error', message: 'Unable to delete template.'}})
		}
		template.remove(function(err) {
			if (err) {
				return res.render('index', {error: {name: 'Template Error', message: 'Unable to delete template.'}})
			}
			return res.redirect('/')
		})
	})
})

///////////////////////////////////////////////////////////////////////////////
//
//                     Contact Routes
//
///////////////////////////////////////////////////////////////////////////////
router.post('/createContact', function(req, res) {
	var id = req.session.account._id;
	if (!id) { return res.redirect('/') }
	var name = req.body.name;
	var email = req.body.email;
	if (!name || !email) { 
		return res.render('createcontact', {error: {name: 'Invalid Input', message: 'Input fields are missing.'}})
	}
	if (!helpers.checkEmailFormat(email)) {
		return res.render('createcontact', {error: {name: 'Invalid Input', message: 'Email is incorrectly formatted.'}})
	}
	account.findOneById(id, function(err, account) {
		if (err) {
			return res.render('index', {error: {name: err.name, message: err.message}})
		}
		contact.create(account, name, email, function(err, contact) {
			if (err) {
				return res.render('createcontact', {error: {name: err.name, message: err.message}})
			}
			return res.redirect('/')
		})
	})
})

router.post('/deleteContact/:contactId', function(req, res) {
	var id = req.session.account._id;
	if (!id) { return res.redirect('/') }
	var contactId = req.params.contactId
	contact.findOneById(contactId, function(err, contact) {
		if (err || !contact) {
			return res.render('index', {error: {name: 'Contact Error', message: 'Unable to delete contact.'}})
		}
		contact.remove(function(err) {
			if (err) {
				return res.render('index', {error: {name: err.name, message: err.mesage}})
			}
			return res.redirect('/')
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
			messages[key] = stringToArray(body[key])
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

module.exports = router;