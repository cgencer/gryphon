var GryphonDashboard = (function(GryphonDashboard, $, undefined){

	var tables = {'root':{'name':''}};
	var initialCost = 10000;
	var editingFlag = false;
	var _ts = this;
	var clickTotal = 0;
	var installTotal = 0;
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
		                    'url':"http://makina.nmdapps.com/Events/Report/MAKINA/CIRawReport",
		                   /// "url":"http://192.168.10.13/Events/Report/MAKINA/CIRawReport",
		                    'refreshTime': 1000,
		                    'fetchOptions': [
/*
		                       {
		                            'id': '1', 'type': 'sum', 'name': 'fetch 1', 'byColumns': null,
									'columns': ['timeslotCLICK'], 'fetchCallBack': function (result) {
										$('#bigNumbersTotalClick').text( size_format(result.timeslot.c) );
									}
		                        }, {
		                            'id': '2', 'type': 'sum', 'name': 'fetch 1', 'byColumns': null,
		                            'columns': ['timeslotCLICK'], 'fetchCallBack': function (result) {
										$('#bigNumbersTotalInstall').text( size_format(result.timeslot.c) );
									}
								}
*/
		                        {
		                            'id':"3",
		                            'type':"groupby", // sum, group by
		                            'name':"fetch 2",
		                            'byColumns':['CountryCode','City'], // group bys
		                            'byValues': null,
		                            'columns':['timeslotCLICK','timeslotINSTALL'],// city,app,company
		                            'fetchCallBack': fetchCallBackGroupBy1
		                        },
/*		                        {
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
			console.dir(widget1.GetRowColumns());
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
				{'test': 0,'column': 'sdfs','other': 'xxx'},
				{'test': 5,'other': 'xxx','column': 'sdfs'},
				{'test': 5,'column': 'sdfs','other': 'xxx'},
				{'test': 5,'column': 'sdfs','other': 'xxx'}
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
			prepTableForCalc();
		});

		cuteNSexy.setPaths(amplify.store( 'paths'));
		cuteNSexy.setDictionary(amplify.store( 'dictionary'));
		
		$('.sideBar').height( $(window).height() );
		cuteNSexy.runChainedEvents([ {'cmd': 'GetMenuItems', 'success': sMenuReceived, 'fail': fMenuReceived, 'payload': {'userId':123} } ]);


	});


	function prepData (pack) {
		var cT = 0, cI = 0;
		tables['root'].untouched = pack;
		max = Object.keys(pack.columns).length;
		for(var row in pack.rows) {
			if(!isset(pack.rows[row].cpc)) { $.extend(pack.rows[row], {'cpc':0}); }
			if(!isset(pack.rows[row].cpd)) { $.extend(pack.rows[row], {'cpd':0}); }
			if(!isset(pack.rows[row].cost)) { $.extend(pack.rows[row], {'cost':0}); }
			if(!isset(pack.rows[row].cr)) { $.extend(pack.rows[row], {'cr':0}); }
		}
		pack.columns.push({'cvname':'cpc', 	'cname':'cpc', 	'editable':true, 'process':'', 'visible':true, 'order':max++});
		pack.columns.push({'cvname':'cpd', 	'cname':'cpd', 	'editable':true, 'process':'', 'visible':true, 'order':max++});
		pack.columns.push({'cvname':'cr', 	'cname':'cr', 	'editable':true, 'process':'', 'visible':true, 'order':max++});
		pack.columns.push({'cvname':'cost', 'cname':'cost', 'editable':true, 'process':'', 'visible':true, 'order':max++});
		tables['root'].dataSet = pack;

		var no = {'columns': pack.columns, 'rows': []};
		for(var row in pack.rows) {
			var pr = pack.rows[row];
			var o = {};
			for(var col in pr) {
				switch (col) {
					case 'timeslotCLICK':
						if(Object.keys(pr[col]).length > 0) {
							if(typeof pr[col].c == 'undefined'){
								o['CLICK'] = 0;
							}else{
								o['CLICK'] = Number(pr[col].c);
								cT += Number(pr[col].c);
							}
						}else{
							o['CLICK'] = 0;
						}
						break;
					case 'timeslotINSTALL':
						if(Object.keys(pr[col]).length > 0) {
							if(typeof pr[col].c == 'undefined'){
								o['INSTALL'] = 0;
							}else{
								o['INSTALL'] = Number(pr[col].c);
								cI += Number(pr[col].c);
							}
						}else{
							o['INSTALL'] = 0;
						}
						break;
					default:
						o[col] = pr[col];
						break;
				}
			}
			no['rows'].push(o);
		}
		$('#bigNumbersTotalClick').text( size_format(cT) );
		$('#bigNumbersTotalInstall').text( size_format(cI) );
		$('#bigNumbersAverageCR').text( '%'+formatNumber(cT/cI,2) );
		
		return no;
	};

	function prepTableForCalc () {
		// creates the var_ classes for each rows cells
		var ar = ['cost', 'cpc', 'cpd', 'cr', 'cost', 'click', 'install'];
		for(var i in ar) {
			$('.dataTables_scrollHead table thead td').each( function (r, v) {
				if( $(v).text().toLowerCase() === ar[i]) {
					$('.dataTables_scrollBody table tbody tr').each( function (c, vv) {
						var pt = $(vv).children('td').eq(r);
						$(pt).addClass('var_'+ar[i]);
						if(ar[i] !== 'click' && ar[i] !== 'install') {
							$(pt).addClass('editMe');
						}
					});
				}
			});
		}
	};

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

		prepTableForCalc ();

		$(document).on('keypress', '.realLiveWire', function (event) {
			if(_ts.editingFlag) {
				var keycode = (event.keyCode ? event.keyCode : event.which);
				if(event.keyCode == 13) {
					$('td.darkenedColumns').each( function (i,v) {
						$(v).removeClass('darkenedColumns');
					})

	//				calcCells( $(this) );
					_ts.editingFlag = false;
				}
/*
				$('#' + __ts.tableRealName + 'innerTableBody tr td').each( function (i, o) {
					$(o).width( $(parentRow).children('td').eq(i).width() );
				});
*/

			}
		});

		// had to iterate each cell to bind event, whereafter removal of the event can be made on each cell
		$(document).on('click', 'td.editMe', function () {
			if(!_ts.editingFlag) {
				if 	( (Number($(this).siblings('.var_click').text()) > 0 && $(this).hasClass('var_cpc') ) || 
					(Number($(this).siblings('.var_install').text()) > 0 && $(this).hasClass('var_cpd') ) ) {

					cellRealValue = $(this).attr('alt');

					cellWidth = $(this).children('div').width() + 30;
					$(this).parent('tr').blur();
					$(this).html('<input type="text" class="realLiveWire" style="width:'+cellWidth+'px;" value="'+cellRealValue+'" />');
					$(this).children('input').focus();
					_ts.editingFlag = true;					
				}
			}
		});

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
			'sDefaultContent': '',
			'iCookieDuration': 60*60*24*365, // 1 year
			'sCookiePrefix': 'gryphonTable_',
			'aoColumnDefs': [
				{ "asSorting": [ "desc" ], "aTargets": [ 0, 1 ] },
				{ "sTitle": "Clicks", "aTargets": [ 'CLICK' ] },
				{ "sTitle": "Installs", "aTargets": [ 'INSTALL' ] },

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
			"sDom": (relation === 'root') ? '<"H"TClfRr>t<"F"ip>' : 't',
			'fnDrawCallback': function( oSettings ) {
				$('tr').each( function (i, v) {
					prepTableForCalc();
					calcARow($(v), null);
					saveCellValues();
				});
			}
		});
		$('#'+tables[relation].name).dataTable().columnFilter();

		$(document).on('click', '.dataTables_scrollBody td.editMe', function () {
			var clicked = $(this);
			var ci = $(this).parent('tr').children('td').index( $(this) );
			$('.dataTables_scrollBody td').each( function (i, v) {
				$(v).addClass('darkenedColumns');
				$(clicked).removeClass('darkenedColumns');
			});
		});
	
		var indexes = [];
		for(var i in tableVisibleCols[relation]) {
			indexes[ tableVisibleCols[relation] ] = i;
		}
		for(var k in indexes) {
//			dTbl.fnGetTds( $('#' + tables[relation].name + ' tbody tr:eq(' + indexes[k] + ')')[k] );
			
			
			
		}

		tables[relation].rel = dTbl;

		$('.dataTables_length select').css('width', 50);
		$('.dataTables_filter input').css('width', 100);

		$('#'+tables[relation].name+' tbody tr').each( function(i, v) {
			$(this).attr('alt', i);
		});

