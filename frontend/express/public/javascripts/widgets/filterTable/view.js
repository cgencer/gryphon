var filterTable = (function(filterTable, $, undefined){

	var _ts;
	var cfdata = {};
	var tables = {'root':{'name':''}};
	var tableDef = [];
	var tableVisibleCols = [];

	var halo = 'x';

	_ts = this;
	prepData();
	var cuteNSexy = window.cuteNSexy || {};
	var ajaxDictionary = {
		'getEntries': {
			'mandatory': [],
			'clean': [ ],
			'check': [ ],
			'result': '',
		}
	}
	cuteNSexy.init('http://127.0.0.1', 'api', ajaxDictionary);

	$('#content').text('booting up...');
	tables = {'root':{'name':''}};
	tables.root.name = randomId();		

/*
	$(document).on('click', '#' + tables.root.name + ' tr', function () {
		if ( tables.root.ref.fnIsOpen( this ) ) {
			tables.root.ref.fnClose( this );
		} else {
			tables.root.ref.fnOpen( this, "Temporary row opened", "info_row" );
			$('#' + tables.root.name + ' tr td.info_row').html('<div class="innerTables" />');
		}
	});
*/
	
	var bigPacket = [];
	var farkPacket = [];
	var receivedPacket = [];
	var page = 1;

	function saveOurSouls (w, o) {
		tables.root[w] = o;
	}

	loadFromJSON('http://127.0.0.1:7001/api/getEntries', 1, 100, function (rec) {

		var t = new Miso.Dataset( {'data': rec} );
		saveOurSouls('dSet', t);
		t.fetch( { success: function() {

			var names = this.columnNames();
			var hs = '', ts = '';
			for(var col in names){
				hs += '<td>' + names[col] + '</td>';
				ts += '<td></td>';
			}
			$('#content table').attr('id', tables.root.name);
			$('#content table thead tr').html(hs);
			$('#content table tbody tr').html(ts);

			var set = this.toJSON();

			saveOurSouls('dTbl', $('#'+tables.root.name).dataTable({
				'aaData': set,
				'bProcessing': true,
				'bJQueryUI': true,
				'sPaginationType': 'full_numbers',
			    "aoColumns": filterTable.tableVisibleCols
			}));
			
		}});
	});

	page++;
	looper();

	function extract (dp) {
		receivedPacket = dp;
		var dset = tables.root['dSet'];
		var dtbl = tables.root['dTbl'];
		if(dp.length > 0) {
			for(var rp in dp) {
				bigPacket.push( dp[rp] );
				farkPacket.push( dp[rp] );
			}

			if(page % 20 === 0){		// render output every n calls 

				for(var rp in farkPacket) {
					dset.add( farkPacket[rp] );
				}
				dtbl.fnAddData( farkPacket, true );
				farkPacket = [];
			}
			page++;
			setTimeout(looper, 25);
		}else{
			if(farkPacket.length > 0) {
				dtbl.fnAddData( farkPacket, true );
				farkPacket = [];
			}
			build(bigPacket);
		}
	}
	function looper () {
		loadFromJSON('http://127.0.0.1:7001/api/getEntries', page, 100, function (rec) {
			extract(rec);
		});
	}



/*
	var socket = io.connect('http://localhost');
	socket.on('news', function (data) {
		socket.emit('my other event', { my: 'data' });
	});
*/
/*
	cuteNSexy.runChainedEvents( [ {	'cmd': 'getEntries', 
									'payload': {},
									'success': success,
									'fail': fail }
	] );
*/
	function success(package) {
		build (cuteNSexy.response);
	};

	function fail(err) {
		console.log('error received:\n'+err);
	};

	function prepData () {
		filterTable.tableDef = [
		    { name : 'timeStamp', 		type : 'number' },
		    { name : 'keyType', 		type : 'string' },
		    { name : 'keyReport', 		type : 'string' },
		    { name : 'keyTimeSlot', 	type : 'number' },
		    { name : 'Platform', 		type : 'string' },
		    { name : 'City', 			type : 'string' },
		    { name : 'Resolution', 		type : 'string' },
		    { name : 'Manufacturer', 	type : 'string' },
		    { name : 'CountryName', 	type : 'string' },
		    { name : 'OsVersion', 		type : 'string' },
		    { name : 'DeviceInfoId', 	type : 'string' },
		    { name : 'application', 	type : 'string' },
		];
		filterTable.tableVisibleCols = [
			{'mData':'timeStamp'},
			{'mData':'keyType'},
			{'mData':'keyReport'},
			{'mData':'keyTimeSlot'},
			{'mData':'Platform'},
			{'mData':'City'},
			{'mData':'Resolution'},
			{'mData':'Manufacturer'},
			{'mData':'CountryName'},
			{'mData':'OsVersion'},
			{'mData':'DeviceInfoId'},
			{'mData':'application'},
		];
	};

	function loadFromJSON (file, pg, len, cb) {
		_ts = this;

		$.ajax({
			url : file + '/' + pg + '/' + len + '/get',
			dataType: "jsonp",
			contentType: 'application/json',
			processData: true,
			cache: false,
			type: 'GET',
			error: function(jqXHR, textStatus, errorThrown) {
				if (jqXHR.status === 0) {
					_error = 'Not connect. Verify Network.';
				} else if (jqXHR.status == 404) {
					_error = 'Requested page not found. [404]';
				} else if (jqXHR.status == 500) {
					_error = 'Internal Server Error [500].';
				} else if (textStatus === 'parsererror') {
					_error = 'Requested JSON parse failed.';
				} else if (textStatus === 'timeout') {
					_error = 'Time out error.';
				} else if (textStatus === 'abort') {
					_error = 'Ajax request aborted.';
				} else {
					_error = 'Uncaught Error.\n' + jqXHR.responseText;
				}
				console.log(_error);
			},
			success : function (data) {
				cb(data);
			}
		});
	}

	function build (dp) {
		console.log('finished loading the file...');
		tables.root.dataset = new Miso.Dataset( {
			'data': dp,
			'columns': tableDef
		} );
		tables.root.dataset.fetch({ 
			success : function() {
				filterThem( this );
			}
		});
	};

	function filterThem (df) {
		dataFiltered(
//			df.groupBy('city', ['resolution']));

			df.rows( function (row) {
				return (row.timeStamp > 0) === true;
			})

		);
	};

	function dataFiltered (df) {
		var _ts = this;
		var dfj = df.toJSON();
		console.log('>>> filtered result has '+df.length+' entries and '+df._columns.length+' columns...');

		var dTbl = $('#'+tables.root.name).dataTable({
//			'aaData': rows,
			'bProcessing': true,
			'bJQueryUI': true,
//		    'bDeferRender': true,
			'sPaginationType': 'full_numbers',
//			'aoColumns': tableVisibleCols,
//			'sDom': 'T<"clear">lfrtip',
//			'oTableTools': {
//				'sSwfPath': "/swf/copy_csv_xls_pdf.swf"
//	        },
		});
		var test = df.toJSON();
//
		console.dir(test)
		$('#'+tables.root.name).dataTable().fnAddData( df.toJSON() );
		
//		
		
/*
			'aaData': df.toJSON(),
			'bProcessing': true,
			'bJQueryUI': true,
		    'bDeferRender': true,
			'sPaginationType': 'full_numbers',
			'aoColumns': tableVisibleCols,
			'sDom': 'T<"clear">lfrtip',
			'oTableTools': {
				'sSwfPath': "/swf/copy_csv_xls_pdf.swf"
	        },
//			'aoColumnDefs': { 'bSearchable': true, 'aTargets': [ '_all' ] },
			'aoColumnDefs': { 'bVisible': false, 'aTargets': [0] },
		});

*/
/*
/*
			'oColumnFilterWidgets': {												// TOCHECK
		        'aiExclude': [ 0, 6 ],
		        'sSeparator': ',  ',
		        'bGroupTerms': true,
		        'aoColumnDefs': [
		            { 'bSort': false, 'sSeparator': ' / ', 'aiTargets': [ 6 ] },
				]
			},

*/
	};

	function randomId (len) {
		if(len == undefined){len = 36;}
		var s = [];
		var hexDigits = "0123456789abcdef";
		for (var i = 0; i < len; i++) {
			s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
		}
		return(s.join(""));
	};

}(window.filterTable = window.filterTable || {}, jQuery));