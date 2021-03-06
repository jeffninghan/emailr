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

exports.orderByAttribute = function(arr, attr, order) {
    var direction = (order == 'asc') ? false : true
    function compare(a,b) {
        if (a[attr] < b[attr])
            return (direction) ? -1 : 1;
        if (a[attr] > b[attr])
            return (direction) ? 1 : -1;
        return 0;
    }

    arr.sort(compare);
    return arr
}

exports.generatePassword = function() {
    return  Math.random().toString(36).slice(-8)
}