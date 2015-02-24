var debug = require('debug')('travelqa');
var express = require('express');
var url = require('url');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var errorHandler = require('errorhandler');
var https = require('https');

var bmconf = require('./bmconf');

var app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.get('/', function (req, res) {

    var query = url.parse(bmconf.url + '/v1/question/travel');
    var options = {
	host: query.hostname,
	port: query.port,
	path: query.pathname,
	method: 'POST',
	headers: {
	    'Content-Type': 'application/json',
	    'Accept': 'application/json',
	    'X-synctimeout': '30',
	    'Authorization': bmconf.auth
	}
    };

    var watson_req = https.request(options, function(result) {
	result.setEncoding('utf-8');
	var response_string = '';
	result.on('data', function(chunk) {
	    response_string += chunk;
	});
	result.on('end', function() {
	    var answers = JSON.parse(response_string)[0];
	    return res.render('index', {'question': req.body.question, 'answers': answers});
	});
    });
    watson_req.on('error', function(err) {
	res.status(500);
	return res.render('error', {status: 500, message: err.message, error: {}});
    });
    var questionData = {
	'question': {
	    'evidenceRequest': {
		'items': 10
	    },
	    'questionText': req.body.question
	}
    };

    watson_req.write(JSON.stringify(questionData));
    watson_req.end();
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
	    status: err.status,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
	status: err.status,
        error: {}
    });
});

module.exports = app;

app.set('host', bmconf.host);
app.set('port', bmconf.port);

var server = app.listen(app.get('port'), function() {
  debug('Express server listening on port ' + server.address().port);
});

