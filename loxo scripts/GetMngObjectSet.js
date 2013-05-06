function run(request, response){
/*
	{ '[INJECT]': 'RoleInfo' }
											if VALUE is object, inject only once
	[ {'[INJECT]': 'MakiTagInfo'} ]
											if VALUE is array, injects the named object into the array multiple times


*/
	response.objectSet = [
		{'OrgInfo': { 
						'_type': 'OrgInfo', 'description': '', 'orgId': '', 'orgName': '', 'orgLevel': ''}
		},
		{'UserInfo': {
						'_type': 'UserInfo', 'description': '', 'orgId': '', 'password': '', 'userId': '', 'name': '', 'email': '', 'username': '',
						'primaryRole': {'[INJECT]': 'RoleInfo'} }
		},
		{'RoleInfo': {
						'_type': 'RoleInfo', 'description': '', 'numberOfUsers': 0, 'roleId': '', 
						'roleName': '', 'verbs': '', 'visibleName': ''}
		},
		{'UserRoleMatchInfo': {
						'_type': 'UserRoleMatchInfo', 'appId': '', 'roleInfo': {'[INJECT]': 'RoleInfo'}, 'userInfo': {'[INJECT]': 'UserInfo'} }
		},
		{'ChannelInfo': {
					'_type': 'ChannelInfo', 'actionTrack': '', 'appId': '', 'channelId': '', 'channelKeyName': '', 
					'clickTrack': '', 'description': '', 'installTrack': '', 'viewTrack': ''}
		},
		{'CampaignInfo': {
					'_type': 'CampaignInfo', 'appId': '', 'campId': '', 'campaignType': '', 'channelId': '', 
					'name': '', 'status': '', 'parentCampId': '', 'start': {'[INJECT]': 'DateInfo'}, 'end': {'[INJECT]': 'DateInfo'},
					'postbackOnAction': '', 'postbackOnClick': '', 'postbackOnInstall': '', 'postbackOnView': ''}
		},
		{'DateInfo': {
					'_type': 'MDate', 'date': '', 'time': '', 'zone': ''}
		},
		{'MakiTagInfo': {
					'_type': 'MakiTagInfo', 'tagName': '', 'tagValue': ''}
		},
		{'MakilinkInfo': {
					'_type': 'MakilinkInfo', 'backEndUrl': '', 'campId': '', 'makilinkId': null, 
					'makilinkBackEnd': '', 'makilinkFrontEnd': '', 'status': '', 'tags': [{'[INJECT]': 'injects::MakiTagInfo'}] }
		},
		{'AppInfo': {
					'_type': 'AppInfo', 'appId': '', 'appToken': '', 'appType': 0, 'appname': '', 'countlyApiKey': '', 
					'countlyAppKey': '', 'countlyUrl': '', 'description': '', 'iconUrl': '', 'marketUrl': '', 
					'googleAnalyticsKey': '', 'platform': '', 'registerActionId': ''}
		}
	];

	return response;
}
