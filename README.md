Emailr
======

Emails friends messages from custom templates every set time interval. It is a convenient way to keep in touch with people you may forget to talk to.

The public DNS for this automatic emailing service is:

'''
http://ec2-54-187-209-80.us-west-2.compute.amazonaws.com/
'''

If I decide to further develop the service, I will get a better DNS. But this EC2 domain will have to do for now :/

###Get Started!

Navigate to this address and get started! Login with an existing account or create a new account with your email and password. Note: the password must match the password used to login to your email, otherwise, the service cannot send emails from your account.

Add contacts and then create templates for automatic emailing. Don't forget to activate templates after creation to sending mail.

####Contacts
To create a contact, click on the "Add Contact" link. Description of each field is below:

| Field         | Description                                                             |
| --------------|-------------------------------------------------------------------------|
| Name          | Name of the contact.                                                    |
| Email Address | Email address of the contact. Emails to this contact will be sent here. |

####Templates
To create a template, click on the "Add Template" link. Description of each field is below:

| Field      | Description                                                                                                                                       |
|------------|---------------------------------------------------------------------------------------------------------------------------------------------------|
| Name       | Given name of the template.                                                                                                                       |
| Interval   | Interval in which emails will be sent. For example, choosing the interval to be "Daily" will send an email to all contacts in templates everyday. |
| Contacts   | Select contacts you wish to add to the template. These contacts will be emailed.                                                                  |
| Subjects   | Comma separated values for the email subject line. Each email will randomly select a subject from the input list to display.                      |
| Greetings  | Comma separated values for the email greeting line. Each email will randomly select a greeting from the input list to display.                    |
| Messages   | Comma separated values for the email message line. Each email will randomly select a message from the input list to display.                      |
| Signatures | Comma separated values for the signature subject line. Each email will randomly select a signature from the input list to display.                |

After creating a template, you will be redirected to the home screen. To start sending emails at the set interval, click on the "Activate" button next to the template you wish to active. The current time plus the template interval time will be when the first email is sent.

Sent emails will have the following form:

```
Subject: <Subject>

<Greeting> <First Name of Contact>,

<Message>

<Signature>,

<Your Name>
```

Again, each email is randomly generated from the given subject, greeting, message, and signature inputs. So the more values you add to each line, the less likely it is for your random emails to look the same.

There are many things that should probably be implemented (notice of message failures, template editing, etc) that are not done yet. If you really want them to be implemented, send me a message and I'll see what I can do. For the more adventurous, feel free to implement them yourself and I will merge them (after checking them over, of course!).
