var GryphonManagement = (function(GryphonManagement, $, undefined){

	function globalFail(err) {
		console.log('error received:\n'+err);
	};
	function initModel () {
		cuteNSexy.switchToLoxo();
		if(Object.keys(amplify.store('paths')).length>0){cuteNSexy.setPaths(amplify.store('paths'));}else{
			console.log('Login / Paths object not found!!!');
		}
		if(Object.keys(amplify.store('tableset')).length>0){cuteNSexy.setPaths(amplify.store('tableset'));}else{
			console.log('Table settings object not found!!!');
		}
		if(Object.keys(amplify.store('objectset')).length>0){cuteNSexy.setPaths(amplify.store('objectset'));}else{
			console.log('Object sets not found!!!');
		}
		if(Object.keys(amplify.store('dictionary')).length>0){cuteNSexy.setDictionary(amplify.store('dictionary'));}else{
			console.log('Login / Dictionary object not found!!!');
		}
		console.dir(amplify.store('dictionary'));
		console.log('User ID is: '+amplify.store('uid'));
		console.log('Sess ID is: '+amplify.store('sid'));

		
		if(amplify.store('sid')!=''){cuteNSexy.setSessionID(amplify.store('sid'));}
		else{amplify.store('sid',cuteNSexy.getSessionID());}

		cuteNSexy.runChainedEvents([ {'cmd': 'GetMenuItems', 'success': sMenuReceived,
										'payload': {'userId':amplify.store('uid')} } ], globalFail);

		cuteNSexy.switchToHandsome();
		function sMenuReceived(package) {
			console.dir(package);
		}
	};initModel();

	var tableSets = [];

	$(document).ready(function() {

		objectSets = amplify.store('objectset');
		tableSets = amplify.store('tableset');
		createTableset('managementOrganizations', '#manager', 'ListOrganizations', {});


	});
	
	function createTableset (menuPath, into, cmd, pl) {
		var ts;
		for(var i in tableSets) {
			if(tableSets[i].path === menuPath){
				ts = tableSets[i];
			}
		}
		$(into).jqGrid({'datatype': 'local', 'colNames': ts.colNames, 'colModel': ts.colModel, 'caption': ts.caption});
		cuteNSexy.runChainedEvents([ {'cmd': cmd, 'success': function (set) {
			for(var i in set) $(into).jqGrid('addRowData', i, set[i]);
		}, 'payload': pl } ]);

	};


}(window.GryphonManagement = window.GryphonManagement || {}, jQuery));