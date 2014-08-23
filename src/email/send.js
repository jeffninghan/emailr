var account = require('../repository/account');
var contact = require('../repository/contact');
var email = require('../repository/email');
var template = require('../repository/template');
var helpers = require('../helpers');
var async = require('async');
var nodemailer = require('nodemailer');
var crypto = require('crypto');

exports.execute = function(cbk) {
	account.findAll(function(err, accounts) {
		async.forEachSeries(accounts, checkTemplates, function(err) {
			return cbk(err);
		});

	})
}

var checkTemplates = function(account, cbk1) {
	var id = String(account._id)
	template.findAllByOwnerId(id, function(err, temps) {
		async.forEachSeries(temps, checkEmails, function(err) {
			return cbk1(err);
		})
	})
}

var checkEmails = function(temp, cbk2) {
	var interval = temp.interval.interval
	var time = Math.floor(Date.now()/1000)
	var dateLastSent = Math.floor(temp.dateLastSent/1000)
	if (temp.interval.repeat && (time > (dateLastSent+interval))) {
		temp.dateLastSent = Date.now()
		temp.save(function(err) {
			sendEmail(temp, function(err) {
				return cbk2(err);
			})
		})
	}
	else {
		return cbk2();
	}
}

var sendEmail = function(template, cbk3) {

	var emailer = function(recipient, cbk4) {
		contact.findOneById(recipient, function(err, contact) {
			if (!contact) {
				return cbk4(err)
			}
			var message = template.messages.messages[Math.floor(Math.random() * template.messages.messages.length)]
			var subject = template.messages.subjects[Math.floor(Math.random() * template.messages.subjects.length)]
			var greeting = template.messages.greetings[Math.floor(Math.random() * template.messages.greetings.length)]
			var signature = template.messages.signatures[Math.floor(Math.random() * template.messages.signatures.length)]
			var senderEmail = template.owner.email
			var senderName = template.owner.name
			var recipientEmail = contact.email
			var recipientName = contact.name.split(' ')[0]
			var carrier = senderEmail.split('@')[1].split('.')[0]
			
			var fullMessage = greeting + ' ' + recipientName + ', \n\n'
								+ message + '\n\n'
								+ signature + ',\n'
								+ senderName;

			var mailOptions = {
				from: senderEmail,
				to: recipientEmail,
				subject: subject,
				text: fullMessage
			}
			var password = helpers.decrypt(template.owner.password)
			var smtpTransport = nodemailer.createTransport("SMTP",{
    				service: carrier,
    				auth: {
        				user: senderEmail,
        				pass: password
    				}
			});
			console.log('sending email to: ' + recipientEmail)
			smtpTransport.sendMail(mailOptions, function(err) {
				email.create(template.owner, contact, subject, fullMessage, function(err, m) {
					return cbk4(err);
				})
			})
		})
	}

	async.forEachSeries(template.recipients, emailer, function(err) {
		cbk3(err)
	})
}

