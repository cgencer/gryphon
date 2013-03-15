var Gryphon = (function(Gryphon, undefined){

	var express = require('express');
	var app = express.createServer();
	var matrix = require('./public/javascripts/makina/makina.matrix.js');
	var realm = require('express-http-auth').realm('Private Area');

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
		app.use(express.bodyParser());
	});

// FOR USING AUTH add private as middleware:
//	app.get('/api/getAll', private, matrix.findAll);

	app.get('/api/getAll', matrix.findAll);
	app.get('/api/getids', matrix.findAll);
	app.get('/api/getById/:id', matrix.findById);
	app.post('/api/addRow', matrix.addRow);
	app.put('/api/updateRow/:id', matrix.updateRow);
	app.delete('/api/deleteRow/:id', matrix.deleteRow);

	app.listen(7001);

}(Gryphon = Gryphon || {}));