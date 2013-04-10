/*!
  * cutensexy.js (c) Cem Gencer
*/
function grabHandsome(json) {
	if (json.Error) {
		console.log(json.Message);
	}
}
$('document').ajaxError(function (event, XMLHttpRequest, ajaxOptions, thrownError) {
	var _e = '';
	console.log(thrownError);
/*	console.dir(jqXHR);
	if (jqXHR.status === 0) {
		_e = 'Not connect.\n Verify Network.';
	} else if (jqXHR.status == 404) {
		_e = 'Requested page not found. [404]';
	} else if (jqXHR.status == 500) {
		_e = 'Internal Server Error [500].';

	} else if (textStatus == 'parsererror') {
		_e = 'Requested JSON parse failed.';
	} else if (textStatus == 'timeout') {
		_e = 'Time out error.';
	} else if (textStatus == 'abort') {
		_e = 'Ajax request aborted.';
	} else {
		_e = 'Uncaught Error.\n' + jqXHR.responseText;
	}
*/
});
var cuteNSexy = (function (cuteNSexy, $, undefined) {
		var _this = this;
		var _domain = "http://mkevt.nmdapps.com";
		var _service = "makinaweb";
		var _cloudid = '';
		var _appName = 'grabHandsome';
		var _paths = [];
		var _dictionary = {};
		var _cloudids = [];
		var _credentials = {
			'pass': 		'demo',
			'userName': 	'demo'
		};
		var about = {
			name: 				"Cute'n Sexy", 
	        author: 			"Cem Gencer",
			version: 			"0.3"
		};
		var buffer = {};
		function grabHandsome () {};

		function init (iObj) {
			if(iObj !== undefined) {
				if(iObj.domain !== undefined) {
					setDomain(iObj.domain);
				}
				if(iObj.service !== undefined) {
					setService(iObj.service);
				}
				if(iObj.dictionary !== undefined) {
					setDictionary(iObj.dictionary);
				}
				if(iObj.cloudId !== undefined) {
					setCloudId(iObj.cloudId);
				}
				if(iObj.appName !== undefined) {
					setAppName(iObj.appName);
				}
			}
			cleanUp();
			createUUID();
		};
		function cleanUp () {
			buffer = {
				salt: 				'',
				jqxhrs: 			[],
				rq: 				{},
				rp: 				{},
				_sss: 				[],
				aid: 				'',
				uid: 				'',
				sid: 				'',
			};
		};
//=========================================================================================================
		// calls chained methods as such:
		// runChainedEvents([ ['ListApps', {}, countlyHandsome.ListAppsDone],
		//   				  ['ListApps', {}, countlyHandsome.ListAppsDone] , globalFailMethod]);
		function runChainedEvents ( arr ){
			var nextEventItem = arr.shift();
			run(nextEventItem.cmd, nextEventItem.payload, nextEventItem.success, nextEventItem.fail);

			$(document).one(nextEventItem.cmd + "ReceivedAndProccessedChainedSet", function () {
				if(arr.length > 0){
					runChainedEvents( arr );
				}
			});
		};
		function run (cmd, payLoad, _s, _f) {
			cleanUp();
			buffer.salt = $.base64.encode( createUUID() );

			for(var cfk in _dictionary) {
				if(type (_dictionary[cfk] ) == 'array'){
					var _e = "Command does not exist in the config-file, exitting...";
					_f(_e);
				}
			}
			if(typeof(_e) == 'undefined') {				// checks for cfg-data exists
				var set = _dictionary[cmd];
				if(typeof(set) !== 'undefined') {
					if(typeof(set.clean) !== 'undefined') {
						for(var ck in set.clean) {
							delete payLoad[set.clean[ck]];
						}
					}
				}

				if(type(set) !== 'undefined') {
					if(type(set.mandatory) !== 'undefined') {
						for(var mk in set.mandatory) {

/*
	TODO nested checking of objects needs to be replanned 
*/								
/*
							if(set.mandatory[mk].indexOf('.') > -1) {
								console.dir(payLoad);
								eval('var tempVar = payLoad.'+set.mandatory[mk]);

								if(type(tempVar) == 'undefined') {
									var _e = "Key " + rec[ri] + " does not exist, exitting...";
								}
							}
*/
							if(type(payLoad[set.mandatory[mk]]) == 'undefined') {
								var _e = "Key " + set.mandatory[mk] + " does not exist, exitting...";
							}
						}
					}
				}
			}
			if(type(payLoad) === 'undefined'){payLoad = {};}

			if(type(_e) == 'undefined') {				// checks for key exists
				payLoad['_type'] = cmd + 'Request';
				if(type(_s) == 'function') {
					console.log('retrieving from '+_dictionary[cmd].source);
					fetchIt( {
						'command': cmd, 
						'data': $.extend( baseObj( getSessionID() ), payLoad)
					}, _s, _f, _dictionary[cmd].source );
				}else{
					_e = 'No Function supplied as callback!';
					if(type(_s) == 'function') {
						_f(_e);
					}
				}
			} else {
				if(type(_f) == 'function') {
					_f(_e);
				}
			}
		};

//=========================================================================================================
		function fetchIt (payLoad, _s, _f, src) {
			var _t = this;
			buffer._sss.push({'s': _s, 'f': _f, 'i': buffer.salt, 'c': payLoad.command});

			if(_appName === ''){_appName = 'q';}

			var cid = (_cloudid !== '') ? _cloudid : '';
/*
	TODO if _cloudid exists in _cloudids use it
*/
			var cmd = payLoad.command;
			var theURL = '';
			switch (src) {
				case 'handsome':
					theURL = 'http://mkevt.nmdapps.com/makinaweb/' + cmd + '/?request=' + JSON.stringify(payLoad.data);
					break;
				case 'loxodonta':
					theURL = _domain + '/' + _service + '/' + cid + '/' + 
							payLoad.command + '?request=' + JSON.stringify(payLoad.data);
					break;
			};
			console.log('the URL is '+theURL);

			buffer.jqxhrs.push( $.ajax({
				url: theURL,
				accepts: 'application/json',
				dataType: 'jsonp',
				jsonpCallback: _appName,
				contentType: "application/json; charset=utf-8",
				cache: false,
				crossDomain: true,
		        type: 'GET'

			}).done( function(data, textStatus, jqXHR) {

				doTheTwist(data, textStatus, jqXHR, src);

			}));
		};
		function doTheTwist (data, textStatus, jqXHR, src) {
			//by-pass the checks for now...

			if(src !== 'handsome') {
				for(var i in data){
					data = data[i];
				}
			}
			var cmd = (data._type.slice(-8) == 'Response') ? data._type.replace('Response', '') : 'err';

			// prechecks
			var found = false;
			var realCallbackS, realCallbackF, _sssP;
			itCameBack = data.callbackTag;

			searchCB:
			for(var sz in buffer._sss) {
				var pointer = buffer._sss[sz];
				if(itCameBack == pointer.i) {
					found = true;
					realCallbackS = pointer.s;
					realCallbackF = pointer.f;
					_sssP = sz;
					break searchCB;
				}
			}

			var resString = _dictionary[ cmd ].result;
			var _e = '';
			var cfgP = _dictionary[cmd];
			var permFlag = true;

			preC:
			for(var cfk in cfgP.check) {
				var ea = cfgP.check[cfk];
				for(var k in cfgP.check[cfk]) {
					var ref = cfgP.check[cfk][k];

					var checkFlag = true;
					switch (type(ref)) {
						case 'string':
							checkFlag = (data[k] != ref) ? false : true;
							if(!checkFlag){permFlag = false;_e = 'failed String match on '+k+"\n value is: "+data[k];}
							break;
						case 'regexp':
							checkFlag = ref.test(data[k]);
							if(!checkFlag){permFlag = false;_e = 'failed RegExp match on '+k+"\n value is: "+data[k];}
							break;
					}
				}
			}
			// use the right callback for the command!
			if(checkFlag && permFlag) {
				if(typeof (realCallbackS) == 'function') {
					if(resString === '') {
						realCallbackS( data, cmd );
					}else{
						realCallbackS( data[resString], cmd );
					}
					delete buffer._sss[ _sssP ];
				}
			} else {
				if(typeof (realCallbackF) == 'function') {
					realCallbackF( _e );
				}
			}

			$.event.trigger({'type': cmd + "ReceivedAndProccessedChainedSet", 'message': '', 'time': new Date()});
			return checkFlag;
		};
//=========================================================================================================
		function setAppName (name) {
			_appName = name;
			return true;
		};
		function setCloudIds (arr) {
			_cloudids = arr;
			return true;
		};
		function setCloudId (id) {
			_cloudid = id;
			return true;
		};
		function setService (newService) {
			_service = newService;
			return true;
		};
		function setDomain (newDomain) {
			if( (newDomain.substr(0,7) === 'http://') && (newDomain.length > 10) ) {
				if(newDomain.substr(-1,1) === '/') {
					newDomain = newDomain.substr(0, newDomain.length-1);
				}
				_domain = newDomain;
				return true;
			}else{
				return false;
			}
		};
		function setPaths (pack) {
			_paths = pack;
			return true;
		};
		function setDictionary (newDict) {
			if(typeof(handsomeCfg) != 'undefined' && handsomeCfg != null) {
				_dictionary = Object.create( handsomeCfg );
			}else{
				_dictionary = newDict;
			}
			console.log('dictionary redefined...');
			return true;
		};
		function getSessionID () {
			if(buffer.sid == '') {
				buffer.sid = createUUID();
			}
			return buffer.sid;
		};
		function createUUID () {
		    // http://www.ietf.org/rfc/rfc4122.txt
			var s = [];
			var hexDigits = "0123456789abcdef";
			for (var i = 0; i < 36; i++) {
				s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
			}
			s[14] = "4";  // bits 12-15 of the time_hi_and_version field to 0010
			s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);  // bits 6-7 of the clock_seq_hi_and_reserved to 01
			s[8] = s[13] = s[18] = s[23] = "-";

			return(s.join(""));
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
		function baseObj (sid) { return ({'callTag': "", 'registerId': "", 'verb': "", 
				'session': sid, 'callbackTag': buffer.salt });};
		function isDefined (v) {
		    return (typeof(window[v]) == "undefined")?  false: true;
		};
		function K () { return this; };
		return {						// only these methods are accessible from the outside
			'init': init,
			'setService': setService,
			'setDomain': setDomain,
			'setPaths': setPaths,
			'setDictionary': setDictionary,
			'setCloudId': setCloudId,
			'setCloudIds': setCloudIds,
			'getSessionID': getSessionID,
			'setAppName': setAppName,
			'runChainedEvents': runChainedEvents,
										// and these variables
			'response': buffer.rp
		};

}(window.cuteNSexy = window.cuteNSexy || {}, jQuery));
