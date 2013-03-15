var mongo = require('mongodb');

var Server = mongo.Server,
		Db = mongo.Db,
	  BSON = mongo.BSONPure;

var db = require('mongo-lite').connect('mongodb://localhost/makina', ['metalib', 'matrix']);
var metalib = [];

function grabMetas() {
	metalib = [];
	db.metalib.all(function(err, docs){
		for(var i in docs){
			metalib[i] = docs[i];
		}
	});
}
grabMetas();

exports.findById = function(req, res) {
	var id = req.params.id;
	console.log('Retrieving matrix: ' + id);
	db.collection('matrix', function(err, collection) {
		collection.findOne({'_id':new BSON.ObjectID(id)}, function(err, item) {
			res.send(item);
		});
	});
};

function toRadix(N) {
	var HexN = "", Q = Math.floor(Math.abs(N)), R;
	var str = "abcdefghijklmnopqrstuvwxyz";
	while (true) {
		R = Q % str.length;
		HexN = str.charAt(R) + HexN;
		Q = (Q - R) / str.length; 
		if (Q == 0) break;
	}
	return (HexN);
}

exports.addRow = function(req, res) {
	var nrow = {};
	var row = req.body;
	var _ts = this;
	var newkey = '';

	for(var key in row){
		newkey = '';
		for(var mi in metalib) {
			if(metalib[mi].real === key){
				newkey = metalib[mi].meta;
				break;
			}
		}
		if(newkey === ''){
			// insert new key into db and fetch new metalib
			newkey = toRadix(metalib.length);
			var insobj = {'meta': newkey, 'real':key};
			db.metalib.insert(insobj, function(err, doc){})
			grabMetas();
		}
		if(newkey !== ''){
			nrow[newkey] = row[key];
		}
	}
	db.matrix.insert(row, function(err, doc){})
}


exports.getIds = function(req, res) {
	db.collection('matrix', function(err, collection) {
		collection.getIndexes().toArray( function(err, items) {
			res.send(items);
		});
	});
};

exports.findAll = function(req, res) {
	db.collection('matrix', function(err, collection) {
		collection.find().toArray( function(err, items) {
			res.send(items);
		});
	});
};


exports.updateRow = function(req, res) {

// http://docs.mongodb.org/manual/applications/create/#crud-create-update

	var id = req.params.id;
	var row = req.body;
	console.log('Updating matrix: ' + id);
	console.log(JSON.stringify(row));
	db.collection('matrix', function(err, collection) {
		collection.update({'_id':new BSON.ObjectID(id)}, row, {safe:true}, function(err, result) {
			if (err) {
				console.log('Error updating wine: ' + err);
				res.send({'error':'An error has occurred'});
			} else {
				console.log('' + result + ' document(s) updated');
				res.send(row);
			}
		});
	});
}

exports.deleteRow = function(req, res) {
	var id = req.params.id;
	console.log('Deleting row: ' + id);
	db.collection('matrix', function(err, collection) {
		collection.remove({'_id':new BSON.ObjectID(id)}, {safe:true}, function(err, result) {
			if (err) {
				res.send({'error':'An error has occurred - ' + err});
			} else {
				console.log('' + result + ' document(s) deleted');
				res.send(req.body);
			}
		});
	});
}
