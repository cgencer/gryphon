var Gryphon = (function(Gryphon, undefined){

    var express = require('express');
    var app = express.createServer();

	app.configure( function () {
		app.use(express.logger('dev'));
	    var oneYear = 31557600000;
	    app.use(express.static(__dirname + '/public'), { maxAge:oneYear });
		app.use(express.bodyParser());
	});

	app.get('/login', login);
	app.get('/dash', dashboard);
	app.post('/dash', dashboard);
	app.get('/mng', management);
	app.post('/mng', management);
	app.use(function(req, res, next) {
//		res.contentType('text/html; charset=ISO-8859-1');
		res.charset = 'ISO-8859-1';
		res.header('Content-Type', 'text/html; charset=ISO-8859-1');
		next();
	});

	app.listen(80);

	function login (req, res) {
		if(req.params.formSent === 'true'){
		}
		res.sendfile('views/login.html');
	};
	function dashboard (req, res) {
		res.sendfile('views/dashboard.html');
	};
	function management (req, res) {
		res.sendfile('views/management.html');
	};

}(Gryphon = Gryphon || {}));