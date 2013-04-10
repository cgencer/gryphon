var Gryphon = (function(Gryphon, undefined){

	_ns = {};
	var express = require('express');
	var $ = require('jquery');
	var app = express.createServer();
	var realm = require('express-http-auth').realm('Private Area');
	var io = require('socket.io').listen(app);

	io.sockets.on('connection', function (socket) {
		socket.on('sendchat', function (data) {
		});
		socket.on('disconnect', function(){
		});
	});


	var checkUser = function(req, res, next) {
		if (req.username == 'Foo' && req.password == 'Bar') {
			next();
		} else {
			req.send(403);
		}
	}
	var private = [realm, checkUser];

	app.configure( function () {
		app.use(express.logger('dev'));			/* 'default', 'short', 'tiny', 'dev' */
	    var oneYear = 31557600000;
	    app.use(express.static(__dirname + '/public'), { maxAge:oneYear });
		app.use(express.bodyParser());
	});

// FOR USING AUTH add private as middleware:
//	app.get('/api/getAll', private, matrix.findAll);

//	einhorn.saveapp(app);
	app.get('/stern', getEntries);
	app.get('/login', login);
	app.get('/dashboard', dashboard);
	app.post('/dashboard', dashboard);
	app.get('/management', management);
	app.post('/management', management);

	app.get('/stern/selectby/:where/page/:begin/limit/:len', getEntries);
	app.post('/stern/selectby/:where/page/:begin/limit/:len', getEntries);

	app.listen(7002);
	
	function getEntries (req, res) {
		res.sendfile('views/index.html');
	};
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