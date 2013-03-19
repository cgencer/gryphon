var Gryphon = (function(Gryphon, undefined){

	_ns = {};
	var express = require('express');
	var app = express.createServer();
	var realm = require('express-http-auth').realm('Private Area');
	var einhorn = require('./public/javascripts/makina/makina.frontend.js');
	_ns.app = app;

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
	app.get('/stern', einhorn.stern);
	app.listen(7001);

}(Gryphon = Gryphon || {}));