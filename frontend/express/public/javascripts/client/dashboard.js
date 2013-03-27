var GryphonDashboard = (function(GryphonDashboard, $, undefined){

	var tables = {'root':{'name':''}};
	tableVisibleCols = [
		{'mData':'test'},
		{'mData':'column'},
		{'mData':'other'}
	];
	google.load('visualization', '1.0', {'packages':['corechart', 'table', 'geochart']});

	function sMenuReceived(package) {
		console.dir(package);
	}
	function fMenuReceived(package) {
		console.dir(package);
	}
	function getContent() {
	    return  $('#containerForCalendar').html();
	};

	$(document).ready( function() {

		$.datepicker.setDefaults( $.datepicker.regional['en'] );
		$("#containerForCalendar").datepicker({'numberOfMonths':2});
		$('a[rel=tooltip]').popover({'html':true, 'trigger':'click', 'placement':'bottom', 'content': getContent()});

		$("#create-widget").click( function(){
			var options={
				"url": "http://makina.nmdapps.com/Events/Report/MAKINA/CIRawReport",
				"refreshTime": 20,
				"fetchOptions": [
					{
						"type":"sum", // sum, group by
						"name":"fetch 1",
						"byColumns":[], // group bys
						"columns":['timeslotCLICK','timeslotINSTALL'],// city,app,company
						"fetchCallBack": fetchCallBackSum
					}, {
						"type":"groupby", // sum, group by
						"name":"fetch 2",
						"byColumns":['CountryCode','City'], // group bys
						"columns":['timeslotCLICK','timeslotINSTALL'],// city,app,company
						"fetchCallBack": fetchCallBackGroupBy
					}, {
						"type":"groupby", // sum, group by
						"name":"fetch 3",
						"byColumns":['CountryCode'], // group bys
						"columns":['timeslotCLICK','timeslotINSTALL'],// city,app,company
						"fetchCallBack": fetchCallBackGroupBy2
					}
				],
				"responseSuccessCallBack" : responseSuccessCallBack,
				"responseErrorCallBack": responseErrorCallBack
			};
			var widget1 =  new HandsomeWidget(options,"widget-console");

			console.log("widget1");
			console.log(widget1);
		});

		$('.fg-toolbar.ui-widget-header').prepend( $('#filterBySecondaryDimension').html() );

		var rowsEx = {
			'columns': [
				{'visible': true, order:2, 'cvname':'test'},
				{'visible': true, order:0, 'cvname':'column'},
				{'visible': true, order:1, 'cvname':'other'}
			],
			'rows': [
				{
					'test': 0,
					'column': 'sdfs',
					'other': 'xxx'
				}, {
					'test': 5,
					'other': 'xxx',
					'column': 'sdfs'
				}, {
					'test': 5,
					'column': 'sdfs',
					'other': 'xxx'
				}, {
					'test': 5,
					'column': 'sdfs',
					'other': 'xxx'
				}
			]
		};

		drawTable (rowsEx);

		cuteNSexy.setPaths(amplify.store( 'paths'));
		cuteNSexy.setDictionary(amplify.store( 'dictionary'));
		
		$('.sideBar').height( $(window).height() );
		cuteNSexy.runChainedEvents([ {'cmd': 'GetMenuItems', 'success': sMenuReceived, 'fail': fMenuReceived, 'payload': {'userId':123} } ]);


	});

	function drawTable (pack) {

		var newcols = [];
		for(var ci=0; ci < Object.keys(pack.columns).length; ci++) {
			for(var col in pack.columns) {
				if(pack.columns[col].order === ci) {
					newcols.push({'cvname':pack.columns[col].cvname});
				}
			}
		}
		pack.columns = newcols;

		var dTbl = prepTableView( randomId(), pack, 'root', '#contentDataset', 'child' );

		$('a.fg-button')	.removeClass('fg-button')			.removeClass('ui-corner-tl')
							.removeClass('ui-corner-bl')		.removeClass('ui-corner-tl')
							.removeClass('ui-corner-bl')		.removeClass('ui-state-default')
							.removeClass('ui-state-disabled')
							.addClass('btn')					.addClass('btn-primary');

	};

	function prepTableView (name, pack, relation, into, children) {
		var hs = '', ts = '';
		tables[relation] = {};
		tableVisibleCols[relation] = [];
		tables[relation].name = name;
		$(into).html( $('#datasetTableTemplate').html() );
		console.log($(into).html());

		for(var col in pack.columns) {
			hs += '<td>' + pack.columns[col].cvname + '</td>';
			ts += '<td></td>';
			tableVisibleCols[relation].push( {'mData': pack.columns[col].cvname} );
		}
		$(into + ' table').attr('id', tables[relation].name);
		console.log(tables[relation].name);
		$('#' + tables[relation].name + ' thead tr').html(hs);
		$('#' + tables[relation].name + ' tbody tr').html(ts);

		if( $.fn.DataTable.fnIsDataTable( document.getElementById(tables[relation].name) ) ) {
			$('#'+tables[relation].name).dataTable().fnDestroy(true);
		}

		var dTbl = $('#'+tables[relation].name).dataTable({
			'aaData': pack.rows,
			'bProcessing': true,
			'bJQueryUI': true,
			'sPaginationType': 'full_numbers',
			'aoColumns': tableVisibleCols[relation],
		});
		tables[relation].rel = dTbl;

		if(children !== false) {
			$(document).on('click', '#' + tables[relation].name + ' tr', function () {
				if ( dTbl.fnIsOpen( this ) ) {
					dTbl.fnClose( this );
				} else {
					dTbl.fnOpen( this, "", "info_row" );

					tables[children] = {};
					tables[children].name = randomId();
					var dTblChild = prepTableView( randomId(), pack, children, '#'+tables[relation].name+' .info_row', 'grandchildren' );
					tables[children].rel = dTblChild;
				}
			});
		}

		return dTbl;
	}
	function randomId (len) {
		if(len == undefined){len = 36;}
		var s = [];
		var hexDigits = "0123456789abcdef";
		for (var i = 0; i < len; i++) {
			s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
		}
		return(s.join(""));
	};
    function fetchCallBackGroupBy (response){
        console.log("fetchCallBackGroupBy++++++++++++++");
        console.log(response);
        drawGeoMap(response.response);
    }
    function fetchCallBackSum (response){
        console.log("fetchCallBackSum++++++++++++++");
        console.log(response);
    }
    function responseSuccessCallBack (response){
console.log('-------------------------');
	console.dir(response);
		drawTable(response);
    }
    function responseErrorCallBack (response){
        console.log(" JSONP responseErrorCallBack")
    }
	function fetchCallBackGroupBy2 (response){
    }
    function drawGeoMap(arr){
        var chart = new google.visualization.GeoChart(document.getElementById("content-widget"));
        var data =[ ['Country', 'Click'] ];
        for(var i in arr){

            var item = arr[i];
            if(item["CountryCode"]=="TR"){

                var city = item["City"];
                var click = 0;
                if(item["timeslotCLICK"]!= undefined)
                    click =item["timeslotCLICK"]["c"];
                if(isNaN(click))
                    click =0;

                var dataItem =[city,click]
                data.push(dataItem);
            }
        }

        var options = {
            region: 'TR',
            displayMode: 'markers',
            colorAxis: {colors: ['green', 'blue']}
        };

        var dataTable = google.visualization.arrayToDataTable(data);
        chart.draw(dataTable, options);
    }


	return {
		'fetchCallBackGroupBy': 	fetchCallBackGroupBy,
		'fetchCallBackSum': 		fetchCallBackSum,
		'responseSuccessCallBack': 	responseSuccessCallBack,
		'responseErrorCallBack': 	responseErrorCallBack,
		'fetchCallBackGroupBy2': 	fetchCallBackGroupBy2,
	}


}(window.GryphonDashboard = window.GryphonDashboard || {}, jQuery));