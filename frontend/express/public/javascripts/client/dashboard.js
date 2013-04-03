var GryphonDashboard = (function(GryphonDashboard, $, undefined){

	var tables = {'root':{'name':''}};
	var initialCost = 10000;
	var editingFlag = false;
	var _ts = this;
	var clickTotal = 0;
	var installTotal = 0;
	var widget1;
	var selGrpStckFlag = false;
	var columns = [];
	var daFilters = '';
	tableVisibleCols = [
		{'mData':'test'},
		{'mData':'column'},
		{'mData':'other'}
	];
	var colorTable = [
		['#17D0E2', '#261D6E', ''],
		['#119692', '#74E1C3', ''],
		['#C1407A', '#6F2660', ''],
		['#F5C643', '#FF5F00', ''],
		['#6B47C7', '#1EAB95', ''],
		['#3A6A5D', '#C7C7C7', ''],
		['#655968', '#EF9539', ''],
		['#31083B', '#76A20C', ''],
		['#C393CF', '#8932DA', ''],
		['#988558', '#A14127', ''],
	];

	//google.load('visualization', '1.0', {'packages':['corechart', 'table', 'geochart']});

	$(document).ready( function() {


//		console.dir(normalizeTimeslot(null, {y:2013, m:3, d:20}, {y:2013, m:4, d:2}));

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
		                    'responseSuccessCallBack': 	responseSuccessCallBack,
		                    'responseErrorCallBack': 	responseErrorCallBack,
		                    'responseColumnsCallBack': 	responseColumnsCallBack
		                };
			widget1 =  new HandsomeWidget(options, 'widget-console');
			widget1.GetRowColumns();
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


		$(document).on('click', '.openFilters' , function () {
			$('#filtersList').html( daFilters );
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
								o['tsC'] = {};
							}else{
								o['CLICK'] = Number(pr[col].c);
								o['tsC'] = pr[col];
								cT += Number(pr[col].c);
//								{'name': randomId(),'timeslot': pr[col]};
							}
						}else{
							o['tsC'] = {};
							o['CLICK'] = 0;
						}
						break;
					case 'timeslotINSTALL':
						if(Object.keys(pr[col]).length > 0) {
							if(typeof pr[col].c == 'undefined'){
								o['INSTALL'] = 0;
								o['tsI'] = {};
							}else{
								o['INSTALL'] = Number(pr[col].c);
								o['tsI'] = pr[col];
								cI += Number(pr[col].c);
							}
						}else{
							o['INSTALL'] = 0;
							o['tsI'] = {};
						}
						break;
					case 'timeslotORGANIC':
						if(Object.keys(pr[col]).length > 0) {
							if(typeof pr[col].c == 'undefined'){
								o['ORGANIC'] = 0;
								o['tsO'] = {};
							}else{
								o['ORGANIC'] = Number(pr[col].c);
								o['tsO'] = pr[col];
								cI += Number(pr[col].c);
							}
						}else{
							o['ORGANIC'] = 0;
							o['tsO'] = {};
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
		$('#bigNumbersAverageCR').text( '%'+formatNumber(cI/cT,2) );
		
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
						if(ar[i] !== 'click' && ar[i] !== 'install' && ar[i] !== 'organic') {
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

/*
	TODO on adding new columns () first detach, then attach the grouping to the widget
*/

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


		// change the buttongroup for export into a pulldown menu
		$('.DTTT_container').wrapInner('<ul class="dropdown-menu" />');
		$('<button class="btn btn-primary dropdown-toggle" data-toggle="dropdown" />')
			.append('<span class="caret"></span>')
			.insertBefore('.DTTT_container ul.dropdown-menu');
		$('.DTTT_container button')
			.insertBefore('<button class="btn btn-mini" />')
			.text('Export');
		$('.DTTT_container a').each( function (i, v) {
			$(v).wrap('<li />');
		});
		$('.DTTT_container button')
			.addClass('btn-group')
			.removeClass('DTTT_container')
			.removeClass('ui-buttonset')
			.removeClass('ui-buttonset-multi');

		// create filters menu
		template = $('#filterTemplate').html();
//		$('.ColVis_catcher.TableTools_catcher').html().insertAfter( $('.ColVis_catcher.TableTools_catcher') ).addClass('filterButton');
		$('<div class="btn-group pull-right">' +
			'<button class="btn btn-primary">Filters</button>' + 
			'<button class="btn btn-primary dropdown-toggle openFilters" id="dLabel" data-target="#" data-toggle="dropdown"><span class="caret"></span></button>' +
			'<ul id="filtersList" class="dropdown-menu triple" role="menu" aria-labelledby="dLabel"><li></li></ul>' + 
			'</div>&nbsp;').insertAfter('.ColVis');


		$('a.fg-button')			.removeClass('fg-button')			.removeClass('ui-corner-tl')
									.removeClass('ui-corner-bl')		.removeClass('ui-corner-tl')
									.removeClass('ui-corner-bl')		.removeClass('ui-state-default')
									.removeClass('ui-state-disabled')
									.addClass('btn')					.addClass('btn-primary');

		$('a.DTTT_button')			.removeClass('ui-button')			.removeClass('ui-state-default')
									.removeClass('DTTT_button')

		$('button.ColVis_Button')	.removeClass('ui-button')			.removeClass('ui-state-default')
									.removeClass('ColVis_Button')
									.addClass('btn')					.addClass('btn-primary');

	};
	function normalizeTimeslot (tsC, tsI, tsO, begin, end) {

		// 3. end = null ise [begin] :byHour :24hrs

		if(end != null) {
			var days = [];
			var xBegin = begin;
			var xEnd = end;

			var onDay = xBegin.clone();
			for(var i=0; i < xBegin.diffDays(xEnd); i++) {
				onDay.addDays(1);
				o = {'date': onDay.toString('yyyy-MM-dd'), 'value': 0};
				onDay = onDay.clone();
				days.push(o);
			}
			if(tsC !== null && tsI !== null) {
				for(var d in days) {
					y = new XDate(days[d].date).getFullYear();
					m = new XDate(days[d].date).getMonth() + 1;
					g = new XDate(days[d].date).getDate();

					days[d] = {'date': days[d].date};
					if(typeof tsC[y] !== 'undefined') {
						if(typeof tsC[y][m] !== 'undefined') {
							if(typeof tsC[y][m][g] !== 'undefined') {
								if(typeof tsC[y][m][g].c !== 'undefined') {
									days[d].click = tsC[y][m][g].c;
								}
							}
						}
					}
					if(typeof tsI[y] !== 'undefined') {
						if(typeof tsI[y][m] !== 'undefined') {
							if(typeof tsI[y][m][g] !== 'undefined') {
								if(typeof tsI[y][m][g].c !== 'undefined') {
									days[d].install = tsC[y][m][g].c;
								}
							}
						}
					}
					if(tsO !== null) {
						if(typeof tsO[y] !== 'undefined') {
							if(typeof tsO[y][m] !== 'undefined') {
								if(typeof tsO[y][m][g] !== 'undefined') {
									if(typeof tsO[y][m][g].c !== 'undefined') {
										days[d].organic = tsC[y][m][g].c;
									}
								}
							}
						}
					}
				}
				return days;
			}else{
				var splits = 24;
			}
		}
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
//			'bProcessing': true,
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
//			'bScrollCollapse': true,
			'sDefaultContent': '',
			'iCookieDuration': 60*60*24*365, // 1 year
			'sCookiePrefix': 'gryphonTable_',
			'oTableTools': {
	            'sSwfPath': './swf/copy_csv_xls_pdf.swf'
	        },
/*
			'aoColumnDefs': [
//				{ "asSorting": [ "desc" ], "aTargets": [ 0, 1 ] },
//				{ "sTitle": "Clicks", "aTargets": [ 'CLICK' ] },
//				{ "sTitle": "Installs", "aTargets": [ 'INSTALL' ] },
			],
*/
/*
		    'oColumnFilterWidgets': {
				'aiExclude': [ 0, 6 ],
				'sSeparator': ',  ',
				'bGroupTerms': true,
				'aoColumnDefs': [
//					{ 'bSort': false, 'sSeparator': ' / ', 'aiTargets': [ 2 ] },
//					{ 'fnSort': function( a, b ) { return a-b; }, 'aiTargets': [ 3 ] }
		        ]
		    },
*/
			// sDOM parameters:
			// C: Column visibility		l: Paging size		R: Column order+resize	f: filtering		r: processing
			// T: TableTools			i: footer info		p: paging buttons 		S: Y-scrolling		W: Column filters

			"sDom": (relation === 'root') ? '<"H"TlCfr>t<"F"ip>' : 't',

			'fnDrawCallback': function( oSettings ) {
				$('.dataTables_scrollBody tr').each( function (i, v) {
					prepTableForCalc();
					calcARow($(v), null);
					saveCellValues();
				});
			}
		});
		$('#'+tables[relation].name).dataTable().columnFilter();

		dTbl = $('#'+tables[relation].name).dataTable();
		dTbl.$('tr').click( function () {
			var data = dTbl.fnGetData( this );
			plotChartHC(normalizeTimeslot(data.tsC, data.tsI, null, new XDate(2013, (3-1), 20), new XDate(2013, (4-1), 5)));
		});

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
		*/

		$('#'+tables[relation].name+' tbody tr').each( function(i, v) {
			if( $(v).children('.var_install, .var_click, .var_organic').length > 0 ){
				$('<td class="plotToggler"><input type="checkbox" class="bigCheckBox" /></td>').insertBefore( $(v).children('td:first-child') );
			}
		});
		$('<td style="width:32px;"></td>').insertBefore( $('#'+tables[relation].name+' thead tr td:first-child') );
		$('<td style="width:32px;"></td>').insertBefore( $('.dataTables_scrollHead thead tr td:first-child') );
		$('.bigCheckBox').uniform();
		$(document).on('change', '.bigCheckBox', function () {
			if( $(this).parent('span').hasClass('checked') ) {
				$(this).parents('td.plotToggler')
					.siblings('.var_install, .var_click, .var_organic')
					.each( function (i, v) {
						$(v).html( $(v).text() + '<input type="checkbox" class="bigCheckBoxChildren" checked="checked" />' );
						$(v).addClass('checkedTick');
					});
				$('input.bigCheckBoxChildren').uniform();
				$(this).parents('td.plotToggler')
					.siblings('.var_install, .var_click, .var_organic')
					.each( function (i, v) {
						$(v).children('div.checker').addClass('pull-right');
					});
			}else{
				$(this).parents('td.plotToggler')
					.siblings('.var_install, .var_click, .var_organic')
					.each( function (i, v) {
						$(v).children('div.checker').remove();
					});
			}
		});

		
		$(document).on('change', '.dataTables_scrollBody input[type="checkbox"]', function () {
			if( $(this).parents('span').hasClass('checked') ) {
				if(!$(this).parents('td').hasClass('plotToggler')) {
					$(this).parents('td').addClass('checkedTick');
				}
			}else{
				$(this).parents('td').removeClass('checkedTick');
			}


			// clicked checkboxes retrieve corresponding timeslots as an array
			var wholeSet = [];
			dTbl = $('#'+tables[relation].name).dataTable();
			dTbl.$('td.checkedTick').parent('tr').each( function (i, v) {
				if( $(v).children('.var_click').hasClass('checkedTick') ) {
					var data = dTbl.fnGetData( v );
					wholeSet.push({'type': 'click', 'color': colorTable[i][0], 'timeslot': data.tsC});
				}
				if( $(v).children('.var_install').hasClass('checkedTick') ) {
					var data = dTbl.fnGetData( v );
					wholeSet.push({'type': 'install', 'color': colorTable[i][1], 'timeslot': data.tsI});
				}
				if( $(v).children('.var_organic').hasClass('checkedTick') ) {
					var data = dTbl.fnGetData( v );
					wholeSet.push({'type': 'organic', 'color': colorTable[i][2], 'timeslot': data.tsO});
				}
			});
			console.dir(wholeSet);
//			plotChartHC(normalizeTimeslot(data.tsC, data.tsI, null, new XDate(2013, (3-1), 20), new XDate(2013, (4-1), 5)));
		});

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
		columns = response.columns;
		var set = '';
		for(var i in columns) {
			set += 	'<li><a tabindex="-1" href="#">' + columns[i].cvname + '</a></li>';
		}
		daFilters = set;
	}
	function responseErrorCallBack (response){
		console.log(" JSONP responseErrorCallBack")
	}
	function fetchCallBackGroupBy2 (response){
    }
	function sMenuReceived(package) {
		console.dir(package);
	}
	function fMenuReceived(package) {
		console.dir(package);
	}
	function getContent() {
	    return  $('#containerForCalendar').html();
	};
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
			c = Math.round((installs / clicks) * 100) / 100;
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

	function plotChartHC (ts) {
		var set = {'c':[], 'i':[], 'o':[], 'n':[], 'ci':[]};
		for(var i in ts) {
			clicks = (typeof ts[i].click === 'undefined') ? 0 : ts[i].click;
			installs = (typeof ts[i].install === 'undefined') ? 0 : ts[i].install;
			organics = (typeof ts[i].organic === 'undefined') ? 0 : ts[i].organi;
			dt = new XDate(ts[i].date);

			set['c'].push(clicks);
			set['i'].push(installs);
			set['ci'].push(installs/clicks);
			set['o'].push(organics);
			set['n'].push(dt.toString('d MMM'));
		}
		var chart1 = new Highcharts.Chart({
			chart: {
				renderTo: 'datasetChart',
				type: 'area'
			},
			title: {
				text: 'Clicks / Installs / Organics'
			},
			legend: {
				layout: 'vertical',
				align: 'right',
				verticalAlign: 'top',
				x: -10,
				y: 100,
				borderWidth: 0
			},
			crosshairs: [true,true],
			xAxis: {'categories': set['n']},
			yAxis: [{ 'title': { 'text': 'Clicks' }},
					{ 'title': { 'text': 'Installs'}},
//					{ 'title': { 'text': 'Organics'}, 'opposite': true},
//					{ 'title': { 'text': 'CR'}, 'opposite': true }
			],

			series: [{'name': 'Clicks', 	'data': set['c']},
					 {'name': 'Installs', 	'data': set['i']},
//					 {'name': 'Organics', 	'data': set['o']},
//			    	 {'name': 'CR', 		'data': set['ci']}
			]
	    });
	}

	function plotChart (ts) {
		var height = 300;
		var set = [
			['Date', 'Clicks', 'Installs', 'Organic', 'CR']
		];
		for(var i in ts) {
			clicks = (typeof ts[i].click === 'undefined') ? 0 : ts[i].click;
			installs = (typeof ts[i].install === 'undefined') ? 0 : ts[i].install;
			organics = (typeof ts[i].organic === 'undefined') ? 0 : ts[i].organi;
			dt = new XDate(ts[i].date);
			set.push([dt.toString('d MMM'), clicks, installs, organics, (installs/clicks)]);
		}
		var data = google.visualization.arrayToDataTable(set);
		var chart = new google.visualization.ComboChart(document.getElementById('datasetChart'));
		chart.draw(data, {
			'width': $('.span12').width(), 
			'height': 300, 
			'vAxes': [{'title': 'Clicks'}, {'title': 'Installs'}, {'title': 'Organics'}],
			'hAxis': {'title': 'Date'},
			'seriesType': 'line',
			'series': {3: {'type': 'line'}}
		});
	}

	return {
		'fetchCallBackGroupBy1': 	fetchCallBackGroupBy1,
		'fetchCallBackSum': 		fetchCallBackSum,
		'responseSuccessCallBack': 	responseSuccessCallBack,
		'responseErrorCallBack': 	responseErrorCallBack,
		'fetchCallBackGroupBy2': 	fetchCallBackGroupBy2,
		'responseColumnsCallBack': 	responseColumnsCallBack,
	}


}(window.GryphonDashboard = window.GryphonDashboard || {}, jQuery));