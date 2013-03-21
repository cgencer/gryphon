var GryphonAPI = (function(GryphonAPI, undefined) {
	
	var _port = 7001;
	var _host = 'localhost';
	var _db = 'makina'

	var db = require('mongo-lite').connect('mongodb://' + _host + '/' + _db, ['metalib', 'matrix']);
	var restify = require('restify');
	var querystring = require('querystring');
	var metalib;

	grabMetas();

	var server = restify.createServer();
	server.use(restify.jsonp());
	server.use(restify.gzipResponse());
	server.use(restify.bodyParser());
	server.post('/api/addRow', addRow);
//	server.get('/api/getEntries/:begin/:len/get?callback=:remainer', getEntries);
//	server.post('/api/getEntries/:begin/:len/get?callback=:remainer', getEntries);
	server.get('/api/getEntries/selectby/:where/page/:begin/limit/:len/get?callback=:remainer', getEntries);
	server.post('/api/getEntries/selectby/:where/page/:begin/limit/:len/get?callback=:remainer', getEntries);
	server.listen(_port, function() {
		console.log('%s listening at %s on port %d', 'makina API', _host, _port);
	} );
//http://127.0.0.1:7001/api/getEntries/?callback=jQuery18305745645841410649_1363710295214
//http://127.0.0.1:7001/api/getEntries/?callback=jQuery18308050109725557517_1363710144930&_=1363710145410
	function setPort (p) {
		_port = p;
	}

	function setHost (h) {
		_host = h;
	}

	function grabMetas () {
		metalib = [];
		db.metalib.all(function(err, docs) {
			for(var i in docs) {
				metalib[i] = docs[i];
			}
		} );
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

	function addRow (req, res, next) {
		res.header("Access-Control-Allow-Origin", "*");
		res.header("Access-Control-Allow-Headers", "X-Requested-With");

		var nrow = {};
		var row = req.params;
		var _ts = this;
		var newkey = '';

		for(var key in row) {
			if(key === 'keyType' || key === 'keyReport' || key === 'keyTimeSlot' || key === 'timeStamp') {

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
					db.metalib.insert(insobj, function(err, doc) {
						metalib[metalib.length] = {'meta':doc.meta, 'real':doc.real};	// add the inserted meta also onto the metalib array
					} );
					nrow[newkey] = row[key];
					console.log('NEWKEY: '+newkey);
				}else{
					console.log('OLDKEY: '+oldkey);
					nrow[oldkey] = row[key];
				}
				newkey = '';
			}
		}
		db.matrix.insert(nrow, {'safe': true}, function(err, doc) {
			theId = doc._id;
			res.send(doc[0]);
		} );
		return next();
	}

	function getEntries (req, res, next) {
		res.header("Access-Control-Allow-Origin", "*"); 
		res.header("Access-Control-Allow-Headers", "X-Requested-With");
		var nrows = [];

//querystring.parse
		var nw = [];

		if(req.params.where !== '-'){
			var where = querystring.parse(req.params.where);
			if(Object.keys(where).length > 0) {
				for(var wi in where) {
					console.log('key: '+wi+' val:'+where[wi]);
					loopW:
					for(var ik in metalib) {
						if(metalib[ik].real === wi) {
							oldkey = metalib[ik].meta;
							nw[oldkey] = where[wi];
							break loopW;
						}else{
							oldkey = '';
						}
					}
				}
			}
		}

		db.matrix.find(nw).paginate(req.params.begin, req.params.len).all( function(err, docs) {

			for(var rowid in docs) {
				var nrow = {};
				var row = docs[rowid];
				for(var key in row) {
					if(key === 'keyType' || key === 'keyReport' || key === 'keyTimeSlot' || key === 'timeStamp') {
						nrow[key] = row[key];
					}else if(key === '_id'){
						oldkey = '';
					}else{
						oldkey = '';
						loopSR:
						for(var ik in metalib) {
							if(metalib[ik].meta === key) {
								oldkey = metalib[ik].real;
								nrow[oldkey] = row[key];
								break loopSR;
							}else{
								oldkey = '';
							}
						}
					}
				}
				nrows.push(nrow);
			}

			var body = JSON.stringify(nrows);
			res.writeHead(200, {
				'Content-Type': 'application/json; charset=UTF-8'
			});
			res.write(req.query.callback + '(' + body + ');');
			res.end();
		} );
		return next();
	}

	function findAll (req, res) {
		db.collection('matrix', function(err, collection) {
			collection.find().toArray( function(err, items) {
				res.send(items);
			} );
		} );
	};

}(GryphonAPI = GryphonAPI || {} ));