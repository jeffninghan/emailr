Emailr
======

Emails friends messages from custom templates every set time interval. It is a convenient way to keep in touch with people you may forget to talk to.

The public DNS for this automatic emailing service is:

http://ec2-54-187-209-80.us-west-2.compute.amazonaws.com/

If I decide to further develop the service, I will get a better DNS. But this EC2 domain will have to do for now :/

###Get Started!

Navigate to this address and get started! Login with an existing account or create a new account with your email and password. Note: the password must match the password used to login to your email, otherwise, the service cannot send emails from your account. I know this may seem sketchy but all the passwords are encrypted in the database and 

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

####Notes
There are many things that should probably be implemented (notice of message failures, template editing, etc) that are not done yet. If you really want them to be implemented, send me a message and I'll see what I can do. For the more adventurous, feel free to implement them yourself and I will merge them (after checking them over, of course!).

Also, if it your first time using this service, your email client may block this program from accessing your account when sending emails. You will have to allow this program access to your account for it to work.

####Running on localhost
If you wish to run this service on your own computer or server, all you need to do is have a mongohq account or some other mongo database you can connect to (both of which have free options). In the /src folder add a file named "connection.js" with the following code:

```
module.exports = {
    mongo: 'mongodb://<user>:<password>@<mongoaddress>:<port>/emailr'
}
```

The above example assumes you are using mongohq and setup a database called 'emailr'.

You will also need to add a file in /src called "secret.js" with the following:

```
module.exports = {
    key: 'SOME_ENCRYPTION_KEY',
    algorithm: 'SOME_ALGORITHM',
}
```

Look online for the documentation for the crypto node module for valid options for the algorithm field.

Then, you should be able to start up the service locally (or on another server) with the command:

```
$npm start
```

while in the /emailr folder. Point a browser to localhost:3000 and start emailing! You still need to create an account with an email corresponding email password but at least you can control how that sensitive data is handled.
