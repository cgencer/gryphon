var Gryphon = (function(Gryphon, undefined){

	var http = require('http'),
	    express = require('express'),
		$ = require('jquery');
	    mongoStore = require('connect-mongodb'),
	    expose = require('express-expose'),
	    crypto = require('crypto'),
	    fs = require('fs'),
	    im = require('imagemagick'),
	    request = require('request');

	var mongo = require('mongoskin');
	var makinaConfig = require('./config');
	var makinaDb = mongo.db(makinaConfig.mongodb.host + ':' + makinaConfig.mongodb.port + '/' + makinaConfig.mongodb.db + '?auto_reconnect');
	var db = require('mongodb').db;
	var Server = require('mongodb').Server;

	var app = module.exports = express.createServer();

	app.configure(function () {
	    app.register('.html', require('ejs'));
	    app.set('views', __dirname + '/views');
	    app.set('view engine', 'html');
	    app.set('view options', {layout:false});
	    app.use(express.bodyParser({uploadDir:__dirname + '/uploads'}));
	    app.use(express.cookieParser());
	    app.use(express.methodOverride());
	    app.use(express.csrf());
	    app.use(app.router);
	    var oneYear = 31557600000;
	    app.use(express.static(__dirname + '/public'), { maxAge:oneYear });
	});

	app.configure('development', function () {
	    app.use(express.errorHandler({ dumpExceptions:true, showStack:true }));
	});

	app.configure('production', function () {
	    app.use(express.errorHandler());
	});

	app.get('/api/entry', function (req, res) {
		res.send('<b>its okay dude!</b>');
	});

	app.post('/inject', this.insertSet);
	app.put('/inject/:id', this.updateSet);

	app.listen(makinaConfig.web.port, 'localhost');

	insertSet = function () {
	}

	updateSet = function () {
	}

}(Gryphon = Gryphon || {}));