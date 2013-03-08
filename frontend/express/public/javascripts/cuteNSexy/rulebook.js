var handsomeCfg = {
	'blank': {
		'mandatory': ['appId', 'campId'],
		'clean': [ ],
		'check': [ ],
		'result': '',
	},
	'UserLogin': {
		'mandatory': ['userName', 'pass'],
		'clean': ['deviceId'],
		'check': [ 
			{'status': new RegExp(/(OK|Fail)+/)}, 
			{'visibleMessage': new RegExp(/Makina\s[a-zA-Z]+\s[a-zA-Z]+\slogged in/)},
			{'userId': new RegExp(/0.[0-9a-zA-Z]+@USER/)}
		],
		'result': '',
	},
	'ListApps': {
		'mandatory': [ ],
		'clean': [ ],
		'check': [ {'status': "OK"} ],
		'result': 'infoList',
	},
	'ListChannel': {
		'mandatory': [ ],
		'clean': [ ],
		'check': [ {'status': "OK"} ],
		'result': 'infoList'
	},
	'ListCampaign': {
		'mandatory': [ 'applicationId' ],
		'clean': [ ],
		'check': [ {'status': "OK"} ],
		'result': 'infoList'
	},
	'ListMakilinks': {
		'mandatory': [ 'campaignId', 'routerEnable' ],
		'clean': [ ],
		'check': [ {'status': "OK"} ],
		'result': 'infoList'
	},
	'GetDashboardReportMap': {
		'mandatory': [ 'appId' ],
		'clean': [ ],
		'check': [ {'status': "OK"}, {'visibleMessage': "Free List"} ],
		'result': 'rowList',
	},
	'AppWizListUserTokens': {
		'mandatory': [ 'userId' ],
		'clean': [ ],
		'check': [ {'status': "OK"} ],
		'result': 'infoList',
	},
	'AppWizResolveToken': {
		'mandatory': [ 'token' ],
		'clean': [ ],
		'check': [ {'status': "OK"} ],
		'result': ['appInfo', 'userInfo'],
	},
	'AppWizCheckDevice': {
		'mandatory': [ 'appId' ],
		'clean': [ ],
		'check': [ {'status': "OK"} ],
		'result': 'deviceInfo',
	},
};
