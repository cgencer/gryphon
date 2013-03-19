var filterTable = (function(filterTable, $, undefined){

	var _ts = {};
	var cfdata = {};
	var tables = {'root':{'name':''}};
	var tableDef = [];
	var tableVisibleCols = [];

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

	$(document).on('click', '#' + tables.root.name + ' tr', function () {
		if ( tables.root.ref.fnIsOpen( this ) ) {
			tables.root.ref.fnClose( this );
		} else {
			tables.root.ref.fnOpen( this, "Temporary row opened", "info_row" );
			$('#' + tables.root.name + ' tr td.info_row').html('<div class="innerTables" />');
		}
	});

//	this.loadFromJSON('dataset.json');
	loadFromJSON('http://127.0.0.1:7001/api/getEntries');
	
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
		    { name : 'kids', type : 'number' },
		    { name : 'anumber', type : 'number' },
		    { name : 'weight', type : 'number' },
		    { name : 'moviespermonth', type : 'number' },
		    { name : 'wantchild', type : 'boolean' },
		    { name : 'ownhouse', type : 'boolean' },
		    { name : 'haspets', type : 'boolean' },
		    { name : 'bothwork', type : 'boolean' },
		    { name : 'yearlyholiday', type : 'boolean' },
		    { name : 'privateschool', type : 'boolean' },
		    { name : 'privateinsurance', type : 'boolean' },
		    { name : 'playlottary', type : 'boolean' },
		    { name : 'lottarybig', type : 'boolean' },
		    { name : 'playgames', type : 'boolean' },
		    { name : 'playgambling', type : 'boolean' },
		    { name : 'watchporn', type : 'boolean' },
		    { name : 'watchvideos', type : 'boolean' },
		    { name : 'ownlaptop', type : 'boolean' },
		    { name : 'owntablet', type : 'boolean' },
		    { name : 'ownsmartphone', type : 'boolean' },
		    { name : 'usesms', type : 'boolean' },
		    { name : 'usemms', type : 'boolean' },
		    { name : 'digitalphotos', type : 'boolean' },
		    { name : 'sharephotos', type : 'boolean' },
		    { name : 'usesocial', type : 'boolean' },
		    { name : 'usetwitter', type : 'boolean' },
		    { name : 'useecommerce', type : 'boolean' },
		    { name : 'ownasecondhouse', type : 'boolean' },
		    { name : 'ownstocks', type : 'boolean' },
		];
		filterTable.tableVisibleCols = [
			{'mData':'city'},
			{'mData':'country'},
			{'mData':'zip'},
			{'mData':'music'},
			{'mData':'eyecolor'},
			{'mData':'ownsmartphone'},
		];
	};

	function loadFromJSON (file) {
		_ts = this;

		$.ajax({
			url : file + '/get',
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
				console.dir(data);
				build(data);
			}
		});
	}

	function build (dp) {
		_ts = this;
		$('#content').text('loaded the file...');
		tables.root.dataset = new Miso.Dataset( {
			'data': dp,
			'columns': _ts.tableDefinitions
		} );
		tables.root.dataset.fetch({ 
			success : function() {
				console.log( this.columnNames() );
				filterThem( this );
//				dataFiltered( this );
			}
		});
	};

	function filterThem (df) {
		dataFiltered(
			df.rows( function (row) {
//				return row.ownsmartphone === true;
				return (row._id > 0) === true;
			})
		);
	};

	function dataFiltered (df) {
		console.log('>>> filtered result has '+df.length+' entries...');
		$('#content').html( '<table id="' + tables.root.name + '" width="100%" />' );
		tables.root.ref = $('#'+tables.root.name).dataTable({
			'aaData': df.toJSON(),
			'bJQueryUI': true,
			"sDom": 'T<"clear">lfrtip',
			"oTableTools": {
				"sSwfPath": "/swf/copy_csv_xls_pdf.swf"
	        },
//			'bProcessing': true,
			'sPaginationType': 'full_numbers',
//			'aoColumns': filterTable.tableVisibleCols,
			'aoColumnDefs': { 'bSearchable': true, 'aTargets': [ '_all' ] },		// TOCHECK
			'oColumnFilterWidgets': {												// TOCHECK
		        'aiExclude': [ 0, 6 ],
		        'sSeparator': ',  ',
		        'bGroupTerms': true,
		        'aoColumnDefs': [
		            { 'bSort': false, 'sSeparator': ' / ', 'aiTargets': [ 6 ] },
				]
			},
		});
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