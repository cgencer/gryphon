(function (countlyHandsome, $, undefined) {

	var _this = this;
	var tableNames = [], appsList = [], channelsList = [], campaignsList = [], makilinksList = [], 
	table = [], sexy = [];
	var rootTable = {};
	var plotCache = {};
	var viewParam = {
		'appId': 				'0.000021@APP',
		'campId': 				'',
		'channelId':  			'',
		'makilinkId': 			'',
		'fractionLevel': 		0,
		'reportTypeKeyName': 	''
	};
	var basePager = {
		"_type": 				"Pager", 
		"orderBy": 				"", 
		"pageNum": 				1, 
		"pageSize": 			1, 
		"sort": 				""
	};

	countlyHandsome.extractFromPlot = function(id, periodType, typ) {
		var ret = [];
		var pc = plotCache[id];

		var ks = _.keys( pc );
		if(periodType === 'month'){
			for(var pm in pc[ks[0]]) {								// extracts only the one and only year
				if(pm !== 'c' && pm !== 's') {
					var reg = (typeof pc[ks[0]][pm].c == 'undefined') ? 0 : Number(pc[ks[0]][pm].c);
					var r = {};
					r[ Number(pm) ] = reg;							// month: totalCount, type: m/d
					r.type = typ;
					ret.push(r);
				}
			}
		}else if(periodType === 'day'){
			for(var pm in pc[ks[0]]) {
				for(var pd in pc[ks[0]]) {
					if(pm !== 'c' && pm !== 's') {
						if(pd !== 'c' && pd !== 's') {
							var reg = (typeof pc[ks[0]][pm][pd].c == 'undefined') ? 0 : Number(pc[ks[0]][pm][pd].c);
							var r = {};
							r[ Number(pd) ] = reg;					// ret[day] = totalCount
							r.type = typ;
							ret.push(r);
						}
					}
				}
			}
		}
		return(ret);
	};
	
	countlyHandsome.savePlot = function(label, timeSlot) {
		plotCache[label] = timeSlot;
	};
/*
	TODO create a timer for the saved data
*/
	countlyHandsome.doesPlotExists = function(id) {
		var _f = false;
		if(_.indexOf(_.keys(plotCache), id) == -1){_f = true;}
		return(_f);
	};

	countlyHandsome.retrievePlot = function(id) {
		return(plotCache[id]);
	};
/*
	var sessionDP = countlyHandsome.drawNewChart();
    var keyEvents = countlyCommon.drawTimeGraph(sessionDP.chartDP, "#makina-graph");
    fillKeyEvents(keyEvents);
*/
	countlyHandsome.calcAndDrawPlotPair = function(idC, idI) {
/*
	TODO save clicks/installs into a buffer
*/
		var clck = countlyEvent.extractDataForGraphAndChart( countlyHandsome.retrievePlot(idC, 'year') );
		var inst = countlyEvent.extractDataForGraphAndChart( countlyHandsome.retrievePlot(idI, 'year') );

		var combined = {
			'chartDP': [clck.chartDP[0], inst.chartDP[0]],
			'chartData': [clck.chartData[0], inst.chartData[0]],
			'keyEvents': [clck.keyEvents[0], inst.keyEvents[0]],
		}
		combined.chartDP[0].color = "#882222";		// clicks
		combined.chartDP[0].label = "Clicks";
		combined.chartDP[1].color = "#000000";		// installs
		combined.chartDP[1].label = "Installs";
//		console.dir(combined);

		var keyEvents = countlyCommon.drawTimeGraph(combined.chartDP, "#makina-graph");
		fillKeyEvents(keyEvents);
	};

	countlyHandsome.showCache = function(id) {
		if(countlyHandsome.retrievePlot(id, 'year') != null) {
			console.dir( countlyEvent.extractDataForGraphAndChart( countlyHandsome.retrievePlot(id, 'year') ) );
		}
	};

	countlyHandsome.setappId = function(id) {
		viewParam.appId = id;
	};

	countlyHandsome.setcampId = function(id) {
		viewParam.campId = id;
	};

	countlyHandsome.setchannelId = function(id) {
		viewParam.channelId = id;
	};

	countlyHandsome.setmakilinkId = function(id) {
		viewParam.makilinkId = id;
	};

	countlyHandsome.setfractionLevel = function(id) {
		viewParam.fractionLevel = id;
	};

	countlyHandsome.getappId = function() {
		return(viewParam.appId);
	};

	countlyHandsome.getcampId = function() {
		return(viewParam.campId);
	};

	countlyHandsome.getchannelId = function() {
		return(viewParam.channelId);
	};

	countlyHandsome.getmakilinkId = function() {
		return(viewParam.makilinkId);
	};

	countlyHandsome.getfractionLevel = function() {
		return(viewParam.fractionLevel);
	};

	countlyHandsome.getHAIDwithCAID = function(caid) {
		for(var i in countlyHandsome.appsList) {
			if(caid == countlyHandsome.appsList[i].countlyAppId) {
				return(countlyHandsome.appsList[i].appId);
			}
		}
		return false;
	};

	countlyHandsome.getCAIDwithHAID = function(haid) {
		for(var i in countlyHandsome.appsList) {
			if(countlyHandsome.appsList[i].appId == haid) {
				return(countlyHandsome.appsList[i].countlyAppId);
			}
		}
		return false;
	};

	countlyHandsome.getHAIDwithCAK = function(cak) {
		for(var i in countlyHandsome.appsList) {
			if(countlyHandsome.appsList[i].countlyAppKey == cak) {
				return(countlyHandsome.appsList[i].appId);
			}
		}
		return false;
	};

	countlyHandsome.initialCalls = function () {
		sexy.runChainedEvents( [

			['ListApps', {}, countlyHandsome.ListAppsDone],

			['ListChannel', {}, countlyHandsome.ListChannelsDone],

		], countlyHandsome.globalAjaxFail );
	}

    countlyHandsome.refreshTable = function (packet, mode) {
		if(mode == '0'){

			sexy.runChainedEvents( [
				['GetDashboardReportMap', packet, countlyHandsome.GetDashboardReportMapDone], 
			], this.globalAjaxFail );
		//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
		}else if(mode == '1'){

			if(aid != false){

				countlyHandsome.campaignsList = [];
				var o;
				var aid = $('#selectApp').val();
				var cid = $('#selectChannel').val();
				if(aid == ''){
					o = {'applicationId': '', 'channelId': cid, 'pager': basePager};
				}
				if(cid == ''){
					o = {'channelId': '', 'applicationId': aid, 'pager': basePager};
				}
				if(aid != '' && cid != '') {
					o = {'applicationId': aid, 'channelId': cid, 'pager': basePager};
				}

				sexy.runChainedEvents( [
					['GetDashboardReportMap', packet, countlyHandsome.GetDashboardReportMapDone], 

					['ListCampaign', o, countlyHandsome.ListCampaignsDone]

				], this.globalAjaxFail );
			}
		//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
		}else if(mode == '2'){

			countlyHandsome.makilinksList = [];
			sexy.runChainedEvents( [
				['GetDashboardReportMap', packet, countlyHandsome.GetDashboardReportMapDone], 

				['ListMakilinks', {'campaignId': countlyHandsome.getcampId(), 'pager': basePager, 'routerEnable': false}, countlyHandsome.ListCampaignsDone]
			], this.globalAjaxFail );
		}
	};

	countlyHandsome.initialize = function () {
		plotCache = {};
		sexy = Object.create(cuteNSexy);
		sexy.init();

		$(document).on( "plotData", function (e, data) {				// always listen to render the data
			countlyHandsome.calcAndDrawPlotPair(e.clicker, e.installer);
		});

		$(document).on( "getAChild", function (e, data) {				// always listen to birth of child tables

			var cvs = countlyHandsome.childViewSet(e.lClick, e.lInstall, e.viewSet.ids[0], e.tableFor);
			e.child.viewSet = 				e.viewSet;
			e.child.viewSet.ids = 			cvs.ids;
			e.child.viewSet.content = 		cvs.content;
			e.child.viewSet.rows = 			cvs.content.length;
//console.log(typeof cvs.content);
			e.child.render(e.child.viewSet, e.parentArea);

			for(var j in cvs.content) {
				for(var k in cvs.content[j]) {
					if(k<2){
						e.child.addToStack( { 'value': cvs.content[j][k], 'label': cvs.ids[j][k] } );
					}
				}
			}

		});

		rootTable = Object.create(tableSet);
		rootTable.init(true, true, true, 'year');

		$('#pcarea').html('');

		sexy.runChainedEvents( [

//			['AppWizListUserTokens', {'userId': amplify.store( "uid" )}, countlyHandsome.receivedTokens ],

			['ListApps', {}, countlyHandsome.ListAppsDone],

			['ListChannel', {}, countlyHandsome.ListChannelsDone],

			['GetDashboardReportMap', viewParam, countlyHandsome.GetDashboardReportMapDone ],

		], this.globalAjaxFail );
	};

	countlyHandsome.receivedTokens = function( arr ) {

		var r = '';
		for (idx in arr) {
			r += '' + 
			'<tr id="' + arr[idx].token + '" class="tokenselect">' + 
			'<td id="token">' + arr[idx].token+ '</td>' + 
			'<td id="description">'+arr[idx].desc+'</td>' + 
			'</tr>';
		}
		$('#tokens').html(r);
//		$( "#accordion" ).accordion( "refresh" );

		$('.tokenselect').click( function() {
//			$( "#progressbar" ).progressbar({value: 40});

			sexy.run( 'AppWizResolveToken', {'token': $(this).attr('id')}, countlyHandsome.GetDashboardReportMapDone, countlyHandsome.globalAjaxFail );
			
//			$( "#accordion" ).accordion({ active: 1 });
		});
	};

	countlyHandsome.receivedDetails = function( arr ){
		var r = '';
		var t = {};
		
		for (var idx in arr) {

//			sexy.run( 'AppWizResolveToken', {'token': $(this).attr('id')}, countlyHandsome.GetDashboardReportMapDone, countlyHandsome.globalAjaxFail );

				r += '<tr class="checkDevice" id="'+arr.app.appId+'">' + 
				'<td id="appname">' + arr.app.appName + '</td>' +
				'<td id="marketurl">' + '<a href="' + arr.app.marketUrl + '">' + arr.app.marketUrl + '</a>' +
				'<td id="platform">' + arr.app.platform + '</td>' +
				'<td id="appdesc">' + arr.app.appDescription + '</td></tr>';

		}

		$('#dashlink1').attr('href', arr.app.countlyUrl);
		$('#dashlink2').attr('href', arr.app.countlyUrl);
		$('#dashlink2').text(arr.app.countlyUrl);

		$('#apps').html(r);
		$('#username').html( arr.app.userName );
//		$('#nick').html( " (" + amplify.store( "name" ) + ")" );

/*
		$('#clickDoc').click(function() {
			$( "#progressbar" ).progressbar({value: 80});
			$( "#accordion" ).accordion({ active: 3 });
		});
		$('#clickDevice').click(function() {
			$( "#progressbar" ).progressbar({value: 100});
			$( "#accordion" ).accordion({ active: 4 });
		});
*/

		$('tr.checkDevice').click(function() {
//			$( "#progressbar" ).progressbar({value: 60});
//			$( "#accordion" ).accordion({ active: 2 });
			sexy.run( 'AppWizCheckDevice', {'appId': $(this).attr('id')}, countlyHandsome.GetDashboardReportMapDone, countlyHandsome.globalAjaxFail );
			$('#checkMe').click( function() {
				sexy.run( 'AppWizCheckDevice', {'appId': $(this).attr('id')}, countlyHandsome.GetDashboardReportMapDone, countlyHandsome.globalAjaxFail );
			});
		});
	};

	countlyHandsome.deviceOK = function( arr ) {
		var r = '';
		for (var idx in arr) {

			whenyear = arr[idx].when.date.slice(4,4);
			whenmonth = arr[idx].when.date.slice(2,2);
			whenday = arr[idx].when.date.slice(0,2);
			whenhour = arr[idx].when.date.slice(0,2);
			whenmin = arr[idx].when.date.slice(2,2);
			whensec = arr[idx].when.date.slice(4,2);

			r += '<tr>' + 
			'<td id="ip">' + arr[idx].ipAddress +'</td>' + 
			'<td id="os">' + arr[idx].deviceInfo.deviceOs+ ' (v' + arr[idx].deviceInfo.deviceOsVersion + ')' +'</td>' + 
			'<td id="brandmodel">' + arr[idx].deviceInfo.brandName+' ' + arr[idx].deviceInfo.modelName+ '</td>' + 
			'<td id="resolution">' + arr[idx].deviceInfo.resolutionWidth +' / '+ arr[idx].deviceInfo.resolutionHeight+'</td>' + 
			'<td id="mdate">' + whenday+':'+whenmonth+':'+whenyear + ' / ' + whenhour+':'+whenmin+':'+whensec +'</td>' + 
			'</tr>';
		}
		$('#devices').html(r);
	};

	countlyHandsome.childViewSet = function (cl, il, vs, pt) {
		var dataClick = countlyHandsome.extractFromPlot(cl, pt, 'c');
		var dataInstall = countlyHandsome.extractFromPlot(il, pt, 'i');

		var ids = [];
		var content = [];

		var union = _.values(_.union(dataClick, dataInstall));
		var uniques = [];
		for(var p in union) {
			for(var k in union[p]) {
				if(k !== 'type') {
					uniques.push(Number(k));
				}
			}
		}

		uniques = _.uniq(uniques);
		var pf = countlyHandsome.positionFinder(vs);

		for(var y in uniques){
			if(!ids[ uniques[y] - 1 ]) {ids[ uniques[y] - 1 ] = [];}
			if(!content[ uniques[y] - 1 ]) {content[ uniques[y] - 1 ] = [];}
			for(var x in vs){
				ids[ uniques[y] - 1 ][ x ] = '';
				content[ uniques[y] - 1 ][ x ] = '';
			}
			content[ uniques[y] - 1 ][ 0 ] = 0;
			content[ uniques[y] - 1 ][ 1 ] = 0;
		}

		for(var y in uniques){							// uniques have 1-indexed numbers
			for(var f in pf){
				ids[ uniques[y] - 1 ][ pf[f] ] = countlyHandsome.randomName();
			}
		}
		for(var i in dataClick) {
			if(dataClick[i]['type'] == "c") {
				for(var j in dataClick[i]) {			// months have 1-indexed numbers
					if(j != 'type') {
						content[ j-1 ][ 0 ] = (dataClick[i][j] == '') ? 0 : dataClick[i][j];
					}
				}
			}
		}
		for(var i in dataInstall) {
			if(dataInstall[i]['type'] == "i") {
				for(var j in dataInstall[i]) {
					if(j != 'type') {
						content[ j-1 ][ 1 ] = (dataInstall[i][j] == '') ? 0 : dataInstall[i][j];
					}
				}
			}
		}
		return {'ids': ids, 'content': content};
	};
	
	countlyHandsome.positionFinder = function (arr) {
		var pos = [];
		for(var a in arr) {				// fake recursion, loops for each item
			if(arr[a] !== ''){
				pos.push( arr.indexOf(arr[a]) );
			}
		}
		return pos;
	}

	countlyHandsome.createViewSet = function (package) {

		var obj = {
			'labels': [],
			'editing': [],
			'prefixes': [],
			'suffixes': [],
			'content': [],
			'ids': [],
			'rows': package.length,
		}

		if(!_.isEmpty( package )) {
			var theRow = package[0];
			for(var fid in theRow.fractions) {

				var fract = theRow.fractions[fid];

				var vN = fract.visibleName;
				if(fract.visibleName === 'MAKINA_CLICK'){vN = "Clicks";}
				if(fract.visibleName === 'MAKINA_INSTALL'){vN = "Installs";}

				if(fract.processType === 'Post_CalculateOverCell') {
					obj.editing.push(true);
				}else{
					obj.editing.push(false);
				}
				if(fract.visible === true) {
					obj.labels.push( vN );
					obj.prefixes.push( fract.prefix );
					obj.suffixes.push( fract.suffix );
				}
			}
			for(var row in package) {
				var rowAr = [];
				var theRow = package[row];
				for(var fid in theRow.fractions) {
					var fract = theRow.fractions[fid];
					if(fract.visible === true) {
						if(fract.eventLabels !== null){
							if(fract.eventLabels.length > 0){
								var hash = CryptoJS.SHA256((fract.eventLabels != null) ? fract.eventLabels.join().replace(/[0@_.,]/g,'') : '');
								rowAr.push (hash.toString(CryptoJS.enc.Hex));
							}
						}else{
							rowAr.push ('');
						}
					}
				}
				obj.ids.push(rowAr);
			}
			for(var row in package) {
				var rowAr = [];
				var theRow = package[row];
				for(var fid in theRow.fractions) {
					var fract = theRow.fractions[fid];
					if(fract.visible === true) {
						if(fract.processType === "Direct") {
							rowAr.push(fract.fracValue);
						}else{
							rowAr.push('');
						}
					}
				}
				obj.content.push(rowAr);
			}
			return obj;
		}else{
			alert('There are no events recorded or no installs have been made for this action');
		}
	};

	countlyHandsome.GetDashboardReportMapDone = function(packet, cmd) {

		if(cmd == 'GetDashboardReportMap') {

			if(rootTable.about === 'tableSet'){				// re-initialize
				$('#pcarea').html('');
				delete rootTable;
				rootTable = Object.create(tableSet);
				rootTable.init(true, true, true, 'year', []);
			}

			rootTable.render(countlyHandsome.createViewSet(packet), '#pcarea');

			if(packet !== null) {
				var cr = 0, cc = 0;
				for(var rl in packet) {
					var theRow = packet[rl];
					for(var fid in theRow.fractions) {
						var fract = theRow.fractions[fid];
						if(fract.processType == 'Post_CountlyEventsMap') {
							countlyEvent.getMultiEventData( fract.eventLabels, packet, function(data, packet) {
								countlyHandsome.pusher(data, packet);
							});
						}
						cc++;
					}
					cc = 0;
					cr++;
				}
				cr = 0;
			}else{
				alert('There are no events recorded or no installs have been made for this action');
			}
/*
	TODO check for empty columns in clicks & installs and retrieve them once more
*/

		}
		if(Object.keys( packet ).length == 1) {
			_c = $('#makinaTableBody td.makina_click').eq(0);
			_i = $('#makinaTableBody td.makina_install').eq(0);
			countlyHandsome.calcAndDrawPlotPair(_c ,_i);
		}
	};

    countlyHandsome.getTablePart = function (s) {
		var tbl = {};
		if(s == 'head'){
			tbl = rootTable.tableHead;
		}else if(s == 'body'){
			tbl = rootTable.tableReal;
		}else if(s == ''){
			tbl = rootTable.tableReal;
		}else if(s == 'shadow'){
			tbl = rootTable.tableShadow;
		}else if(s == 'total'){
			tbl = rootTable.tableHead;
		}else if(s == 'hidden'){
			tbl = rootTable.tableHead;
		}
		return tbl;
	};

	countlyHandsome.randomName = function () {
		var s = [];
		var hexDigits = "0123456789abcdef";
		for (var i = 0; i < 36; i++) {
			s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
		}
		return s.join("");
	};

	countlyHandsome.pusher = function(p, pack) {
		rootTable.addToStack(p);
	};

	countlyHandsome.ListApps = function() {
		countlyHandsome.appsList = [];
		countlyHandsome.channelsList = [];
		sexy.runChainedEvents( [

			['ListApps', {}, countlyHandsome.ListAppsDone],

			['ListChannel', {}, countlyHandsome.ListChannelsDone],

		], this.globalAjaxFail );
	};
	
	countlyHandsome.ListCampaigns = function(aid, cid) {
		viewParam.campId = '';
		viewParam.makilinkId = '';
		countlyHandsome.campaignsList = [];
		var o;
		if(aid == ''){
			o = {'applicationId': '', 'channelId': cid, 'pager': basePager};
		}
		if(cid == ''){
			o = {'channelId': '', 'applicationId': aid, 'pager': basePager};
		}
		if(aid != '' && cid != '') {
			o = {'applicationId': aid, 'channelId': cid, 'pager': basePager};
		}
		sexy.run('ListCampaign', o, countlyHandsome.ListCampaignsDone, this.globalAjaxFail);			
	};

	countlyHandsome.ListMakilinks = function(id) {
		viewParam.makilinkId = '';
		countlyHandsome.makilinksList = [];
		sexy.run('ListMakilinks', {'campaignId': id, 'pager': basePager, 'routerEnable': false}, countlyHandsome.ListMakilinksDone, this.globalAjaxFail);
	};

	countlyHandsome.ListAppsDone = function(packet, cmd) {
		if(packet != undefined){
			if(cmd == 'ListApps') {
				countlyHandsome.appsList = packet;
			};
		}else{
			console.error('moddafukkaaa...');
		}
	},

	countlyHandsome.ListChannelsDone = function(packet, cmd) {
		if(packet != undefined){
			if(cmd == 'ListChannel') {
				countlyHandsome.channelsList = packet;
			}
		}else{
			console.error('moddafukkaaa...');
		}
	};

	countlyHandsome.ListCampaignsDone = function(packet, cmd) {
		if(packet != undefined){
			if(cmd == 'ListCampaign') {
				countlyHandsome.campaignsList = packet;
			}
		}else{
			console.error('moddafukkaaa...');
		}
	};

	countlyHandsome.ListMakilinksDone = function(packet, cmd) {
		if(packet != undefined){
			if(cmd == 'ListMakilinks') {
				countlyHandsome.makilinksList = packet;
			}
		}else{
			console.error('moddafukkaaa...');
		}
	};

	countlyHandsome.globalAjaxFail = function(err) {
		console.error(err);
	};

    countlyHandsome.getTableNames = function () {
		return tableNames;
	};

    countlyHandsome.getTable = function () {
		return table;
	};

    countlyHandsome.drawNewChart = function () {

        var chartData = [
                { data:[], label:jQuery.i18n.map["common.table.total-sessions"], color:'#DDDDDD', mode:"ghost" },
                { data:[], label:jQuery.i18n.map["common.table.total-sessions"], color:'#333933' }
		];
		var dataProps = [{
			name:"pt",
			func: function (dataObj) {
				return dataObj["t"]
			},
			period:"previous"
		}, {
			name:"t"
		}];
		var tempObj =  countlyCommon.extractChartData( {"2012":{}} , countlySession.clearSessionObject, chartData, dataProps);
		tempObj.chartDP = countlyHandsome.dummyGrapher();
		return(tempObj);
    };

    countlyHandsome.dummyGrapher = function () {
		var df = [{
			"label": "Total Sessions",
			"color": "#DDDDDD",
//			"mode": "ghost",
			"data": [
				 [0,0],  [1,14],  [2,35],  [3,20],  [4,12],  [5,33],  [6,27],  [7,312],  [8,123],  [9,211],
				[10,440], [11,25], [12,29], [13,45], [14,256], [15,121], [16,333], [17,230], [18,340], [19,45],
				[20,433], [21,345], [22,127], [23,560], [24,540], [25,512], [26,125], [27,230], [28,400], [29,345]
			]
		}, {
			"label": "Total Dummies",
			"color": "#aa2222",
			"data": [
				 [0,0],  [1,14],  [2,35],  [3,20],  [4,12],  [5,33],  [6,27],  [7,312],  [8,123],  [9,211],
				[10,333], [11,230], [12,340], [13,45], [14,440], [15,25], [16,29], [17,45], [18,256], [19,121],
				[20,433], [21,345], [22,127], [23,560], [24,540], [25,512], [26,125], [27,230], [28,400], [29,345]
			]
		}, {
			"label": "Total Blanks",
			"color": "#333933",
			"data": [
				 [0,0],  [1,14],  [2,35],  [3,20],  [4,12],  [5,33],  [6,27],  [7,312],  [8,123],  [9,211],
				[10,433], [11,345], [12,127], [13,560], [14,540], [15,512], [16,125], [17,230], [18,400], [19,345],
				[20,440], [21,25], [22,29], [23,45], [24,256], [25,121], [26,333], [27,230], [28,340], [29,45]
			]
		}];
		return(df);
	};

	countlyHandsome.receivedTokens = function( arr ) {

		var r = '';
		for (idx in arr) {
			r += '' + 
			'<tr id="' + arr[idx].token + '" class="tokenselect">' + 
			'<td id="token">' + arr[idx].token+ '</td>' + 
			'<td id="description">'+arr[idx].desc+'</td>' + 
			'</tr>';
		}
		$('#tokens').html(r);
//		$( "#accordion" ).accordion( "refresh" );

		$('.tokenselect').click( function() {
//			$( "#progressbar" ).progressbar({value: 40});

//			sexy.run( 'AppWizResolveToken', {'token': $(this).attr('id')}, countlyHandsome.GetDashboardReportMapDone, countlyHandsome.globalAjaxFail );

//			$( "#accordion" ).accordion({ active: 1 });
		});
	};

	countlyHandsome.receivedDetails = function( arr ){
		var r = '';
		var t = {};

		for (var idx in arr) {

//			sexy.run( 'AppWizResolveToken', {'token': $(this).attr('id')}, countlyHandsome.GetDashboardReportMapDone, countlyHandsome.globalAjaxFail );

				r += '<tr class="checkDevice" id="'+arr[idx].app.appId+'">' + 
				'<td id="appname">' + arr[idx].app.appName + '</td>' +
				'<td id="marketurl">' + '<a href="' + arr[idx].app.marketUrl + '">' + arr[idx].app.marketUrl + '</a>' +
				'<td id="platform">' + arr[idx].app.platform + '</td>' +
				'<td id="appdesc">' + arr[idx].app.appDescription + '</td></tr>';

		}

		$('#dashlink1').attr('href', arr[idx].app.countlyUrl);
		$('#dashlink2').attr('href', arr[idx].app.countlyUrl);
		$('#dashlink2').text(arr[idx].app.countlyUrl);

		$('#apps').html(r);
		$('#username').html( arr[idx].app.userName );
//		$('#nick').html( " (" + amplify.store( "name" ) + ")" );

/*
		$('#clickDoc').click(function() {
			$( "#progressbar" ).progressbar({value: 80});
			$( "#accordion" ).accordion({ active: 3 });
		});
		$('#clickDevice').click(function() {
			$( "#progressbar" ).progressbar({value: 100});
			$( "#accordion" ).accordion({ active: 4 });
		});
*/

		$('tr.checkDevice').click(function() {
//			$( "#progressbar" ).progressbar({value: 60});
//			$( "#accordion" ).accordion({ active: 2 });
			sexy.run( 'AppWizCheckDevice', {'appId': $(this).attr('id')}, countlyHandsome.GetDashboardReportMapDone, countlyHandsome.globalAjaxFail );
			$('#checkMe').click( function() {
				sexy.run( 'AppWizCheckDevice', {'appId': $(this).attr('id')}, countlyHandsome.GetDashboardReportMapDone, countlyHandsome.globalAjaxFail );
			});
		});
	};

	countlyHandsome.deviceOK = function( arr ) {
		var r = '';
		for (var idx in arr) {

			whenyear = arr[idx].when.date.slice(4,4);
			whenmonth = arr[idx].when.date.slice(2,2);
			whenday = arr[idx].when.date.slice(0,2);
			whenhour = arr[idx].when.date.slice(0,2);
			whenmin = arr[idx].when.date.slice(2,2);
			whensec = arr[idx].when.date.slice(4,2);

			r += '<tr>' + 
			'<td id="ip">' + arr[idx].ipAddress +'</td>' + 
			'<td id="os">' + arr[idx].deviceInfo.deviceOs+ ' (v' + arr[idx].deviceInfo.deviceOsVersion + ')' +'</td>' + 
			'<td id="brandmodel">' + arr[idx].deviceInfo.brandName+' ' + arr[idx].deviceInfo.modelName+ '</td>' + 
			'<td id="resolution">' + arr[idx].deviceInfo.resolutionWidth +' / '+ arr[idx].deviceInfo.resolutionHeight+'</td>' + 
			'<td id="mdate">' + whenday+':'+whenmonth+':'+whenyear + ' / ' + whenhour+':'+whenmin+':'+whensec +'</td>' + 
			'</tr>';
		}
		$('#devices').html(r);
	};


}(window.countlyHandsome = window.countlyHandsome || {}, jQuery));