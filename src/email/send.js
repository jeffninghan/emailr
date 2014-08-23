var account = require('../repository/account');
var contact = require('../repository/contact');
var email = require('../repository/email');
var template = require('../repository/template');
var helpers = require('../helpers');
var secret = require('../secret');
var async = require('async');
var nodemailer = require('nodemailer');
var crypto = require('crypto');

exports.passwordReset = function(email, cbk) {
	//check ivalid email
	account.findOneByEmail(email, function(err, account) {
		if (err || !account) { return cbk({name: 'Invalid Account', message: 'Account does not exist.'}, null)}
		var newPassword = helpers.generatePassword();
		account.password = helpers.encrypt(newPassword);
		account.save(function(err) {
			if (err) {
				return cbk(err, null)
			}
			var fullMessage = 'Hi ' + account.name + ', \n\n'
								+ 'Your Emailr password has been reset to: \n\n'
								+ newPassword + '\n\n'
								+ 'You can change this password when you login to Emailr. \n\n'
								+ 'Best Regards, \n\n'
								+ 'Emailr'

			var mailOptions = {
					from: secret.email,
					to: account.email,
					subject: 'Emailr Password Reset',
					text: fullMessage
				}
			var password = secret.emailPassword
			var smtpTransport = nodemailer.createTransport("SMTP",{
    				service: 'gmail',
    				auth: {
        				user: secret.email,
        				pass: password
    				}
			});
			console.log('sending email to: ' + account.email)
			smtpTransport.sendMail(mailOptions, function(err) {
				return cbk(err, null)
			})
		})
	})
}

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

