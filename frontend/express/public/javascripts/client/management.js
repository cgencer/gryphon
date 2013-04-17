var GryphonManagement = (function(GryphonManagement, $, undefined){

	if (amplify.store('uid') === '') {
		window.location.href = 'login';
	};

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
	var tsIndex = 0;
	var theLoad = {};
	var whichTable = '';
	var theModal = '';

	$(document).ready(function() {

		objectSets = amplify.store('objectset');
		tableSets = amplify.store('tableset');

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

		$('div.subLinks').each( function () {
			$('#managementModal').clone().appendTo('body').attr('id', $(this).attr('id')+'Modal');
		});

		$(document).on('click', 'div.subLinks' , function () {
			$('.rightSide').html('<table id="manager"></table>');
			whichTable = $(this).attr('id');
			createTableset(whichTable, '#manager', {});
		});

		$(document).on('click', '.editButton' , function () {
			selObj = _.omit($("#manager").jqGrid('getRowData', $('#manager').jqGrid('getGridParam','selrow')), 'editButton');
			console.dir(selObj);
			$('#'+$(this).attr('alt')+'Modal').modal('toggle');
		});

	});


	
	function createTableset (menuPath, into, pl) {
		var ts;
		for(var i in tableSets) {
			if(tableSets[i].path === menuPath){
				ts = tableSets[i];
			}
		}
		cn = ts.colNames;
		cn.push('');
		cm = ts.colModel;
		cm.push({'width':50, 'name': 'editButton'});
		$(into).jqGrid({
			'datatype': 'local', 'colNames': cn, 'colModel': cm, 'caption': ts.caption, 
			'height': 'auto', 'altRows': true, 'altclass': 'tesla', 
			'hidegrid': false, 'ignoreCase': true, 'shrinkToFit': true,
		});

		if(type(ts.command) === 'string') {

			cuteNSexy.runChainedEvents([ 
				{'cmd': ts.command, 'payload': pl, 'success': function (set) {
				for(var i in set) {
					$(into).jqGrid('addRowData', i, set[i]);
				}
				$('[aria-describedby="manager_editButton"]').html('<button class="btn btn-primary editButton" alt="' +ts.path+ '" type="button">Edit</button>');
				
			} } ]);
			
		}else if(type(ts.command) === 'array') {
/*
'command': [
	{'cmd': 'ListRoles', 'payload': '', 'grab': ''},
	{'cmd': 'ListOrganizations', 'payload': '', 'grab': 'orgId', 'select': '[FIRST]'},
	{'cmd': 'ListUsers', 'payload': '', 'grab': '[WHOLE]'}
],
*/

			retVal = {};
			tsIndex = 0;
			
			$(document).one(ts.command[tsIndex].cmd + 'ReceivedAndProccessedChainedSet', function () {
				console.log('here i come...');
				console.log('NEXT CMD: '+ts.command[tsIndex].cmd);
				console.log(tsIndex +'<->'+ ts.command.length);
				if(tsIndex < ts.command.length-1) {
					callee ( ts.command[tsIndex], tsIndex );
					tsIndex++;
				} else {
					tsIndex = 0;
				}
			});
			// trigger the first one manually to start the chain...
			callee ( ts.command[tsIndex], tsIndex );
			tsIndex++;
		}
	};

	function callee (tsItem, ci) {
console.log('calling '+tsItem.cmd);
		cuteNSexy.runChainedEvents( [{'cmd': tsItem.cmd, 'payload': theLoad, 'success': function (set) {
			console.log('received '+tsItem.cmd);
			console.dir(tsItem);

			recPack (set);

			console.info('NEXT:');
			console.dir(theLoad);
			$.event.trigger({'type': tsItem.cmd + 'ReceivedAndProccessedChainedSet'});

		}}] );
	}

	function recPack () {
		switch (tsItem.grab) {
			case '':
				theLoad = {};
				break;
			case '[WHOLE]':
				for(var i in set) {
					$(into).jqGrid('addRowData', i, set[i]);
				}
				theLoad = {};
				break;
			default:

				if(tsItem.command[ci].select === '[FIRST]') {

					console.log('used first item');
					theLoad[tsItem.grab] = set[0][tsItem.grab];

				}else if(tsItem.select === '[LAST]') {

					console.log('used last item');
					theLoad[tsItem.grab] = set[set.length][tsItem.grab];

				}else if(tsItem.select === '[RANDOM]') {

					console.log('used any item');
					theLoad[tsItem.grab] = set[Math.random(set.length)%set.length][tsItem.grab];

				}

				break;
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