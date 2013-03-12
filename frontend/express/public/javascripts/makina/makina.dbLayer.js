var dbLayer = function(){

	var mongo = require('mongoskin');
	var makinaConfig = require('../../../config');

	var makinaDb = mongo.db(makinaConfig.mongodb.host + ':' + makinaConfig.mongodb.port + '/' + makinaConfig.mongodb.db + '?auto_reconnect');
	var db = require('mongodb').db;
	
	var Server = require('mongodb').Server;
	var server_config = new Server(makinaConfig.mongodb.host, makinaConfig.mongodb.port, {auto_reconnect:true, native_parser:true});

	var sessionDb = new db(makinaConfig.mongodb.db, server_config, {});



	insertSet = function () {
	}

};