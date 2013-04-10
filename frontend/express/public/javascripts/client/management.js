var GryphonManagement = (function(GryphonManagement, $, undefined){

	function globalFail(err) {
		console.log('error received:\n'+err);
	};
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
		if(amplify.store('sid')!='')
			{cuteNSexy.setSessionID(amplify.store('sid'));console.log('setting to '+cuteNSexy.getSessionID());}
		else
			{amplify.store('sid',cuteNSexy.getSessionID());console.log('getting');}

		cuteNSexy.runChainedEvents([ {'cmd': 'GetMenuItems', 'success': sMenuReceived,
										'payload': {'userId':amplify.store('uid')} } ], globalFail);

		function sMenuReceived(package) {
			console.dir(package);
		}
	};initModel();

	var datas;

	cuteNSexy.runChainedEvents([ {'cmd': 'GetMenuItems', 'isReal': false, 'success': globalFail, 
	'payload': {'userId': amplify.store('uid'), 'session': amplify.store('sid'),

	} } ]);
console.log(cuteNSexy.getURL(false));


	$('#list').jqGrid({
		url: 			cuteNSexy.getURL(false),
		datatype: 		'jsonp',
		mtype: 			'GET',
		jsonReader: { 
			root: 'rows', 
			page: 'page', 
			total: 'total', 
			records: 'records', 
			repeatitems: true, 
			cell: 'cell', 
			id: 'id',
			userdata: 'userdata',
			subgrid: { 
				root:'rows', 
				repeatitems: true, 
				cell:'cell' 
			} 
		},
		colNames: 		['Inv No', 'Date', 'Amount', 'Tax', 'Total', 'Notes'],
		colModel: 		[ 
			{name: 'invid', 		index: 'invid', 		width:  55}, 
			{name: 'invdate', 		index: 'invdate', 		width:  90}, 
			{name: 'amount', 		index: 'amount', 		width:  80, 	align:'right'}, 
			{name: 'tax', 			index: 'tax', 			width:  80, 	align:'right'}, 
			{name: 'total', 		index: 'total', 		width:  80, 	align:'right'}, 
			{name: 'note', 			index: 'note', 			width: 150, 	sortable:false} 
		],
		pager: 			'#pager',
		rowNum: 		10,
		rowList: 		[10, 20, 30],
		sortname: 		'invid',
		sortorder: 		'desc',
		viewrecords: 	true,
		gridview: 		true,
		caption: 		'My first grid'
	});

}(window.GryphonManagement = window.GryphonManagement || {}, jQuery));