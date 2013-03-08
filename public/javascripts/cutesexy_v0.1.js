/*!
  * cutensexy.js (c) Cem Gencer
*/

	var cuteNSexy = {
		_this: this,
//		domain: 			"http://makina.nmdapps.com",
		domain : 			"http://mkevt.nmdapps.com", 
		credentials : 		{
			'pass': 		'umut123',
			'userName': 	'umut'
		},
		about : {
			name: 				"Cute'n Sexy", 
	        author: 			"Cem Gencer",
		},
		fieldsApp : ['token', 'id', 'type', 'name', 'desc', 'platform', 'icon', 'market'],
		buffer : {
			request: 			{},
			rq: 				{},
			rp: 				{},
			cmds: 				{},
			apps: 				{},
			tokens: 			[],
			devices: 			[],
			app: 				{},
			uid: 				'',
			sid: 				'',
		},
		grabHandsome: function() {},

		init: function() {
			this.buffer.request, this.buffer.rq, this.buffer.rp, this.buffer.cmds, 
			this.buffer.tokens, this.buffer.devices, this.buffer.app = {};
			this.buffer.uid, this.buffer.sid = '';
		},

		dataReceived: function() {
			$.event.trigger({'type': "receivedCommands", 'message': "receivedCommands", 'time': new Date()});
		},

//=========================================================================================================
		commandsReceived: function() {
			// proccess the commands set
//			cuteNSexy.Logger.log('sending...\n' + JSON.stringify(this.buffer.cmds.data, void 0, "\t"));

//			$.event.trigger({'type': "receivedCommands", 'message': "receivedCommands", 'time': new Date()});
		},
		grabCommands: function() {
			$(document).one("commandsGrabbed", this.commandsReceived);
			this.buffer.rq = {'command': 'ServiceDisco', 'data': {}};
			this.fetchIt();
		},
//=========================================================================================================
		tokenChecked: function() {
			$.event.trigger({'type': "receivedTokens", 'message': "receivedTokens", 'time': new Date()});
		},
		checkToken: function(uid, sid) {
			$(document).one("TokenChecked", this.tokenChecked);
			this.buffer.rq = {'command': 'AppWizListUserTokens', 
								'data': {'userId':uid, 'verb':'', 'registerId':'', 'session':sid, 'callTag':''}};
			this.fetchIt();
		},
//=========================================================================================================
		appsListReceived: function() {
			$.event.trigger({'type': "receivedAppsList", 'message': "receivedAppsList", 'time': new Date()});
		},
		getAppsList: function(sid) {
			$(document).one("AppsListGrabbed", this.appsListReceived);
			this.buffer.rq = {
				'command': 'ListApps',
				'data': $.extend(this.baseObj(sid), {'pager': {'_type': "Pager", 'orderBy': "", 'pageNum': 1, 'pageSize': 1, 'sort': ""}})
			};
cuteNSexy.Logger.log('sent...\n');
cuteNSexy.Logger.dir(this.buffer.rq);
			this.fetchIt();
		},
//=========================================================================================================
		mapReceived: function() {
			$.event.trigger({'type': "receivedMap", 'message': "receivedMap", 'time': new Date()});
		},
		reportMap: function(aid, sid) {
			$(document).one("MapGrabbed", this.mapReceived);
			this.buffer.rq = {'command': 'GetDashboardReportMap', 
								'data': {'appId':aid, 'session':sid}};
cuteNSexy.Logger.log('sent...\n');
cuteNSexy.Logger.dir(this.buffer.rq);
			this.fetchIt();
		},
//=========================================================================================================
		deviceChecked: function() {
			$.event.trigger({'type': "deviceOK", 'message': "receivedTokens", 'time': new Date()});
		},
		checkDevice: function(aid, sid) {
			this.buffer.devices = [];
			$(document).one("DeviceChecked", this.deviceChecked);
			this.buffer.rq = {'command': 'AppWizCheckDevice', 
								'data': {'appId':aid, 'verb':'', 'registerId':'', 'session':sid, 'callTag':''}};
			this.fetchIt();
		},
//=========================================================================================================
		detailsReceived: function() {
			$.event.trigger({'type': "receivedDetails", 'message': "receivedTokens", 'time': new Date()});
		},
/*		tokenDetails: function(token, sid) {
			$(document).one("DetailsReceived", this.detailsReceived);
			this.buffer.rq = {'command': 'AppWizResolveToken', 
								'data': {'token':token, 'verb':'', 'registerId':'', 'session':sid, 'callTag':''}};
			this.fetchIt();
		},*/
//=========================================================================================================
		tokensReceived: function() {
			$.event.trigger({'type': "receivedTokens", 'message': "receivedTokens", 'time': new Date()});
		},
/*		grabTokens: function(uid, sid) {
			this.buffer.tokens = [];
			$(document).one("TokensReceived", this.tokensReceived);
			this.buffer.rq = {'command': 'AppWizListUserTokens', 
								'data': {'userId':uid, 'verb':'', 'registerId':'', 'session':sid, 'callTag':''}};
			this.fetchIt();
		},*/
//=========================================================================================================
		loginDataReceived: function() {
			$.event.trigger({'type': "newMessage", 'message': "receivedCredentials", 'time': new Date()});
		},
		userLogin: function(user, pass) {
			$(document).one("JSONdataGrabbed", this.loginDataReceived);
			this.buffer.rq = {'command': 'UserLogin', 'data': {'registerId': '', 'verb': '', 'deviceId': ''}}
			var preOccupied = (user && pass) ? {'userName': user, 'pass': pass} : this.credentials;
			this.buffer.rq.data = jQuery.extend(preOccupied, this.buffer.rq.data);
			this.buffer.rq.data.session = this.buffer.sid;
//			cuteNSexy.Logger.log('sending...\n' + JSON.stringify(this.buffer.rq.data, void 0, "\t"));
			this.fetchIt();
		},
//=========================================================================================================
		fetchIt: function() {
			this.buffer.rp = {};
			this.buffer.rq.data._type = this.buffer.rq.command + 'Request';

			this.buffer.request = $.ajax({ 
				error: function(jqXHR, textStatus, errorThrown) {
					if (jqXHR.status === 0) {
						_error = 'Not connect.\n Verify Network.';
					} else if (jqXHR.status == 404) {
						_error = 'Requested page not found. [404]';
					} else if (jqXHR.status == 500) {
						_error = 'Internal Server Error [500].';
					} else if (textStatus === 'parsererror') {
						_error = 'Requested JSON parse failed.';
					} else if (textStatus === 'timeout') {
						_error = 'Time out error.';
					} else if (textStatus === 'abort') {
						_error = 'Ajax request aborted.';
					} else {
						_error = 'Uncaught Error.\n' + jqXHR.responseText;
					}
//					cuteNSexy.Logger.log('================================================');
//					cuteNSexy.Logger.log(_error + '\nerror: ' + errorThrown);
				},
				success: function(data, textStatus, jqXHR) {
					if(data._type === cuteNSexy.buffer.rq.data._type.replace('Request', 'Response')) {
						if(data.status == 'OK') {
							cuteNSexy.Logger.log('received========================================');
							cuteNSexy.Logger.dir(data);

							if (cuteNSexy.buffer.rq.command == 'ServiceDisco') {

								cuteNSexy.buffer.cmds = data;
								$.event.trigger(	{'type': "JSONdataGrabbed", 
													'message': cuteNSexy.buffer.rq.command, 
													'time': new Date()});

							} else if (cuteNSexy.buffer.rq.command == 'UserLogin') {

								cuteNSexy.buffer.rp = data;
								cuteNSexy.buffer.uid = data.userId;
								
								$.event.trigger(	{'type': "JSONdataGrabbed", 
													'message': cuteNSexy.buffer.rq.command, 
													'time': new Date()});

							} else if (cuteNSexy.buffer.rq.command == 'ListApps') {

								cuteNSexy.buffer.rp = data.infoList;

								$.event.trigger(	{'type': "AppsListGrabbed", 
													'message': cuteNSexy.buffer.rq.command, 
													'time': new Date()});

							} else if (cuteNSexy.buffer.rq.command == 'GetDashboardReportMap') {

								cuteNSexy.buffer.rp = data.rowList;

								$.event.trigger(	{'type': "MapGrabbed", 
													'message': cuteNSexy.buffer.rq.command, 
													'time': new Date()});

							} else if (cuteNSexy.buffer.rq.command == 'AppWizListUserTokens') {

								for (idx in data.infoList) {
//									cuteNSexy.buffer.tokens.push(data.infoList[idx]);
									cuteNSexy.buffer.tokens.push({'token': data.infoList[idx].token, 
																'desc': data.infoList[idx].description});
								}
								$.event.trigger(	{'type': 'TokensReceived', 
													'message': cuteNSexy.buffer.rq.command,
													'time': new Date()});

							} else if (cuteNSexy.buffer.rq.command == 'AppWizResolveToken') {

								var tx = {};
								var desc = '';
								for (idx in cuteNSexy.buffer.tokens) {
									tx = cuteNSexy.buffer.tokens[idx];
									if(tx.token == cuteNSexy.buffer.rq.data.token){
										desc = tx.desc;
									}
								}
								cuteNSexy.buffer.app = {'token': cuteNSexy.buffer.rq.data.token, 
														'appId': data.appInfo.appId,
														'appName': data.appInfo.appname,
														'appDesc': desc,
														'appDescription': data.appInfo.description,
														'iconUrl': data.appInfo.iconUrl,
														'marketUrl': data.appInfo.marketUrl,
														'platform': data.appInfo.platform,
														'userName': data.userInfo.name,
														"countlyApiKey": data.appInfo.countlyApiKey,
														"countlyAppId": data.appInfo.countlyAppId,
														"countlyAppKey": data.appInfo.countlyAppKey,
														"countlyUrl": data.appInfo.countlyUrl,
								};
								$.event.trigger(	{'type': 'DetailsReceived', 
													'message': cuteNSexy.buffer.rq.command,
													'time': new Date()});

							} else if (cuteNSexy.buffer.rq.command == 'AppWizCheckDevice') {

//								cuteNSexy.Logger.log('received...\n' + JSON.stringify(data.deviceInfo, void 0, "\t"));
								cuteNSexy.buffer.devices = data.deviceInfo;
								$.event.trigger(	{'type': 'DeviceChecked', 
													'message': cuteNSexy.buffer.rq.command,
													'time': new Date()});


							}
						}
					}
				},
				url: this.domain + '/makinaweb/' + 
					this.buffer.rq.command + '/' + 
					$.base64.encode(JSON.stringify(this.buffer.rq.data)),
				accepts: 'application/json',
				dataType: 'jsonp',
				jsonpCallback: 'grabHandsome',
				contentType: "application/json; charset=utf-8",
				cache: false,
				crossDomain: true,
		        type: 'GET'
			});
		},
		baseObj: function(sid) { return ({'callTag': "", 'registerId': "", 'verb': "", 'session': sid});},
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

			this.buffer.sid = s.join("");
		},
		K : function() { return this; },
		Logger : window.console || { log: cuteNSexy.K, warn: cuteNSexy.K, error: cuteNSexy.K },
	};
