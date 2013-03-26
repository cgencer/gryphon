var GryphonLogin = (function(GryphonLogin, $, undefined){

	_this = this;
	// init with a fake object to get the dictionary
	cuteNSexy.init({
		domain: 'http://alpha.loxodonta-editor.appspot.com:80',
		service: 'resources/dispatcher/test/v1',
		cloudId: 'ff8080813d8c00cb013d8d1e73e00009',
		appName: 'loxo',
		dictionary: {	 
				 'GetCommandPaths': {'source': '', 'mandatory': [], 'clean': [], 'check': [{'status': "OK"}], 'result': 'pathList'},
			'GetCommandDictionary': {'source': '', 'mandatory': [], 'clean': [], 'check': [{'status': "OK"}], 'result': 'dictionary'}
		}
	});

	function sGetCommandPaths(package) {
		console.dir(package);
		$.localStorage( 'paths', package );
//		amplify.store('paths', package);
	};
	function sGetCommandDict(package) {
		cuteNSexy.setDictionary(package);
		amplify.store( 'dictionary', package );
//		amplify.store('dictionary', package);

		//only run after the new dict has been retrieved (as it has the url patterns)
		$(document).on('click', 'button.btn', function (e) {
			e.preventDefault();
			cuteNSexy.runChainedEvents([ {		'cmd': 'UserLogin', 'success': sLogin, 'fail': fail,
											'payload': {'userName': 'demo', 'pass': 'demo'} } ]);
		});
	};
	function sLogin(package) {
		// if userLogged > load dashboard
		console.dir(package);
		$('form').submit();
	};

	function fail(err) {
		console.log('error received:\n'+err);
	};

	$(document).ready( function() {
		console.log('starting the login procedure...');
		cuteNSexy.runChainedEvents([ 	{'cmd': 'GetCommandPaths', 'success': sGetCommandPaths, 'fail': fail },
										{'cmd': 'GetCommandDictionary', 'success': sGetCommandDict, 'fail': fail }
		]);

		
	});

}(window.GryphonLogin = window.GryphonLogin || {}, jQuery));