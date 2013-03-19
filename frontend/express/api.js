var GryphonAPI = (function(GryphonAPI, undefined){
	
	var _port = 7001;
	var _host = 'localhost';
	var _db = 'makina'

	var db = require('mongo-lite').connect('mongodb://' + _host + '/' + _db, ['metalib', 'matrix']);
	var restify = require('restify');
	var metalib;

	grabMetas();

	var server = restify.createServer();
	server.use(restify.jsonp());
	server.use(restify.gzipResponse());
	server.use(restify.bodyParser());
	server.post('/api/addRow', addRow);
	server.get('/api/getEntries', getEntries);
	server.listen(_port, function() {
		console.log('%s listening at %s on port %d', 'makina API', _host, _port);
	});

	function setPort (p) {
		_port = p;
	}

	function setHost (h) {
		_host = h;
	}

	function grabMetas () {
		metalib = [];
		db.metalib.all(function(err, docs){
			for(var i in docs){
				metalib[i] = docs[i];
			}
		});
	};

	function toRadix (N) {
		var HexN = "", Q = Math.floor(Math.abs(N)), R;
		var str = "abcdefghijklmnopqrstuvwxyz";
		while (true) {
			R = Q % str.length;
			HexN = str.charAt(R) + HexN;
			Q = (Q - R) / str.length; 
			if (Q == 0) break;
		}
		return (HexN);
	};

	function addRow (req, res) {
		res.header("Access-Control-Allow-Origin", "*"); 
		res.header("Access-Control-Allow-Headers", "X-Requested-With");

		var nrow = {};
		var row = req.params;
		var _ts = this;
		var newkey = '';

		for(var key in row){
			if(key === 'keyType' || key === 'keyReport' || key === 'keyTimeSlot' || key === 'timeStamp'){
				nrow[key] = row[key];

			}else{

				oldkey = '';
				loop:
				for(var ik in metalib) {
					if(metalib[ik].real === key) {
						oldkey = metalib[ik].meta;
						break loop;
					}else{
						oldkey = '';
					}
				}

				if(oldkey == '') {
					newkey = toRadix(metalib.length);
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
		db.matrix.insert(nrow, {'safe': true}, function(err, doc){
			theId = doc._id;
			res.send(doc[0]);
		})

	}

	function getEntries (req, res) {
		db.matrix.all(function(err, docs){
			res.send(docs);		
		})
	}

	function findAll (req, res) {
		db.collection('matrix', function(err, collection) {
			collection.find().toArray( function(err, items) {
				res.send(items);
			});
		});
	};

}(GryphonAPI = GryphonAPI || {}));