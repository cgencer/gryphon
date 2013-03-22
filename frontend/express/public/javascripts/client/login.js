var GryphonLogin = (function(GryphonLogin, $, undefined){

	_this = this;
	cuteNSexy.init({
		domain: 'http://alpha.loxodonta-editor.appspot.com:80',
		service: 'resources/dispatcher/test/v1/',
		cloudId: 'ff8080813d8c00cb013d8d1e73e00009',
	});

	function success(package) {
		var received = cuteNSexy.response;
	};

	function fail(err) {
		console.log('error received:\n'+err);
	};

	$(document).ready( function() {
		console.log('starting the login procedure...');

		cuteNSexy.runChainedEvents( [ {	'cmd': 'GetCommandPaths', 
										'payload': {},
										'success': success,
										'fail': fail }
		] );
	});

}(window.GryphonLogin = window.GryphonLogin || {}, jQuery));