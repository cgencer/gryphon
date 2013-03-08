var tableSet = {
	'_ts': this,
	'about': 'tableSet',
	'viewSet': {},
	'dataSet': [],
	'eventData': {}, 
	'clicks': [],
	'installs': [],
	'ciset': [],
	'cell': '',
	'header': {'columns': [], 'idss': []},
	'storage': [],
	'tableHead': {},
	'tableReal': {},
	'tableShadow': {},
	'renderInto': '',
	'showHeader': true,
	'showFooter': true,
	'initialCost': 10000,
	'noMoreRenderForMe': false,
	'editing': false,
	'tableRealName': '',
	'tableShadowName': '',
	'drillsDown': true,
	'rootClickId': '',
	'rootInstallId': '',
	'myChild': {},
	'tableFor': '',
	'namesTable': [],

	init: function(drillable, hFlag, fFlag, tf, names) {
		this.drillsDown = drillable;
		this.showHeader = hFlag;
		this.showFooter = fFlag;
console.log('new init with: '+tf);
		this.tableFor = tf;
		this.namesTable = names;
		this.tableRealName = CountlyHelpers.randomId();
		this.tableShadowName = CountlyHelpers.randomId();
	},

	inheritIDs: function (c, i) {
		this.rootClickId = c;
		this.rootInstallId = i;
	},

	render: function (buff, into) {
		this.cleanUp();
		if(Object.keys(buff).length > 0){

			this.viewSet = buff;
			this.renderInto = into;
//console.log(this.renderInto);
//console.dir(this.viewSet.content);
			this.renderShell();
		}
	},

	renderWithValuesFinished: function (dp) {
		$('.'+dp.label).html( dp.value );
	},

	renderShell: function () {				// ids as parameter due the child needs it re-prepared 
		var tableReal = $('<table width="100%" id="'+this.tableRealName+'" class="makinaTables">');
		var tableShadow = $('<table width="100%" id="'+this.tableShadowName+'" class="makinaTables">');
/*
	TODO all field attributes have to be prefixed with the tablenames (confusion between child & parent object fields occurs)
*/
		var tx = "";
		for(var k in this.viewSet.labels) {
			trim = this.viewSet.labels[k].toLowerCase().replace(' ','');
			tx += '<th class="var_' + trim + '" title="'+this.viewSet.prefixes[k]+'" alt="'+this.viewSet.suffixes[k]+'">' + this.viewSet.labels[k] + '</th>';
		}
		if(this.showHeader) {
			tableReal.append('<thead>').children('thead').append('<tr />').children('tr').append(tx);
		}
		if(this.showFooter) {
			tableReal.append('<tfoot>').children('tfoot');
		}

		var tx = "";
		var ser = 0;

		for(var r in this.viewSet.ids) {
			tx += '<tr>';
			for(var c in this.viewSet.labels) {
				trim = this.viewSet.labels[ c ].toLowerCase().replace(' ','');
				edi = (this.viewSet.editing[ c ] === true) ? 'editMe' : 'dontTouchMe';
				tx += 	'<td class="var_' + trim + ' cell_' + ser + ' ' + edi + '" ' +
							'id="' + 	this.viewSet.ids[r][c] 		+ '" ' +
							'title="' + this.viewSet.prefixes[c] 	+ '" ' + 
							'alt="' + 	this.viewSet.suffixes[c] 	+ '"> </td>';
				ser++;
			}
			tx += '</tr>';
		}
		tableReal.append('<tbody id="'+this.tableRealName+'Body" />').children('tbody').append(tx);
		tableShadow.append('<tbody id="'+this.tableShadowName+'Body" />').children('tbody').append(tx);
		$(this.renderInto).html( tableReal );
		if($('#shadowLands').children('table#'+this.tableShadowName).length === 0) {	// append only if it doesnt exist
			$('#shadowLands').append( tableShadow );
		}

		$('#'+this.tableShadowName+' td.editMe').each( function (i, o) {
			var cx = $(o).attr('class').split(' ');
			for(var cxi in cx){
				if(cx[cxi].substr(0,5) === 'cell_'){
					$(o).attr('id', cx[cxi]);
				}
			}
		});

		// put the static content into the fields
		for(var i=0; i < this.viewSet.rows; i++){
			var rowAr = this.viewSet.content[i];
			var rowP = $('#'+this.tableRealName+'Body').children('tr').eq(i);
			for(var j in rowAr) {
				if(rowAr[j] != "") {
					$(rowP).children('td').eq(j).html( rowAr[j] );
				}
			}
		}

		// copy the grouping colums from end to begin
		$('#'+this.tableRealName+' thead tr').each( function() {
			var tr = $(this);
			var src = tr.find('th.var_application, th.var_channel, th.var_campaign, th.var_period');
			src.detach().insertBefore(tr.find('th.var_clicks'));
		});
		$('#'+this.tableRealName+' tr').each( function() {
			var tr = $(this);
			var src = tr.find('td.var_application, td.var_channel, td.var_campaign, td.var_period');
			src.detach().insertBefore(tr.find('td.var_clicks'));
		});

		// copy the first row into the footer
		if(this.showFooter === true) {
			var tx = '';
			$('#'+this.tableRealName+'Body tr:first').children('td').each( function (i, o) {
				na = $(o).attr('class').split(' ');
				for(var a in na){
					if(na[a].substr(0,4) === "var_"){
						var nam = na[a];
					}
				}
				tx += '<td class="sumRow" id="sum_'+nam+'" title="'+$(o).attr('title')+'" alt="'+$(o).attr('alt')+'"></td>';
			} );
			$('#'+this.tableRealName+' tfoot').append('<tr />').children('tr').html(tx);
		}

		if(this.tableFor === 'month') {
//			$('#'+this.tableRealName+' tr td:first').text( this.namesTable[] ).css('text-align', 'right');
		}

		$('#'+this.tableRealName+' tbody tr').each( function(i, v) {
			$('<td class="driller" style="width:32px;"><div class="drillDown"></div></td>').insertBefore( $(v).children('td:first-child') );
		});
		$('<th style="width:32px;"></th>').insertBefore( $('#'+this.tableRealName+' thead tr th:first-child') );
		$('<td style="width:32px;"></td>').insertBefore( $('#'+this.tableRealName+' tfoot tr td:first-child') );
	},
	
	addToStack: function (p) {
		doesExits = false;
		for(var i in this.dataSet) {
			if(this.dataSet[i].label === p.label) {
				doesExits = true;
			}
		}
		if(doesExits === false) {
			this.dataSet.push(p);
		}

		this.renderWithValuesFinished(p);

		if(this.dataSet.length === this.viewSet.ids.length * 2) {
			// all values retrieved
			this.renderChilds();

			$.event.trigger({'type': "DashboardReportBuildFinished", 'message': '', 'time': new Date()});
		}
	},

/*
	TODO calculate trough clicks/installs at begin
*/
	cleanOnlyTable: function () {
//		$('#'+this.tableRealName+'Body').html('');
//		$('#pcarea').html('');
	},

	renderChilds: function () {
		for(var i in this.dataSet) {
			$('#'+this.tableRealName+' td#' + this.dataSet[i].label).html('<div class="cellContent"><nobr>' + 
				$('#'+this.tableRealName+' td#' + this.dataSet[i].label).attr('title') +
				this.dataSet[i].value +
				$('#'+this.tableRealName+' td#' + this.dataSet[i].label).attr('alt') +
			'</nobr></div>');
			$('#'+this.tableShadowName+' td#' + this.dataSet[i].label).text(this.dataSet[i].value);
		}
		this.events();
		this.postRenderTable();
	},

	cleanUp: function() {
		this.clicks, this.installs, this.ciset = [];
		this.header = {'columns':[], 'idss':[]};
		this.tebleHead, this.tableReal, this.tableShadow, this.eventData = {};
		this.cleanOnlyTable();
	},

	// parsing

	// rendering

	calculateAllRows: function() {
		var _ts = this;
		$('#'+this.tableRealName+'Body tr').each( function(i, v) {
			_ts.calcARow( $(v), null );
		});
	},

	calcARow: function (theRow, newCost) {	// newcost null yerine deger verilirse onu kullan; cost'u editlenen alana gore hesapla 
		var cost = 0;
		cost = (newCost !== null) ? newCost : this.initialCost;
		cost = Math.round(cost * 100) / 100;

		var thereIsAZero = false;
		clicks = Number( $(theRow).children('.var_clicks').text() );
		installs = Number( $(theRow).children('.var_installs').text() );

		destCPD = $(theRow).children('.var_cpd');
		destCPC = $(theRow).children('.var_cpc');
		destCR = $(theRow).children('.var_conversionrate');
		destCOST = $(theRow).children('.var_cost');
		shdwCPD = $("#"+this.tableShadowName+' tr#'+$(theRow).attr('alt')).children('.var_cpd');
		shdwCPC = $("#"+this.tableShadowName+' tr#'+$(theRow).attr('alt')).children('.var_cpc');
		shdwCR = $("#"+this.tableShadowName+' tr#'+$(theRow).attr('alt')).children('.var_conversionrate');
		shdwCOST = $("#"+this.tableShadowName+' tr#'+$(theRow).attr('alt')).children('.var_cost');

		if(clicks === 0 || installs === 0 || clicks === NaN || installs === NaN) {
			thereIsAZero = true;
		}

		$(destCOST).html( '<div class="cellContent"><nobr>' + 
							$(destCOST).attr('title') + ' ' + this.formatNumber(cost) + ' ' + $(destCOST).attr('alt') +
							'</nobr></div>');
		shdwCOST.text(cost);
		$(shdwCOST).attr('class', $(shdwCOST).attr('class') + ' noEmpty');

		if(!thereIsAZero) {
			c = Math.round((clicks / installs) * 100) / 100;
			$(destCR).html( '<div class="cellContent"><nobr>' + 
							$(destCR).attr('title') + ' ' + this.formatNumber(c) + ' ' + $(destCR).attr('alt') +
							'</nobr></div>');
			$(shdwCR).text(c);
			$(shdwCR).attr('class', $(shdwCR).attr('class') + ' noEmpty');
		}else{
			$(destCR).html( '<small>[ n/a ]</small>' );
			$(shdwCR).text('');
		}

		if(clicks > 0 || !thereIsAZero) {
			newcpc = cost / clicks;
			c = Math.round(newcpc * 100) / 100;
			$(destCPC).html( '<div class="cellContent"><nobr>' + 
							$(destCPC).attr('title') + ' ' + this.formatNumber(c) + ' ' + $(destCPC).attr('alt') +
							'</nobr></div>');
			$(shdwCPC).text(c);
			$(shdwCPC).attr('class', $(shdwCPC).attr('class') + ' noEmpty');
		}else{
			$(destCPC).html( '<small>[ n/a ]</small>' );
			$(shdwCPC).text('');
		}
		if(installs > 0 || !thereIsAZero) {
			newcpd = cost / installs;
			c = Math.round(newcpd * 100) / 100;
			$(destCPD).html( '<div class="cellContent"><nobr>' + 
							$(destCPD).attr('title') + ' ' + this.formatNumber(c) + ' ' + $(destCPD).attr('alt') +
							'</nobr></div>');
			$(shdwCPD).text(c);
			$(shdwCPD).attr('class', $(shdwCPD).attr('class') + ' noEmpty');
		}else{
			$(destCPD).html( '<small>[ n/a ]</small>' );
			$(shdwCPD).text('');
		}
	},

	formatNumber: function ( num, fixed ) { 
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
	},

	calcCells: function (input) {
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
	},

	calculateSumsOfRows: function() {
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
	},

	postRenderTable: function () {
		// this puts the id's of both fileds in each row into their siblings alt attribute (to retrieve when doing on-the-fly's)
		// also puts the same value into the alt field of the parent TR

		$('#'+this.tableRealName+'Body tr').each( function(i, v) {
			var cmb = $(v).children('td.var_clicks').attr('id') + '_' + $(v).children('td.var_installs').attr('id');
			$(this).attr('alt', cmb);
		})
		$('#'+this.tableShadowName+' tr').each( function(i, v) {
			var cmb = $(v).children('td.var_clicks').attr('id') + '_' + $(v).children('td.var_installs').attr('id');
			$(this).attr('id', cmb);
		})

		// this removes the event on the rows which have 0 as clicks or installs value, also removes the hover coloring
		$('#'+this.tableRealName+'Body tr td.driller').each( function (ri, c) {
			row = $(this).parent('tr');
			if( Number($(row).children('td.var_clicks').text()) == 0 || Number($(row).children('td.var_installs').text() ) == 0) {
				$(row).css('background-color', 'transparent');
				$(row).children('td').each( function (ci, cell) {
//					$(document).off('click', $(cell).attr('title'));
				});
				$(c).children('div').removeAttr('class');
			}
		});

		this.calculateAllRows();

		this.calculateSumsOfRows();
/*
		// add background to each editable cell (with relation to clicks/installs containing non-zero values)
		$('#'+this.tableRealName+' td').each( function () {
			if 	( (Number($(this).siblings('.makina_click').text()) > 0 && $(this).hasClass('var_cpc') ) || 
				(Number($(this).siblings('.makina_install').text()) > 0 && $(this).hasClass('var_cpd') ) ) {
					$(this).css('background-image', "url('/images/dashboard/editMe.png')");
					$(this).css( 'width', Math.floor($(this).width()) + 30);
			}
		});

*/	},

	events: function () {
		var _ts = this;
		$(document).ready(function() {
			var __ts = _ts;
/*
	TODO when same row gets clicked, it duplicates the childtable
*/
			$(document).on('click', '#'+_ts.tableRealName+'Body tr td.dontTouchMe', function () {
				$.event.trigger({	'type': "plotData", 
									'clicker': $(this).siblings('.var_clicks').attr('id'), 
									'installer': $(this).siblings('.var_installs').attr('id') });
			});

			$(document).on('click', '#'+_ts.tableRealName+'Body tr td.driller', function () {
/*
	TODO save drilled items, so you can close them later, on a 2nd click
*/
				var parentRow = $(this).parent('tr');

				if(_ts.rootClickId === '') {
					_ts.rootClickId = $(this).siblings('.var_clicks').attr('id');
					_ts.rootInstallId = $(this).siblings('.var_installs').attr('id');
				}

				if(_ts.tableFor === 'year') {
					var tf = 'month';
				}else if(_ts.tableFor === 'month') {
					var tf = 'day';
				}
				
				if(_ts.drillsDown) {
					// kill the event of the opener row
					$(parentRow).css('background-color', 'transparent');

					namesTable = (tf === 'month') ?
 								[	'January', 'February', 'March', 'April', 'May', 'June', 
								'July', 'August', 'September', 'October', 'November', 'December'] :

								[	'01', '02', '03', '04', '05', '06', '07', '08', '09', '10',
									'11', '12', '13', '14', '15', '16', '17', '18', '19', '20',
									'21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31'];

					$('<tr><td colspan="' + ($(parentRow).children('td').length) + '" '+
								'id="' + _ts.tableRealName + '_' + tf + '_childTableBody">' + 
								'</td></tr>').insertAfter( $(parentRow) );

					_ts.myChild = Object.create(tableSet);
					_ts.myChild.init(true, false, true, tf, namesTable);

					// ensures that the click/install ID's of the real dataset are used on months/days trough saving them
					_ts.myChild.inheritIDs(_ts.rootClickId, _ts.rootInstallId);
console.log('#' + _ts.tableRealName + '_' + tf + '_childTableBody');
					$.event.trigger({'type': "getAChild", 'parentArea': '#' + _ts.tableRealName + '_' + tf + '_childTableBody',
					 				'lClick': 	_ts.rootClickId, 'lInstall': _ts.rootInstallId, 
									'tableFor': tf, 'viewSet': _ts.viewSet, 'child': _ts.myChild
					});

					$('#' + __ts.tableRealName + 'innerTableBody tr td').each( function (i, o) {
						$(o).width( $(parentRow).children('td').eq(i).width() );
					});
					
				}
			});

			$(document).on('keypress', '.realLiveWire', function (event) {
				if(_ts.editing) {
					var keycode = (event.keyCode ? event.keyCode : event.which);
					if(event.keyCode == 13) {
						_ts.calcCells( $(this) );
						_ts.editing = false;
					}
					$('#' + __ts.tableRealName + 'innerTableBody tr td').each( function (i, o) {
						$(o).width( $(parentRow).children('td').eq(i).width() );
					});
				}
			});

			// had to iterate each cell to bind event, whereafter removal of the event can be made on each cell
			$(document).on('click', '#'+_ts.tableRealName+' td.editMe', function () {
				if(!_ts.editing) {
					if 	( (Number($(this).siblings('.var_clicks').text()) > 0 && $(this).hasClass('var_cpc') ) || 
						(Number($(this).siblings('.var_installs').text()) > 0 && $(this).hasClass('var_cpd') ) ) {

						var cx = $(this).attr('class').split(' ');
						for(var i in cx) {
							if(cx[i].substr(0,5) === "cell_") {
								cellRealValue = Number($('#'+_ts.tableShadowName+'Body #'+cx[i]).text());
							}
						}

						cellWidth = $(this).children('div').width() + 30;
						$(this).parent('tr').blur();
						$(this).html('<input type="text" class="realLiveWire" style="width:'+cellWidth+'px;" value="'+cellRealValue+'" />');
						$(this).children('input').focus();
						_ts.editing = true;					
					}
				}
			});

		});
	},
};