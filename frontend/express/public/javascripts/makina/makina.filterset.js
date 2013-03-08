var filterTable = {
	'_ts': {},
	'cfdata': {},
	'tables': {'root':{'name':''}},

	init: function () {
		_ts = this;
		$('#content').text('booting up...');
		tables = {'root':{'name':''}};
		tables.root.name = GryphonHelpers.randomId();		

		$(document).on('click', '#' + tables.root.name + ' tr', function () {
			if ( tables.root.ref.fnIsOpen( this ) ) {
				tables.root.ref.fnClose( this );
			} else {
				tables.root.ref.fnOpen( this, "Temporary row opened", "info_row" );
				$('#' + tables.root.name + ' tr td.info_row').html('<div class="innerTables" />');
			}
		});

		_ts = this;
		$.ajax({
			url : "dataset.json",
			dataType: "json",
			error: function(jqXHR, textStatus, errorThrown) {
				if (jqXHR.status === 0) {
					_error = 'Not connect.\n Verify Network.';
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
				_ts.build(data);
			}
		});
	},
	build: function (data) {
		$('#content').text('loaded the file...');
		cfdata = crossfilter(data);
		$('#content').html( '<table id="' + tables.root.name + '" width="100%" />' );
		tables.root.ref = $('#'+tables.root.name).dataTable({
			'aaData': data,
			'bJQueryUI': true,
			'sPaginationType': "full_numbers",
			'aoColumns': [
				{'mData':'city'},
				{'mData':'country'},
				{'mData':'zip'},
				{'mData':'music'},
				{'mData':'eyecolor'},
			]
		});
	},
};
