var GryphonDashboard = (function(GryphonDashboard, $, undefined){

	var tables = {'root':{'name':''}};
	var widget1;
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
		                    "url":"http://makina.nmdapps.com/Events/Report/MAKINA/CIRawReport",
		                   /// "url":"http://192.168.10.13/Events/Report/MAKINA/CIRawReport",
		                    "refreshTime":1000,
		                    "fetchOptions":[
		                       {
		                            "id": "1",
		                            "type": "sum", // sum, group by
		                            "name": "fetch 1",
		                            "byColumns": null, // group bys
		                            "columns": ['timeslotCLICK','timeslotINSTALL'],// city,app,company
		                            "fetchCallBack": fetchCallBackSum
		                        },
/*		                        {
		                            "id":"2",
		                            "type":"groupby", // sum, group by
		                            "name":"fetch 2",
		                            "byColumns":['CountryCode','City'], // group bys
		                            "byValues" :null,
		                            "columns":['timeslotCLICK','timeslotINSTALL'],// city,app,company
		                            "fetchCallBack": fetchCallBackGroupBy1
		                        },
		                        {
		                            "id":"3",
		                            "type":"groupby", // sum, group by
		                            "name":"fetch 2",
		                            "byColumns":['Platform'], // group bys
		                            "byValues" :['Android'],
		                            "columns":['timeslotCLICK','timeslotINSTALL'],// city,app,company
		                            "fetchCallBack": fetchCallBackGroupBy2
		                        },
		                        {
		                            "id":"4",
		                            "type":"keyvalues", // sum, group by
		                            "name":"fetch 3",
		                            "byColumns":['CountryCode','CountryName'], // group bys
		                            "byValues":null,
		                            "columns":null,// city,app,company
		                            "fetchCallBack": fetchCallBackGroupBy3
		                        }
*/
		                    ],
		                    "responseSuccessCallBack" : responseSuccessCallBack,
		                    "responseErrorCallBack": responseErrorCallBack,
		                    "responseColumnsCallBack":responseColumnsCallBack
		                };
			widget1 =  new HandsomeWidget(options, 'widget-console');
            //HandsomeWidget
            //HandsomeWidget.prototype.AddEvent(event)
            //HandsomeWidget.prototype.RemoveEvent(id) --- RemoveEvent(1);
            //HandsomeWidget.prototype.GetRowColumns ---  return columns
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
		// ensure that all paging buttons remain in-design...
		$(document).on('click', '.btn, .fg-button' , function () {
			$('a.fg-button')			.removeClass('fg-button')			.removeClass('ui-corner-tl')
										.removeClass('ui-corner-bl')		.removeClass('ui-corner-tl')
										.removeClass('ui-corner-bl')		.removeClass('ui-state-default')
										.removeClass('ui-state-disabled')
										.addClass('btn')					.addClass('btn-primary');
		});

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

		
		$('a.fg-button')			.removeClass('fg-button')			.removeClass('ui-corner-tl')
									.removeClass('ui-corner-bl')		.removeClass('ui-corner-tl')
									.removeClass('ui-corner-bl')		.removeClass('ui-state-default')
									.removeClass('ui-state-disabled')
									.addClass('btn')					.addClass('btn-primary');

		$('a.DTTT_button')			.removeClass('ui-button')			.removeClass('ui-state-default')
									.removeClass('DTTT_button')
									.addClass('btn')					.addClass('btn-primary');

		$('button.ColVis_Button')	.removeClass('ui-button')			.removeClass('ui-state-default')
									.removeClass('ColVis_Button')
									.addClass('btn')					.addClass('btn-primary');


//ColVis_Button TableTools_Button ui-button ui-state-default ColVis_MasterButton
	};

	function prepTableView (name, pack, relation, into, children) {
		var hs = '', ts = '';
		tables[relation] = {};
		tableVisibleCols[relation] = [];
		tables[relation].name = name;
		$(into).html( $('#datasetTableTemplate').html() );

		for(var col in pack.columns) {
			hs += '<td>' + pack.columns[col].cvname + '</td>';
			ts += '<td></td>';
			tableVisibleCols[relation].push( {'mData': pack.columns[col].cvname} );
		}
		$(into + ' table').attr('id', tables[relation].name);

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
/*
			'bStateSave': true,
			'fnStateSave': function (oSettings, oData) {
				$.ajax({
					'url': '/state_save',
					'data': oData,
					'dataType': 'json',
					'method': 'POST',
					'success': function () {}
				});
			},
			'fnStateLoad': function (oSettings, oData) {
				var o;
				$.ajax({
					'url': '/state_load',
					'async': false,
					'dataType': 'json',
					'success': function (json) {
						o = json;
					}
				});
			},
*/
			'aoColumns': tableVisibleCols[relation],
			'sScrollX': $('.span12').width(),//'100%',
			'bScrollCollapse': true,
			'sScrollXInner': '200%',
			'sDefaultContent': '',
			'iCookieDuration': 60*60*24*365, // 1 year
			'sCookiePrefix': 'gryphonTable_',
			'aoColumnDefs': [

				{'bVisible': true,	'aTargets': ['CLICK', 'INSTALL', 'DeviceInfoId', 'City', 'CountryName', 
												'Platform', 'Resolution', 'mksubpublisher', 'mkbannertype'] },

				{'bVisible': false,	'aTargets': ['RowKey', 'CountryCode', 'Carrier', 'OsVersion', 'ModelName', 
												'AppReadableKey', 'CampReadableKey', 'ChannelReadableKey', 
												'MakiHumanKey', 'Ip', 'MacId', 'MacMD5', 'MacSHA1', 'MacSHA1', 
												'SDKVersion', 'SessionId', 'Token', 'Udid', 'UserAgent', 'IMEI', 
												'Manufacturer'] },

//				{'bVisible': false,	'aTargets': ['_all'] },
			],
		    'oColumnFilterWidgets': {
				'aiExclude': [ 0, 6 ],
				'sSeparator': ',  ',
				'bGroupTerms': true,
				'aoColumnDefs': [
//					{ 'bSort': false, 'sSeparator': ' / ', 'aiTargets': [ 2 ] },
//					{ 'fnSort': function( a, b ) { return a-b; }, 'aiTargets': [ 3 ] }
		        ]
		    },
			// sDOM parameters:
			// C: Column visibility		l: Paging size		R: Column order+resize	f: filtering		r: processing
			// T: TableTools			i: footer info		p: paging buttons 		S: Y-scrolling		W: Column filters
			"sDom": (relation === 'root') ? '<"H"TClfRr>t<"F"ip>' : 't'
		});
		$('#'+tables[relation].name).dataTable().columnFilter();

		tables[relation].rel = dTbl;

		$('.dataTables_length select').css('width', 50);
		$('.dataTables_filter input').css('width', 100);

		$('#'+tables[relation].name+' tbody tr').each( function(i, v) {
			$(this).attr('alt', i);
		});

		if(children !== false) {
			$(document).on('click', '#'+tables[relation].name+' tbody tr td.driller', function (event) {

				tbl = tables[relation].rel;
				pnt = this;
				pnt = tbl.fnGetNodes( $(this).parent('tr').attr('alt') );

				if ( tbl.fnIsOpen( pnt ) ) {
					tbl.fnClose( pnt );
				} else {
					tbl.fnOpen( pnt, "", "info_row" );

					tables[children] = {};
					tables[children].name = randomId();
					var dTblChild = prepTableView( randomId(), pack, children, '#'+tables[relation].name+' .info_row', 'grandchildren' );
					tables[children].rel = dTblChild;
				}
			});
		}

		$('#'+tables[relation].name+' tbody tr').each( function(i, v) {
			$('<td class="driller"><div class="drillDown"></div></td>').insertBefore( $(v).children('td:first-child') );
		});
		$('<td style="width:32px;"></td>').insertBefore( $('#'+tables[relation].name+' thead tr td:first-child') );
		$('<td style="width:32px;"></td>').insertBefore( $('.dataTables_scrollHead thead tr td:first-child') );

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
        console.log(response);
		drawTable(response);
		widget1.RemoveEvent(1);
    }
    function responseColumnsCallBack (response){
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

	function calcCells (input) {
		var _ts = this;
		thereIsAZero = false;
		theCell = $(input).parent('td');
		theRow = $(input).parent('tr');
		clicks = Number( $(theRow).children('.var_clicks').text() );
		installs = Number( $(theRow).children('.var_installs').text() );
		if(clicks === 0 || installs === 0 || clicks === NaN || installs === NaN) {
			thereIsAZero = true;
		}

		var edited = Number( $(input).val().replace(',', '.') );		// replace the comma if used

		if(!thereIsAZero) {
			if( $(theCell).hasClass('var_cpc') ) {					// we're editing the CPC

				this.calcARow( $(theRow), (clicks * edited ) );

			} else if( $(theCell).hasClass('var_cpd') ) {			// we're editing the CPD

				this.calcARow( $(theRow), (installs * edited ) );

			} else if( $(theCell).hasClass('var_cost') ) {

				this.calcARow( $(theRow), edited );

			}
		}
	};
	function calculateSumsOfRows () {
		if(this.showFooter === true) {

			var colCalc = {
				'sums': ['var_clicks', 'var_installs', 'var_cost'],
				'avgs': ['var_cpc', 'var_cpd', 'var_conversionrate']
			};

			for(var idx in colCalc.sums) {
				var pre = $('#sum_' + colCalc.sums[idx]).attr('title');
				var suf = $('#sum_' + colCalc.sums[idx]).attr('alt');
				var s = this.formatNumber($("#"+this.tableShadowName+" td."+colCalc.sums[idx]).sum());
				$("#"+this.tableRealName+' #sum_' + colCalc.sums[idx]).html( '<div class="cellContent"><nobr>' + pre + s + suf + '</nobr></div>' );
			}
			for(var idx in colCalc.avgs) {
				var pre = $('#sum_' + colCalc.avgs[idx]).attr('title');
				var suf = $('#sum_' + colCalc.avgs[idx]).attr('alt');
				var a = this.formatNumber($("#"+this.tableShadowName+" td."+colCalc.avgs[idx]+'.noEmpty').avg());
				$("#"+this.tableRealName+' #sum_' + colCalc.avgs[idx]).html( '<div class="cellContent"><nobr>' + pre + a + suf + '</nobr></div>' );
			}
		}
	};

	return {
		'fetchCallBackGroupBy': 	fetchCallBackGroupBy,
		'fetchCallBackSum': 		fetchCallBackSum,
		'responseSuccessCallBack': 	responseSuccessCallBack,
		'responseErrorCallBack': 	responseErrorCallBack,
		'fetchCallBackGroupBy2': 	fetchCallBackGroupBy2,
		'responseColumnsCallBack': 	responseColumnsCallBack,
	}


}(window.GryphonDashboard = window.GryphonDashboard || {}, jQuery));