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

	var cuteNSexy = {
		_this: 				this,
		_cfg: 				Object.create(handsomeCfg),
		_domain: 			"http://mkevt.nmdapps.com",
//		_domain: 			"http://192.168.1.24",
		_service: 			"makinaweb",
		_schemaNo: 			0,
		urlSchemas: 		{
			0: 				"http://%domain%/%parts%/?request=%data%&callback=%callback%",	// data is a json_stringified object

			1: 				"http://%domain%/o?callback=%callback%&%data%",					// data is url parameters (x=...), seperated with &
// http://127.0.0.1/o?callback=jQuery183015059415370880203_1361203292166&api_key=0e77607d70b3f136a0204489754a4298&app_id=50fff50ba72286a97200000d&method=events&events=%5B%22MKTABLE_C_0.000021%40APP_0.00002P%40CAMP_0.000035%40MAKILINK%22%5D&_=1361203333801
		},
		credentials : 		{
			'pass': 		'demo',
			'userName': 	'demo'
		},
		about : {
			name: 				"Cute'n Sexy", 
	        author: 			"Cem Gencer",
			version: 			"0.2"
		},
		buffer : {
			salt: 				'',
			jqxhrs: 			[],
			rq: 				{},
			rp: 				{},
			callStack: 				[],
			aid: 				'',
			uid: 				'',
			sid: 				'',
		},
		grabHandsome: function() {},

		init: function() {
			this.cleanUp();
			this.createUUID();
		},
		cleanUp: function() {
			this.buffer.jqxhr = {};
			this.buffer.uid = ''; this.buffer.sid = ''; this.buffer.aid = '';
		},
/*
	TODO build url's to use different schemas & bind it with countly.event.js
*/
		buildUrl: function(cmd, data) {
			var dasModel = this.urlSchemas[this._schemaNo];
			return( this._domain + '/' + this._service + '/' + cmd + '/?request=' + JSON.stringify(data) );
		},
//=========================================================================================================
		runChainedEvents: function( arr, fail ) {
			var nextEvent = arr.shift();
			cuteNSexy.run(nextEvent[0], nextEvent[1], nextEvent[2], fail);

			$(document).one( nextEvent[0] + "ReceivedAndProccessedChainedSet", function () {
				if(arr.length > 0){
					cuteNSexy.runChainedEvents( arr );
				}
			} );
		},
		get: function(payLoad, _s, _f) { // does the same as run, but uses different url schema
			this.cleanUp();
			this.buffer.salt = $.base64.encode( this.createUUID() + $.now() );
			this.fetchIt( {
				'command': cmd, 
				'data': $.extend( this.baseObj(this.getSessionID()), payLoad)
			}, _s, _f );

		},
		run: function(cmd, payLoad, _s, _f) {
			this.cleanUp();
			this.buffer.salt = $.base64.encode( this.createUUID() + $.now() );
			for(var cfk in this._cfg) {
				if(this.type(this._cfg[cfk]) == 'array'){
					var _e = "Command does not exist in the config-file, exitting...";
					break;
//					_f(_e);
				}
			}

			if(this.type(_e) == 'undefined') {				// checks for cfg-data exists
				var set = this._cfg[cmd];
				for(var ck in set.clean) {
					delete payLoad[set.clean[ck]];
				}

				for(var mk in set.mandatory) {
					if(payLoad[set.mandatory[mk]] === undefined) {
						var _e = "Key " + set.mandatory[mk] + " does not exist, exitting...";
						break;
					}
				}
			}

			if(this.type(_e) == 'undefined') {				// checks for key exists
				payLoad['_type'] = cmd + 'Request';
				if(this.type(_s) == 'function') {
					this.fetchIt( {
						'command': cmd, 
						'data': $.extend( this.baseObj(this.getSessionID()), payLoad)
					}, _s, _f );
				}else{
					_e = 'No Function supplied as callback!';
/*
					if(this.type(_s) == 'function') {
						_f(_e);
					}
*/
				}
			} else {
//				_f(_e);
			}
		},
		killThem: function(cmd) {
			for(var i in this.buffer.jqxhrs) {
				if(this.buffer.jqxhrs[i] == cmd) {
					this.buffer.jqxhrs[i].abort();
					delete this.buffer.jqxhrs[i];
				}
			}
		},
		killAll: function() {
			for(var i in this.buffer.jqxhrs) {
				this.buffer.jqxhrs[i].abort();
				delete this.buffer.jqxhrs[i];
			}
		},
//=========================================================================================================
		fetchIt: function(payLoad, _s, _f) {
			var _t = this;
			cuteNSexy.buffer.callStack[cuteNSexy.buffer.callStack.length] = {'s': _s, 'f': _f, 'i': this.buffer.salt, 'c': payLoad.command};
//			payLoad.signature = signature;

			cuteNSexy.Logger.info('Connecting: ' + this._service + ' on ' + this._domain + ' with the command ' + payLoad.command);
//			cuteNSexy.Logger.dir(payLoad);

			var cmd = payLoad.command;
			var call = {};
			call[cmd] = $.ajax({

				url: cuteNSexy.buildUrl(payLoad.command, payLoad.data),
				accepts: 'application/json',
				dataType: 'jsonp',
				jsonpCallback: 'grabHandsome',
				contentType: "application/json; charset=utf-8",
				cache: false,
				crossDomain: true,
		        type: 'GET'

			}).done( function(data, textStatus, jqXHR) {

				cuteNSexy.doTheTwist(data);
//				$('#ajaxLoader').html('');

			}).always( function() {
/*
	TODO check ajax loader...
*/
//				$('#pcarea').html( $('#ajaxLoader').html );

			});
			this.buffer.jqxhrs[this.buffer.jqxhrs.length] = call;
		},
		doTheTwist: function(data) {

			// hide the loader

			var cmd = (data._type.slice(-8) == 'Response') ? data._type.replace('Response', '') : 'err';

			// prechecks
			var found = false;
			var realCallbackS;
			var realCallbackF;
			var callStackP = '';
			itCameBack = data.callbackTag;
			
			for(var sz in cuteNSexy.buffer.callStack) {
				var pointer = cuteNSexy.buffer.callStack[sz];
				if(itCameBack == pointer.i) {
					found = true;
					realCallbackS = pointer.s;
					realCallbackF = pointer.f;
					callStackP = sz;
				}
			}

			var cfgP = cuteNSexy._cfg[cmd];
			for(var cfk in cfgP.check) {
				var ea = cfgP.check[cfk];
				var checkFlag = true;
				for(var k in cfgP.check[cfk]) {
					var ref = cfgP.check[cfk][k];
					if(cuteNSexy.type(ref) == 'string') {
						if(data[k] != ref){
							checkFlag = false;
						}
					}else if(cuteNSexy.type(ref) == 'regexp') {
						if(ref.test(data[k]) == false){
							checkFlag = false;
							_e = "RegExp check of the property "+k+" in "+cmd+" failed";
						}
					}
				}
				var resString = cuteNSexy._cfg[ cmd ].result;
//				console.info("> retrieved " + cmd + " command, the result label is " + resString);

				// postchecks
/*
				if(checkFlag == true) {
//					console.log('checks done successfully...');
//					console.log(cuteNSexy._cfg[ payLoad.command ].result);
					if( cuteNSexy._cfg[ payLoad.command ].result == 'copyTheWholePackage') {

						_s(data);

					} else if(cuteNSexy.type(cuteNSexy._cfg[ payLoad.command ].result) == 'string') {

						_s(data[cuteNSexy._cfg[ payLoad.command ].result]);

					} else if(cuteNSexy.type(cuteNSexy._cfg[ payLoad.command ].result) == 'array') {

						var _t = {};
						var res = cuteNSexy._cfg[ payLoad.command ].result;
						for(var ar in res) {
							_t[ res[ar] ] = data[ res[ar] ] ;
							console.log('>>>>>>>>>>' + res[ar]);
							console.dir(data[ res[ar] ]);
						}
					}
					_s(_t);
				} else {
					_f(_e);
				}
				*/

if(cmd=='GetDashboardReportMap'){
//console.log("===> package had " + Object.keys(data[resString]).length + " items");
//console.dir(data);
//console.log('type is '+typeof data.rowList);
}
				// use the right callback for the command!
				if(typeof realCallbackS == 'function') {
					var set = [];
					for( var i in data[resString] ) {
					    set[i] = data[resString][i];
					}
					realCallbackS( set, cmd );
//					delete cuteNSexy.buffer.callStack[ callStackP ];
				}else{
//					console.dir(realCallbackS);
					console.error('DAMNED! it seems the callback function is not a function afterall...');
				}

				$.event.trigger({'type': cmd + "ReceivedAndProccessedChainedSet", 'message': '', 'time': new Date()});
				$.event.trigger({'type': cmd + "ReceivedAndProccessedData", 'message': '', 'time': new Date()});
				
			}
		},
//=========================================================================================================
		setService: function(newService) {
			this._service = newService;
			return true;
		},
		setDomain: function(newDomain) {
			if( (newDomain.substr(0,7) === 'http://') && (newDomain.length > 10) ) {
				if(newDomain.substr(-1,1) === '/') {
					newDomain = newDomain.substr(0,newDomain.length-1);
				}
				this._domain = newDomain;
			}else{
				return false;
			}
			return true;
		},
		getSessionID: function() {
			if(this.buffer.sid == '') {
				this.buffer.sid = this.createUUID();
			}
			return this.buffer.sid;
		},
		createUUID: function() {
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
		},
		type: function(o) {
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
		},
		baseObj: function(sid) { return ({'callTag': "", 'registerId': "", 'verb': "", 
				'session': sid, 'callbackTag': this.buffer.salt });},
		isDefined: function(v) {
		    return (typeof(window[v]) == "undefined")?  false: true;
		},
		K : function() { return this; },
		Logger : window.console || { log: cuteNSexy.K, warn: cuteNSexy.K, error: cuteNSexy.K },
	};
