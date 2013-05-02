var GryphonDashboard = (function(GryphonDashboard, $, undefined){

	if (amplify.store('uid') === '') {
		window.location.href = 'login';
	}
	$(document).on('click', 'div.management' , function () {
		window.location.href = 'mng';
	});

	var tables = {'root':{'name':''}};
	var initialCost = 10000;
	var editingFlag = false;
	var _ts = this;
	var clickTotal = 0;
	var installTotal = 0;
	var gryphonModel;
	var selGrpStckFlag = false;
	var colorTable = [];
	var fakeTable = {};
	var columns = [];
	var daFilters = '';
	var charted = {};
	var selectedFractions = [];
	var dateRange = {'begin': new XDate(2013, (3-1), 20), 'end': new XDate(2013, (4-1), 5)};
	var gryphonModelUrl = 'http://oduncu.nmdapps.com/Events/Report/MAKINA/CIRawReport';
	var widgetTemplate = {
		'type': 			'groupby',
		'byValues': 		null,
		'columns': 			[ ],
	};
	var tableVisibleCols = [
		{'mData':'test'},
		{'mData':'column'},
		{'mData':'other'}
	];
	//google.load('visualization', '1.0', {'packages':['corechart', 'table', 'geochart']});
	function createDummyData () {
		/*
			TODO Graph1 ve Graph2 pulldowns: Feed plotting input with calculated datas as CPC / CPD / Cost				2 hrs
						subtask: on-the-fly calculations written onto the datatable										4 hrs
						subtask: build plottingarray from the visible datatable											2 hrs
		*/
		/*
			TODO save costs: 																							2 hrs
						subtask: record edited fields into an array and send this as JSON to the server trough ajax		2 hrs
		*/
		/*
			TODO Calendar selection																						2 hrs
						subtask: write selected dates into session data and read from it								5 hrs
		*/
		/*
			TODO Management sections																					
						subtask: report permissions																		4 hrs
		*/
		/*
			TODO use Fractions from the pulldown to build widget calls													6 hrs
		*/
		/*
			TODO consistent table button styles																			2 hrs
		*/
		/*
			TODO Breadcrumbs																							2 hrs
		*/
		/*
			TODO darkbox on loading data & management modals & error screens											1 hrs
		*/
		/*
			TODO editable columns																						6 hrs
		*/
		/*
			TODO User session & menus according																			
						subtask: saving of last column ordering of the datatable
		*/
		/*
			TODO SDK Wizard																								8 hrs
		*/
		/*
			TODO localization																							12 hrs
		*/
		fakeTable = {'columns': [
				{'visible': true, order:2, 'cvname':'test'},	{'visible': true, order:0, 'cvname':'column'},
				{'visible': true, order:1, 'cvname':'other'},	{'visible': true, order:3, 'cvname':'oth'},
				{'visible': true, order:4, 'cvname':'lda'},		{'visible': true, order:5, 'cvname':'mov'},
				{'visible': true, order:5, 'cvname':'stx'},		{'visible': true, order:5, 'cvname':'sty'},
				{'visible': true, order:5, 'cvname':'tst'}
			], 'rows': [
				{'test': 0, 'column': 'sdfs', 'other':'xxx','oth':'xxx','lda':'xxx','mov':'xxx','stx':'a','sty':0,'tst':0},
				{'test': 5, 'column': 'sdfs', 'other':'xxx','oth':'xxx','lda':'xxx','mov':'xxx','stx':'a','sty':0,'tst':0},
				{'test': 5, 'column': 'sdfs', 'other':'xxx','oth':'xxx','lda':'xxx','mov':'xxx','stx':'a','sty':0,'tst':0},
				{'test': 5, 'column': 'sdfs', 'other':'xxx','oth':'xxx','lda':'xxx','mov':'xxx','stx':'a','sty':0,'tst':0}
		]}
		colorTable = [
			['#17D0E2', '#261D6E', '#b4afe1'],
			['#119692', '#74E1C3', '#78ff00'],
			['#C1407A', '#6F2660', '#1343b1'],
			['#F5C643', '#FF5F00', '#de1919'],
			['#6B47C7', '#1EAB95', '#c69613'],
			['#3A6A5D', '#C7C7C7', '#f626af'],
			['#655968', '#EF9539', '#d0a67a'],
			['#31083B', '#76A20C', '#147fe3'],
			['#C393CF', '#8932DA', '#0bd989'],
			['#988558', '#A14127', '#f48a6e'],
		]
	};createDummyData();
	function initModel () {
		cuteNSexy.init({
			'domain': 		'http://alpha.loxodonta-editor.appspot.com:80',
			'service': 		'resources/dispatcher/test/v1',
			'cloudId': 		'ff8080813d8c00cb013d8d1e73e00009',
			'appName': 		'loxo',
		});
		if(Object.keys(amplify.store('paths')).length>0){cuteNSexy.setPaths(amplify.store('paths'));}else{
			console.log('Login / Paths object not found!!!');
		}
		if(Object.keys(amplify.store('dictionary')).length>0){cuteNSexy.setDictionary(amplify.store('dictionary'));}else{
			console.log('Login / Dictionary object not found!!!');
		}
		console.dir(amplify.store('dictionary'));
		console.log('User ID is: '+amplify.store('uid'));
		console.log('Sess ID is: '+amplify.store('sid'));

		if(amplify.store('sid')!=''){cuteNSexy.setSessionID(amplify.store('sid'));}
		else{amplify.store('sid',cuteNSexy.getSessionID());}

		cuteNSexy.runChainedEvents([ {'cmd': 'GetMenuItems', 'success': sMenuReceived, 'fail': fMenuReceived, 
										'payload': {'userId':amplify.store('uid')} } ]);
	}initModel();

	$(document).ready( function() {

		$(document).on('click', '#managementUser' , function () {
			console.log('clicked!');
			cuteNSexy.runChainedEvents([ {'cmd': 'ListUsers', 'success': function (ret) {
				console.dir(ret);
			}, 'fail': fMenuReceived, 'payload': {
				'userId': amplify.store('uid'), 'pager': {} 
			} } ]);
		});

		$.datepicker.setDefaults( $.datepicker.regional['en'] );
		$("#containerForCalendar").multiDatesPicker({'numberOfMonths':[1,2]});
		$('a[rel=tooltip]').popover({'html':true, 'trigger':'click', 'placement':'bottom', 'content': getContent()});

		$('.fg-toolbar.ui-widget-header').prepend( $('#filterBySecondaryDimension').html() );

		drawTable (fakeTable);

		// ensure that all paging buttons remain in-design...
		$(document).on('click', '#contentDataset .btn, #contentDataset .ui-button, #contentDataset .fg-button' , function () {
			$('a.fg-button')			.removeClass('fg-button')			.removeClass('ui-corner-tl')
										.removeClass('ui-corner-bl')		.removeClass('ui-corner-tl')
										.removeClass('ui-corner-bl')		.removeClass('ui-state-default')
										.removeClass('ui-state-disabled')
										.addClass('btn')					.addClass('btn-primary');
			prepTableForCalc();
		});

		$(document).on('click', '.checkFlt' , function (e) {
			e.stopPropagation();
			if(!$(this).hasClass('checked')){
				$(this).addClass('checked');
			}else{
				$(this).removeClass('checked');
			}
		});

		$('.sideBar').height( $(window).height() );

		$(document).on('click', '#create-widget' , function (e) {

			selectedFractions = ['App', 'CountryCode', 'City'];

			gryphonModel = new HandsomeWidget({
				'url': 						gryphonModelUrl,
				'refreshTime': 				1000,
				'fetchOptions': 			[ ],
				'responseSuccessCallBack': 	responseSuccessCallBack,
				'responseErrorCallBack': 	responseErrorCallBack,
				'responseColumnsCallBack': 	responseColumnsCallBack
			}, 'widget-console');
			gryphonModel.GetRowColumns();

			var t = $.extend({}, widgetTemplate, {
				'id': 				$.base64.encode( selectedFractions.join('') ).substr(0, -2),		// cut off base64-ending
				'name': 			selectedFractions.join('').toLowerCase(),
				'byColumns': 		selectedFractions,
				'byValues': 		[],
				'columns': 			[],
				'fetchCallBack': 	function (response) {
					console.info('grabbed the data...');
					console.dir(response);
					drawTable( prepData( response ) );
					gryphonModel.StopListener();
				}
			});
			console.dir(t);
			gryphonModel.AddEvent(t);

		});



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
		pack.columns.unshift({'cvname':'YOYO', 'cname':'yoyo', 'editable':false,'process':'', 'visible':true, 'order':max++});
		tables['root'].dataSet = pack;
zeroCnt = 0;
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
console.log(zeroCnt++);
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
console.log(zeroCnt++);
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
			o['YOYO'] = 'XOXO';
			no['rows'].push(o);
			
		}
		$('#bigNumbersTotalClick').text( size_format(cT) );
		$('#bigNumbersTotalInstall').text( size_format(cI) );
		$('#bigNumbersAverageCR').text( '%'+formatNumber(cI/cT,2) );
		
		return no;
	};

	function createDummyTimeSlotData (ts, xBegin, xEnd) {

		var onDay = xBegin.clone();
		ts[onDay.getYear()] = [];
		ts[onDay.getYear()][onDay.getMonth()+1] = [];
		startMonth = onDay.getMonth() + 1;

		for(var i=0; i < xBegin.diffDays(xEnd); i++) {
			onDay.addDays(1);
			if(startMonth < onDay.getMonth() + 1) {
				// month changed
				startMonth = onDay.getMonth() + 1;
				ts[onDay.getYear()][onDay.getMonth()+1] = [];
			}
			ts[onDay.getYear()][onDay.getMonth()+1][onDay.getDay()] = [];

			for(var i=6; i < 20; i++) {
				ts[onDay.getYear()][onDay.getMonth()+1][onDay.getDay()][i] = Math.random(0, 999);
			}
		}
		return ts;

	};

	function prepTableForCalc () {
		// creates the var_ classes for each rows cells
		var ar = ['cost', 'cpc', 'cpd', 'cr', 'click', 'install'];
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
		var lastOrder = 0;

		pack.columns = _.sortBy( pack.columns, 'order' );
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
				if 	( (Number($(this).siblings('.column_clicks').text()) > 0 && $(this).hasClass('var_cpc') ) || 
					(Number($(this).siblings('.column_installs').text()) > 0 && $(this).hasClass('var_cpd') ) ) {

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
			'<button class="btn btn-primary">Fractions</button>' + 
			'<button class="btn btn-primary dropdown-toggle openFilters" id="dLabel" data-target="#" data-toggle="dropdown">' + 
			'<span class="caret"></span></button>' +
			'<ul id="filtersList" class="dropdown-menu triple" role="menu" aria-labelledby="dLabel"><li></li></ul>' + 
			'</div>&nbsp;').insertAfter('.ColVis');

		$(document).on('click', '.openFilters' , function () {
			$('#filtersList').html( daFilters );
		});

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
	function normalizeTimeslot (tsC, tsI, tsO) {

		// 3. end = null ise [begin] :byHour :24hrs

		if(dateRange.end != null) {
			var days = [];
			var xBegin = dateRange.begin;
			var xEnd = dateRange.end;

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

	function normalizeTS (ts) {

		// 3. end = null ise [begin] :byHour :24hrs

		if(end != null) {
			var days = [];
			var xBegin = dateRange.begin;
			var xEnd = dateRange.end;

			for(var i=0; i < xBegin.diffDays(xEnd); i++) {
				var onDay = xBegin.clone();
				onDay.addDays(i);
				y = onDay.getFullYear();
				m = onDay.getMonth() + 1;
				g = onDay.getDate();

				days[i] = [];
				days[i][0] = onDay.toString('d MMM');
				days[i][1] = 0;

				if(typeof ts[y] !== 'undefined') {
					if(typeof ts[y][m] !== 'undefined') {
						if(typeof ts[y][m][g] !== 'undefined') {
							if(typeof ts[y][m][g].c !== 'undefined') {
								days[i][1] = ts[y][m][g].c;
							}
						}
					}
				}
			}
		}
		return days;
	};
	
	function prepTableView (name, pack, relation, into, children) {
		var hs = '', ts = '';
		tables[relation] = {};
		tableVisibleCols[relation] = [];
		tables[relation].name = name;
		$(into).html( $('#datasetTableTemplate').html() );

		for(var col in pack.columns) {
			hs += '<th>' + pack.columns[col].cvname + '</th>';
			ts += '<td></td>';
			if(pack.columns[col].visible === true) {
				
			}
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
			'oColReorder': {
				'aiOrder': [ 0, 1, 4, 5, 6, 7, 2, 3 ]
			},
			'aoColumnDefs': [
				{ 'sWidth': '75px', 			'aTargets': [ 0, 1 ] },
				{ 'sWidth': '125px', 			'aTargets': [ 2 ] },
				{ 'asSorting': [ 'desc' ], 		'aTargets': [ 0, 1 ] },
				{ 'aDataSort': [ 0, 1 ], 		'aTargets': [ 0, 1 ] },
				{ 'sTitle': "Clicks", 			'aTargets': [ 0 ] },
				{ 'sTitle': "Installs", 		'aTargets': [ 1 ] },
				{ 'sClass': 'column_clicks', 	'aTargets': [ 0 ] },
				{ 'sClass': 'column_installs', 	'aTargets': [ 1 ] },
				{ 'sClass': 'column_cpc',	 	'aTargets': [ 4 ] },
				{ 'sClass': 'column_cpd', 		'aTargets': [ 5 ] },
				{ 'sClass': 'column_cr',	 	'aTargets': [ 6 ] },
				{ 'sClass': 'column_cost',	 	'aTargets': [ 7 ] },
			],

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

			"sDom": (relation === 'root') ? 'R<"H"TlCfr>t<"F"ip>' : 't',

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
//			var data = dTbl.fnGetData( this );
//			plotChartHC(normalizeTimeslot(data.tsC, data.tsI, null, new XDate(2013, (3-1), 20), new XDate(2013, (4-1), 5)));
		});
		plotChartHC(normalizeTimeslot(null, null, null));

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

		// replace any placeholders now and forever
		$('td:contains("XOXO")').each( function () {
			$(this).addClass('plotToggler').html('<input type="checkbox" class="bigCheckBox" />');
		});
		$('.bigCheckBox').uniform();
		$(document).on('click', 'th, #contentDataset .btn, #contentDataset .ui-button, #contentDataset .fg-button', function () {
			$('td:contains("XOXO")').each( function () {
				$(this).addClass('plotToggler').html('<input type="checkbox" class="bigCheckBox" />');
			});
			$('.bigCheckBox').uniform();
		});
		$('th:contains("YOYO")').text('');

		$(document).on('change', '.bigCheckBox', function () {
			if( $(this).parent('span').hasClass('checked') ) {
				$(this).parents('td.plotToggler')
					.siblings('.column_clicks, .column_installs, .column_organics')
					.each( function (i, v) {
						var id = randomId();
						$(v).addClass(id);
						$(v).attr('alt', id);
						$(v).html( $(v).text() + '<input type="checkbox" class="bigCheckBoxChildren" checked="checked" />' );
						$(v).addClass('checkedTick');
					});
				$('input.bigCheckBoxChildren').uniform();
				$(this).parents('td.plotToggler')
					.siblings('.column_clicks, .column_installs, .column_organics')
					.each( function (i, v) {
						$(v).children('div.checker').addClass('pull-right');
					});
			}else{
				$(this).parents('td.plotToggler')
					.siblings('.column_clicks, .column_installs, .column_organics')
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
			dTbl.$('td.checkedTick').parent('tr').each( function (i, vv) {
				if( $(vv).children('.column_clicks').hasClass('checkedTick') ) {
					var data = dTbl.fnGetData( vv );
					wholeSet.push({'type': 'click', 'color': colorTable[i][0], 'timeslot': data.tsC, 
									'id': $(vv).children('.column_clicks').attr('alt')});
				}
				if( $(vv).children('.column_installs').hasClass('checkedTick') ) {
					var data = dTbl.fnGetData( vv );
					wholeSet.push({'type': 'install', 'color': colorTable[i][1], 'timeslot': data.tsI, 
									'id': $(vv).children('.column_clicks').attr('alt')});
				}
				if( $(vv).children('.column_organics').hasClass('checkedTick') ) {
					var data = dTbl.fnGetData( vv );
					wholeSet.push({'type': 'organic', 'color': colorTable[i][2], 'timeslot': data.tsO, 
									'id': $(vv).children('.column_clicks').attr('alt')});
				}
			});
			plotMe (wholeSet);

		});

		return dTbl;
	};

	function normalize(arr, max) {
		var max = arr[0];
		var min = arr[0];
		for(var x=0; x<arr.length; x++) {
			max = Math.max(m, arr[x]);
		}
		for(var x=0; x<arr.length; x++) {
			min = Math.min(m, arr[x]);
		}
		for(var x=0; x<arr.length; x++) {
			arr[x] = (arr[x] - min) / (max - min);
		}
		return arr;
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
		console.dir(response);
		drawTable( prepData(response) );
		gryphonModel.StopListener();
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
			set += 	'<li class="checkFlt"><a tabindex="-1" href="#">' + columns[i].cvname + '</a></li>';
		}
		console.dir(set);
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
			clicks =   (typeof ts[i].click === 'undefined') ?   0 : ts[i].click;
			installs = (typeof ts[i].install === 'undefined') ? 0 : ts[i].install;
			organics = (typeof ts[i].organic === 'undefined') ? 0 : ts[i].organi;
			dt = new XDate(ts[i].date);

			set['c'].push(clicks);
			set['i'].push(installs);
			set['ci'].push(installs/clicks);
			set['o'].push(organics);
			set['n'].push(dt.toString('d MMM'));
		}
		charted = new Highcharts.Chart({
			'chart': {
				'renderTo': 		'datasetChart',
				'type': 			'area',
				'animation': 		false,
				'backgroundColor': 	'#E9E3D5'
			},
			'title': {
				'text': 			'Clicks / Installs / Organics'
			},
			'legend': {
				'layout': 			'vertical',
				'align': 			'right',
				'verticalAlign': 	'top',
				x: 					-10,
				y: 					10,
				'borderWidth': 		0
			},
			'tooltip': {
				'crosshairs': 		[true, true]				
			},
			'xAxis': 				{'id': 999999, 'categories': set['n']},
			'yAxis': 				[{ 'title': { 'text': '' }}],
			'series': 				[]
	    });
	}

	function plotMe (wholeSet) {
		var sers = charted.series;
		var axes = charted.yAxis;
		for(var s=0; s<charted.series.length; s++) {
			charted.series[s].remove();
		}
		for(var s=0; s<charted.yAxis.length; s++) {
			charted.yAxis[s].remove();
		}

		for(var i in wholeSet) {

			var opp;
			var lineType = '';
			switch (wholeSet[i].type) {
				case 'click':
					lineType = 'ShortDot';
					opp = false;
					break;
				case 'install':
					lineType = 'ShortDash';
					opp = true;
					break;
				case 'organic':
					lineType = 'Dot';
					opp = true;
					break;
				case 'action':
					lineType = 'DashDot';
					opp = false;
					break;
			}

	        charted.addAxis({
	            'id': 			wholeSet[i].id,
	            'title': 		{ text: '' },
	            'lineWidth': 	2,
				'type': 		'linear',
	            'lineColor': 	wholeSet[i].color,
	            'opposite': 	opp
	        }, false, false, false);

			charted.addSeries({
				'id': 			wholeSet[i].id,
				'animation': 	false,
				'name': 		wholeSet[i].type,
				'data': 		normalizeTS (wholeSet[i].timeslot),
				'stacking': 	'normal',
				'dashStyle': 	lineType,
				'yAxis': 		wholeSet[i].id,
				'color': 		wholeSet[i].color,
			}, true, false);
		}

		for(var s=0; s<charted.xAxis.length; s++) {
			if(charted.xAxis[s].id === 999999) {
				charted.xAxis[s].remove();
			}
		}

	};

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