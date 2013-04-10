var GryphonManagement = (function(GryphonManagement, $, undefined){

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
		cuteNSexy.runChainedEvents([ {'cmd': 'GetMenuItems', 'success': sMenuReceived, 'fail': failedModelCall, 
										'payload': {'userId':amplify.store('uid')} } ]);

		function failedModelCall(package) {
			console.dir(package);
		}
	};initModel();

	var datas;


}(window.GryphonManagement = window.GryphonManagement || {}, jQuery));