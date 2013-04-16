var GryphonLogin = (function(GryphonLogin, $, undefined){

	_this = this;
	var objSet = {};
	// init with a fake object to get the dictionary
	function globalFail(err) {
		console.log('error received:\n'+err);
	};
	function initModel () {
		cuteNSexy.init({
			'domain': 		'http://alpha.loxodonta-editor.appspot.com',
			'service': 		'resources/dispatcher/test/v1',
			'cloudId': 		'ff8080813d8c00cb013d8d1e73e00009',
			'appName': 		'loxo',
			'dictionary': {	 
				'GetCmdPaths': 		{'source': 'loxodonta', 'mandatory': [], 'clean': [], 'check': [{'status': "OK"}], 'result': 'pathList'},
				'GetMngTableSet': 	{'source': 'loxodonta', 'mandatory': [], 'clean': [], 'check': [{'status': "OK"}], 'result': 'tableSet'},
				'GetMngObjectSet': 	{'source': 'loxodonta', 'mandatory': [], 'clean': [], 'check': [{'status': "OK"}], 'result': 'objectSet'},
				'GetCmdDict': 		{'source': 'loxodonta', 'mandatory': [], 'clean': [], 'check': [{'status': "OK"}], 'result': 'dictionary'}
			}
		});
	};initModel();
	function sGetCommandPaths(package) {
		amplify.store('paths', package);
	};
	function sGetTableSet(package) {
		amplify.store('tableset', parser(package, objSet));
	};
	function sGetObjectSet(package) {
		objSet = package;
		amplify.store('objectset', parser(package, objSet));
	};
	function sGetCommandDict(package) {
		cuteNSexy.setDictionary(package);
		amplify.store( 'dictionary', package );
		amplify.store( 'sid', cuteNSexy.getSessionID() );

		$('#loginModal').modal({'backdrop': 'static', 'show': true, 'keyboard': false});

		$(document).on('click', '#loginSeconB', function (e) {
			e.preventDefault();
			window.location.href = 'signup';			
		});
		$(document).on('click', '#loginFirstB', function (e) {
			e.preventDefault();
			cuteNSexy.runChainedEvents([ {		'cmd': 'UserLogin', 'success': sLogin,
											'payload': {'userName': 'demo', 'pass': 'demo'} } ], globalFail);
		});
	};
	function sLogin(package, cmd) {
		// if userLogged > load dashboard
		amplify.store( 'uid', package.userId );
		window.location.href = 'dash';
	};
	function parser (theSet, oS) {
		for (var i=0; i < 2; i++) {					// 2-levels of nestedness
			var theSet = $.toJSON(theSet);
			for(var oi in oS) {
				rexp = new RegExp('{\\"\\[INJECT\\]\\":\\"' + _.keys(oS[oi])[0] + '\\"}', 'g');
				theSet = theSet.replace(rexp, $.toJSON( _.values( oS[oi])[0] ) );
			}
			theSet = $.evalJSON(theSet);
		};
		return(theSet);
	}

	$(document).ready( function() {
		console.log('starting the login procedure...');
		cuteNSexy.runChainedEvents([ 	{'cmd': 'GetCmdPaths', 		'success': sGetCommandPaths },
										{'cmd': 'GetMngObjectSet', 	'success': sGetObjectSet },
										{'cmd': 'GetMngTableSet', 	'success': sGetTableSet },
										{'cmd': 'GetCmdDict', 		'success': sGetCommandDict }
		], globalFail);

	});

}(window.GryphonLogin = window.GryphonLogin || {}, jQuery));