/*		CLICKROW
		
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
*/

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
	function isset(varname){
		return(typeof(window[varname]) != 'undefined');
	}
	function formatNumber ( num, fixed ) { 
		if(fixed === undefined){fixed = 2;}
		var decimalPart;
		var array = Math.floor(num).toString().split('');
		var index = -3; 
		while ( array.length + index > 0 ) { 
			array.splice( index, 0, '.' );              
			index -= 4;
		}

		if(fixed > 0){
			decimalPart = num.toFixed(fixed).split(".")[1];
			if(decimalPart !== "00"){
				return array.join('') + "," + decimalPart;
			}else{
				return array.join('')
			}
		}
		return array.join(''); 
	};
    function fetchCallBackGroupBy1 (response){
		drawTable( prepData(response) );
		widget1.StopListener();
//        drawGeoMap(response.response);
    }
    function fetchCallBackSum (response){
        console.log("fetchCallBackSum++++++++++++++");
        console.dir(response);

    }
    function responseSuccessCallBack (response){
        console.log(response);
//		drawTable(response);
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

	function saveCellValues () {
		$('td.editMe').each( function(i, v) {
			$(v).attr('alt', $(v).text().replace('.', '').replace(',', '.') );
		});
	}
	function calcARow (theRow, newCost) {	// newcost null yerine deger verilirse onu kullan; cost'u editlenen alana gore hesapla 
		var cost = 0;
		cost = (newCost != null) ? newCost : initialCost;
		cost = Math.round(cost * 100) / 100;

		var thereIsAZero = false;
		clicks = Number( $(theRow).children('.var_click').text() );
		installs = Number( $(theRow).children('.var_install').text() );

		destCPD = $(theRow).children('.var_cpd');
		destCPC = $(theRow).children('.var_cpc');
		destCR = $(theRow).children('.var_cr');
		destCOST = $(theRow).children('.var_cost');

		if(clicks === 0 || installs === 0 || clicks === NaN || installs === NaN) {
			thereIsAZero = true;
		}

		$(destCOST).html( '<div class="cellContent"><nobr>' + formatNumber(cost) + '</nobr></div>');

		if(!thereIsAZero) {
			c = Math.round((clicks / installs) * 100) / 100;
			$(destCR).html( '<div class="cellContent"><nobr>' + formatNumber(c) + '</nobr></div>');
		}else{
			$(destCR).html( '<small>[ n/a ]</small>' );
		}

		if(clicks > 0 || !thereIsAZero) {
			newcpc = cost / clicks;
			c = Math.round(newcpc * 100) / 100;
			$(destCPC).html( '<div class="cellContent"><nobr>' + formatNumber(c) + '</nobr></div>');
		}else{
			$(destCPC).html( '<small>[ n/a ]</small>' );
		}
		if(installs > 0 || !thereIsAZero) {
			newcpd = cost / installs;
			c = Math.round(newcpd * 100) / 100;
			$(destCPD).html( '<div class="cellContent"><nobr>' + formatNumber(c) + '</nobr></div>');
		}else{
			$(destCPD).html( '<small>[ n/a ]</small>' );
		}
	};

	function calcCells (input) {
		var _ts = this;
		thereIsAZero = false;
		theCell = $(input).parent('td');
		theRow = $(input).parent('tr');
		clicks = Number( $(theRow).children('.var_click').text() );
		installs = Number( $(theRow).children('.var_install').text() );
		if(clicks === 0 || installs === 0 || clicks === NaN || installs === NaN) {
			thereIsAZero = true;
		}

		var edited = Number( $(input).val().replace(',', '.') );		// replace the comma if used

		if(!thereIsAZero) {
			if( $(theCell).hasClass('var_cpc') ) {					// we're editing the CPC

				calcARow( $(theRow), (clicks * edited ) );

			} else if( $(theCell).hasClass('var_cpd') ) {			// we're editing the CPD

				calcARow( $(theRow), (installs * edited ) );

			} else if( $(theCell).hasClass('var_cost') ) {

				calcARow( $(theRow), edited );

			}
		}
	};
	function size_format (ns) {
		if (ns >= 1000000000) {
		     ns = formatNumber(ns / 1000000000, 1) + 'G';
		} else { 
			if (ns >= 1000000) {
	     		ns = formatNumber(ns / 1000000, 1) + 'M';
	   	} else { 
				if (ns >= 1000) {
	    		ns = formatNumber(ns / 1000, 1) + 'K';
	  		} else {
	    		ns = formatNumber(ns, 0);
				};
	 		};
		};
	  return ns;
	};	
	function calculateSumsOfRows () {
		if(this.showFooter === true) {

			var colCalc = {
				'sums': ['var_click', 'var_install', 'var_cost'],
				'avgs': ['var_cpc', 'var_cpd', 'var_cr']
			};

			for(var idx in colCalc.sums) {
				var pre = $('#sum_' + colCalc.sums[idx]).attr('title');
				var suf = $('#sum_' + colCalc.sums[idx]).attr('alt');
				var s = formatNumber($("#"+this.tableShadowName+" td."+colCalc.sums[idx]).sum());
				$("#"+this.tableRealName+' #sum_' + colCalc.sums[idx]).html( '<div class="cellContent"><nobr>' + pre + s + suf + '</nobr></div>' );
			}
			for(var idx in colCalc.avgs) {
				var pre = $('#sum_' + colCalc.avgs[idx]).attr('title');
				var suf = $('#sum_' + colCalc.avgs[idx]).attr('alt');
				var a = formatNumber($("#"+this.tableShadowName+" td."+colCalc.avgs[idx]+'.noEmpty').avg());
				$("#"+this.tableRealName+' #sum_' + colCalc.avgs[idx]).html( '<div class="cellContent"><nobr>' + pre + a + suf + '</nobr></div>' );
			}
		}
	};

	return {
		'fetchCallBackGroupBy1': 	fetchCallBackGroupBy1,
		'fetchCallBackSum': 		fetchCallBackSum,
		'responseSuccessCallBack': 	responseSuccessCallBack,
		'responseErrorCallBack': 	responseErrorCallBack,
		'fetchCallBackGroupBy2': 	fetchCallBackGroupBy2,
		'responseColumnsCallBack': 	responseColumnsCallBack,
	}


}(window.GryphonDashboard = window.GryphonDashboard || {}, jQuery));