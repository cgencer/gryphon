var GryphonManagement = (function(GryphonManagement, $, undefined){

	if (amplify.store('uid') === '') {
		window.location.href = 'login';
	}

	['']

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
		createTableset('managementApplications', '#manager', {});
//		createTableset('managementUsers', '#manager', {});

		var obj = {
		    'food': {
		      'healthy': {
		          'fruits': ['apples', 'bananas', 'oranges'],
		          'vegetables': ['salad', 'onions']
		      },
		      'unhealthy': {
		          'fast food': ['burgers', 'chicken', 'pizza']
		      }
		    }
		};

	});
	
	function createTableset (menuPath, into, pl) {
		var ts;
		for(var i in tableSets) {
			if(tableSets[i].path === menuPath){
				ts = tableSets[i];
			}
		}
		$(into).jqGrid({'datatype': 'local', 'colNames': ts.colNames, 'colModel': ts.colModel, 'caption': ts.caption});

		if(type(ts.command) === 'string') {

			cuteNSexy.runChainedEvents([ 
				{'cmd': ts.command, 'payload': pl, 'success': function (set) {
				for(var i in set) {
					$(into).jqGrid('addRowData', i, set[i]);
				}
			} } ]);
			
		}else if(type(ts.command) === 'array') {
/*
'command': [
	{'cmd': 'ListRoles', 'payload': '', 'grab': ''},
	{'cmd': 'ListOrganizations', 'payload': '', 'grab': 'orgId', 'select': '[FIRST]'},
	{'cmd': 'ListUsers', 'payload': '', 'grab': '[WHOLE]'}
],
*/
			var retVal, theLoad;
			var allCalls = [];

			for(var ci in ts.command) {
				console.info('>>> next round is up <<<');
				nextCall = {'cmd': ts.command[ci].cmd, 'payload': retVal, 'success': function (set) {
					if(ts.command[ci].grab === '') {
						retVal = {};
					}else if(ts.command[ci].grab === '[WHOLE]') {
						for(var i in set) {
							$(into).jqGrid('addRowData', i, set[i]);
						}
						console.log('used all values');
					}else{
						retVal = {};
						if(type(ts.command[ci].select) != 'undefined') {
							if(ts.command[ci].select === '[FIRST]') {
								console.log('used first item');
								retVal[ts.command[ci].grab] = set[0];
							}else if(ts.command[ci].select === '[LAST]') {
								console.log('used last item');
								retVal[ts.command[ci].grab] = set[set.length];
							}else if(ts.command[ci].select === '[RANDOM]') {
								console.log('used any item');
								retVal[ts.command[ci].grab] = set[Math.random(set.length)%set.length];
							}
						}else{
							retVal = {};
						}
					}
				}};
				cuteNSexy.runChainedEvents([nextCall]);
				nextCall = {};
			}
		}


	};
	function type (o) {
		var types = {
		    'undefined'        : 'undefined',
		    'number'           : 'number',
		    'boolean'          : 'boolean',
		    'string'           : 'string',
		    '[object Function]': 'function',
		    '[object RegExp]'  : 'regexp',
		    '[object Array]'   : 'array',
		    '[object Date]'    : 'date',
		    '[object Error]'   : 'error'
		},
		tostring = Object.prototype.toString;
	    return types[typeof o] || types[tostring.call(o)] || (o ? 'object' : 'null');
	};

}(window.GryphonManagement = window.GryphonManagement || {}, jQuery));