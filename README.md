emailr
======

Emails friends messages from custom templates ever set interval.

Currently, you will need a mongohq account for this to work. Create a free account with a sandbox instance named 'emailr'. After cloning this git repository, create a file called connection.js in the '/src' folder that contains:
```
/src/connection.js

module.exports = { 	
	mongo: 'mongodb://<user>:<password>@<mongoaddress>:<port>/emailr'
}
```
Then, just navigate to the root emailr folder (where app.js resides) and type:
```
$npm start
```

Don't forget to install all the depenencies with '$npm install'.

Go to localhost:3000/ in a browser and get started!
