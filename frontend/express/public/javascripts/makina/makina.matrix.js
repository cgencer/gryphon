var mongo = require('mongodb');

var Server = mongo.Server,
		Db = mongo.Db,
	  BSON = mongo.BSONPure;

var db = require('mongo-lite').connect('mongodb://localhost/makina', ['metalib', 'matrix']);
var metalib;
var grabMetas = function () {
	metalib = [];
	db.metalib.all(function(err, docs){
		for(var i in docs){
			metalib[i] = docs[i];
		}
	});
};
var toRadix = function (N) {
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
grabMetas();

exports.addRow = function(req, res) {
	var nrow = {};
	var row = req.body;
	var _ts = this;
	var newkey = '';

	for(var key in row){

		if(key === 'keyType' || key === 'keyReport' || key === 'keyTimeSlot'){
			nrow[key] = row[key];												// copy these 3 columns directly

		}else{
			newkey = '';
			for(var mi in metalib) {
				if(metalib[mi].real === key){
					newkey = metalib[mi].meta;
					break;
				}
			}
			if(newkey === ''){												// insert new key into db and fetch new metalib
				newkey = toRadix(metalib.length);
				var insobj = {'meta': newkey, 'real':key};
				db.metalib.insert(insobj, function(err, doc){})
				grabMetas();
			}
			if(newkey !== ''){
				nrow[newkey] = row[key];
			}
		}
	}
	db.matrix.insert(nrow, function(err, doc){
		theId = doc._id;
	})



//		row.keyTimeSlot
		

}

exports.findAll = function(req, res) {
	db.collection('matrix', function(err, collection) {
		collection.find().toArray( function(err, items) {
			res.send(items);
		});
	});
};


