var GryphonLogin = (function(GryphonLogin, $, undefined){

	_this = this;
	// init with a fake object to get the dictionary
	cuteNSexy.init({
		domain: 'http://alpha.loxodonta-editor.appspot.com:80',
		service: 'resources/dispatcher/test/v1/',
		cloudId: 'ff8080813d8c00cb013d8d1e73e00009',
		appName: 'loxo',
		dictionary: {	 'GetCommandPaths': {'mandatory': [], 'clean': [], 'check': [{'status': "OK"}], 'result': 'pathList'},
					'GetCommandDictionary': {'mandatory': [], 'clean': [], 'check': [{'status': "OK"}], 'result': 'dictionary'}}
	});

	function sGetCommandPaths(package) {
		console.dir(package);
	};
	function sGetCommandDict(package) {
		cuteNSexy.setDictionary(package);
	};
	function sLogin(package) {
		// if userLogged > load dashboard
	};

	function fail(err) {
		console.log('error received:\n'+err);
	};

	$(document).ready( function() {
		console.log('starting the login procedure...');
		cuteNSexy.runChainedEvents([ 	{'cmd': 'GetCommandPaths', 'success': sGetCommandPaths, 'fail': fail },
										{'cmd': 'GetCommandDictionary', 'success': sGetCommandDict, 'fail': fail }
		]);

		$(document).on('click', 'button.btn', function () {
			cuteNSexy.runChainedEvents([ {'cmd': 'UserLogin', 'success': sLogin, 'fail': fail } ]);
		});
		
	});

}(window.GryphonLogin = window.GryphonLogin || {}, jQuery));