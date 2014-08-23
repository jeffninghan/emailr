var key = require('./secret').key;
var algorithm = require('./secret').algorithm;
var crypto = require('crypto');

// various helper functions

exports.checkEmailFormat = function(email) {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

exports.parseMessage = function(message) {
    return message.split('\n');
}

exports.encrypt = function(text) {
    var cipher = crypto.createCipher(algorithm, key);  
    var encrypted = cipher.update(text, 'utf8', 'hex') + cipher.final('hex');
    return encrypted
}

exports.decrypt = function(text) {
    var decipher = crypto.createDecipher(algorithm, key);
    var decrypted = decipher.update(text, 'hex', 'utf8') + decipher.final('utf8');
    return decrypted
}