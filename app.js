var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');

var routes = require('./routes/index');
var api = require('./routes/api');
var send = require('./src/email/send')
var methods = require('./routes/methods')

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.set('view options', { pretty: true });
app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(require('stylus').middleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({secret: '1234567890QWERTY', proxy: true}));

app.use('/', routes);
app.use('/api', api);
app.use('/methods', methods);

// Database setup
var mongoose = require("mongoose");
var _ = require("underscore");
var connection = require('./src/connection')
mongoose.connect(connection.mongo)

/// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.send(
        {   message: err.message,
            error: {}
        }
    );
});

// check every 10 seconds for emails to send
setInterval(function(){
    console.log('checking for emails to send')
    send.execute(function(err) {
        console.log('finished checking emails')
        return;
    })
}, 10000);

module.exports = app;
