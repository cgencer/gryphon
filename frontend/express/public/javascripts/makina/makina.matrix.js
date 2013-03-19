var mongo = require('mongodb');
var _ = require('underscore');
var restify = require('restify');
var server = restify.createServer();

server.post('/api/addRow', exports.addRow);
server.get('/api/getEntries', exports.getEntries);

server.listen(7001, function() {
	console.log('%s listening at %s', 'makina API', 'localhost');
});

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

	console.dir(row);

	for(var key in row){
console.log(">: "+key);

		if(key === 'keyType' || key === 'keyReport' || key === 'keyTimeSlot' || key === 'timeStamp'){
			nrow[key] = row[key];

		}else{

			console.log('-----------------------------');
			oldkey = '';
			loop:
			for(var ik in metalib) {
				console.log(ik+'___'+metalib[ik].real +'....'+ key);
				if(metalib[ik].real === key) {
					console.log('CATCHED!!!');
					oldkey = metalib[ik].meta;
					console.dir(metalib[ik]);
					console.log('OLDKEY: '+oldkey);
					break loop;
				}else{
					oldkey = '';
				}
			}
			console.log('OLDKEY: '+oldkey);

			if(oldkey == '') {
				newkey = toRadix(metalib.length);
				console.log("###"+newkey);
				var insobj = {'meta': newkey, 'real':key};
				db.metalib.insert(insobj, function(err, doc){
					metalib[metalib.length] = {'meta':doc.meta, 'real':doc.real};	// add the inserted meta also onto the metalib array
				});
				nrow[newkey] = row[key];
				console.log('NEWKEY: '+newkey);
			}else{
				console.log('OLDKEY: '+oldkey);
				nrow[oldkey] = row[key];
			}
			newkey = '';
		}
	}
	console.dir(nrow);
	db.matrix.insert(nrow, {'safe': true}, function(err, doc){
		theId = doc._id;
		res.send(doc[0]);
	})
}

exports.getEntries = function(req, res) {
	db.matrix.all(function(err, docs){
		res.send(docs);		
	})
}

exports.findAll = function(req, res) {
	db.collection('matrix', function(err, collection) {
		collection.find().toArray( function(err, items) {
			res.send(items);
		});
	});
};


