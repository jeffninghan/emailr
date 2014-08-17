emailr
======

automatic emailing client

'/:id/createTemplate'

'/:id/editTemplate/:templateId'

'/:id/deleteTemplate/:templateId'

'/:id/createContact'

'/:id/deleteContact/:contactId'

'/:id/getEmails'

'/:id/getContacts'

'/:id/getTemplates'

Account
	  	email: { type: String, required: true},
	  	password: { type: String, required: true},
	  	name: { type: String, required: false},
	  	dateCreated: { type: Date, default: Date.now }

Template
		owner: { type: Object, required: true},
		recipients: [{type: String, required: false}], //ObjectIds
		messages: { type: Object, required: true},
			{
				subjects: [type: String],
				greetings: [type: String],
				messages: [type: String],
				signatures: [type: String]
			}

		interval: { type: Object, required: true},
			{
				repeat: Boolean,
				interval: Integer (in seconds)
			}
		dateCreated: { type: Date, default: Date.now }
		dateLastSent: { type: Date, default: Date.now }

Contact
		owner: {type: Object, required: true},
		name: { type: String, required: true},
		email: { type: String, required: true},
		dateCreated: { type: Date, default: Date.now }

Email
		sender: { type: Object, required: true},
		recipient: { type: Object, required: true},
		subject: { type: String, required: true},
		message: { type: String, required: true},
		date: { type: Date, default: Date.now }