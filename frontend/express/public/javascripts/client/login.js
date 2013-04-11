var GryphonLogin = (function(GryphonLogin, $, undefined){

	_this = this;
	// init with a fake object to get the dictionary
	cuteNSexy.init({
		'domain': 		'http://alpha.loxodonta-editor.appspot.com',
		'service': 		'resources/dispatcher/test/v1',
		'cloudId': 		'ff8080813d8c00cb013d8d1e73e00009',
		'appName': 		'loxo',
		'dictionary': {	 
				 'GetCommandPaths': {'source': 'loxodonta', 'mandatory': [], 'clean': [], 'check': [{'status': "OK"}], 'result': 'pathList'},
		'GetManagementTableSettings': {'source': 'loxodonta', 'mandatory': [], 'clean': [], 'check': [{'status': "OK"}], 'result': 'tableSet'},
		'GetManagementObjectSet': {'source': 'loxodonta', 'mandatory': [], 'clean': [], 'check': [{'status': "OK"}], 'result': 'objectSet'},
			'GetCommandDictionary': {'source': 'loxodonta', 'mandatory': [], 'clean': [], 'check': [{'status': "OK"}], 'result': 'dictionary'}
		}
	});

	function sGetCommandPaths(package) {
		amplify.store('paths', package);
	};
	function sGetTableSettings(package) {
		amplify.store('tableset', package);
	};
	function sGetObjectSet(package) {
		amplify.store('objectset', package);
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
			cuteNSexy.runChainedEvents([ {		'cmd': 'UserLogin', 'success': sLogin, 'fail': fail,
											'payload': {'userName': 'demo', 'pass': 'demo'} } ]);
		});
	};
	function sLogin(package, cmd) {
		// if userLogged > load dashboard
		amplify.store( 'uid', package.userId );
		window.location.href = 'dashboard';
	};

	function fail(err) {
		console.log('error received:\n'+err);
	};

	$(document).ready( function() {
		console.log('starting the login procedure...');
		cuteNSexy.runChainedEvents([ 	{'cmd': 'GetCommandPaths', 'success': sGetCommandPaths },
										{'cmd': 'GetManagementOnjectSet', 'success': sGetObjectSet },
										{'cmd': 'GetManagementTableSettings', 'success': sGetTableSettings },
										{'cmd': 'GetCommandDictionary', 'success': sGetCommandDict }
		], fail);

		
	});

}(window.GryphonLogin = window.GryphonLogin || {}, jQuery));