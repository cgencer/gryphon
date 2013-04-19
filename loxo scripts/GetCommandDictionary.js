// 
// action _MUST_ contain run function, returning the response object
//
function run(request, response){

  response.dictionary = {

	'blank': {
		'source': '',
		'mandatory': ['appId', 'campId'],
		'clean': [ ],
		'check': [ ],
		'result': '',
	},
	'GetMenuItems': {
		'source': 'loxodonta',
		'mandatory': ['userId'],
		'clean': [ ],
		'check': [ ],
		'result': 'menuItems',
	},
	'UserLogin': {
		'source': 'handsome',
		'mandatory': ['userName', 'pass'],
		'clean': ['deviceId'],
		'check': [ 
			{'status': new RegExp(/(OK|Fail)+/)}, 
			{'visibleMessage': new RegExp(/[a-zA-Z]+\s[a-zA-Z]+\slogged in/)},
			{'userId': new RegExp(/0.[0-9a-zA-Z]+@USER/)}
		],
		'result': '',
	},
    'ListOrganizations': {
		'source': 'handsome',
		'mandatory': [ ],
		'clean': [ ],
		'check': [ {'status': "OK"} ],
		'result': 'infoList',
	},
    'ListRoles': {
		'source': 'handsome',
		'mandatory': [ ],
		'clean': [ ],
		'check': [ {'status': "OK"} ],
		'result': 'infoList',
	},
    'ListUsers': {
		'source': 'handsome',
		'mandatory': ['orgId'],
		'clean': [ ],
		'check': [ {'status': "OK"} ],
		'result': 'infoList',
	},
	'ListApps': {
		'source': 'handsome',
		'mandatory': [ ],
		'clean': [ ],
		'check': [ {'status': "OK"} ],
		'result': 'infoList',
	},
	'ListChannel': {
		'source': 'handsome',
		'mandatory': [ ],
		'clean': [ ],
		'check': [ {'status': "OK"} ],
		'result': 'infoList'
	},
	'ListCampaign': {
		'source': 'handsome',
		'mandatory': [ 'applicationId' ],
		'clean': [ ],
		'check': [ {'status': "OK"} ],
		'result': 'infoList'
	},
	'ListMakilinks': {
		'source': 'handsome',
		'mandatory': [ 'campaignId', 'routerEnable' ],
		'clean': [ ],
		'check': [ {'status': "OK"} ],
		'result': 'infoList'
	},
    'ListUserRoleMatch': {
		'source': 'handsome',
		'mandatory': ['appId'],
		'clean': [ ],
		'check': [ {'status': "OK"} ],
		'result': ['roleInfo', 'userInfo'],
	},
	'GetDashboardReportMap': {
		'source': 'handsome',
		'mandatory': [ 'appId' ],
		'clean': [ ],
		'check': [ {'status': "OK"}, {'visibleMessage': "Free List"} ],
		'result': 'rowList',
	},
	'AppWizListUserTokens': {
		'source': 'handsome',
		'mandatory': [ 'userId' ],				// can also be appId, so do add a regexp check on mandatories
		'clean': [ ],
		'check': [ {'status': "OK"} ],
		'result': 'infoList',
	},
	'AppWizResolveToken': {
		'source': 'handsome',
		'mandatory': [ 'token' ],
		'clean': [ ],
		'check': [ {'status': "OK"} ],
		'result': ['appInfo', 'userInfo'],
	},
	'AppWizCheckDevice': {
		'source': 'handsome',
		'mandatory': [ 'appId' ],
		'clean': [ ],
		'check': [ {'status': "OK"} ],
		'result': 'deviceInfo',
	},
    'AddUpdateUser': {
		'source': 'handsome',
		'mandatory': [ ],
		'clean': [ ],
		'check': [ ],
		'result': 'info',
	},
  }
   
   
   //run method _MUST_ return response object
  return response;
}
