function run(request, response){

	response.tableSet = [
		{
			'path': 'managementOrganizations', 
			'command': 'ListOrganizations',
			'manage': {
				'add': {
					'cmd': 'AddUpdateOrganization', 'data': {
							'command':1, 'countlyHostId': 'mkui1.nmdapps.com', 'info': {'[INJECT]': 'OrgInfo'}}},
				'edit': {
					'cmd': 'AddUpdateOrganization', 'data': {
							'command':1, 'countlyHostId': 'mkui1.nmdapps.com', 'info': {'[INJECT]': 'OrgInfo'}}},
				'delete': {
					'cmd': 'AddUpdateOrganization', 'data': {
							'command':2, 'countlyHostId': 'mkui1.nmdapps.com', 'info': {'[INJECT]': 'OrgInfo'}}}
			},
			'caption': 'Management / Organizations',
			'colNames': ['Desc', 'Apps', 'Users', 'Org ID', 'Name'],
			'colModel': [
							{'name': 'description', 	'index': 'description', 		'width': 200}, 
							{'name': 'numberOfApps', 	'index': 'numberOfApps', 		'width':  40, 	'align':'right'}, 
							{'name': 'numberOfUsers', 	'index': 'numberOfUsers', 		'width':  40, 	'align':'right'}, 
							{'name': 'orgId', 			'index': 'orgId', 				'width': 120, 	'align':'right'}, 
							{'name': 'orgName', 		'index': 'orgName', 			'width': 200, 	'align':'right'}, 
						]
		}, 
		{
			'path': 'managementUsers', 
			'command': [
				{'cmd': 'ListRoles', 'payload': '', 'grab': ''},
				{'cmd': 'ListOrganizations', 'payload': '', 'grab': 'orgId', 'select': '[FIRST]'},
				{'cmd': 'ListUsers', 'payload': '', 'grab': '[WHOLE]'}
			],
			'manage': {
				'add': {'cmd': 'AddUpdateUser', 'data': {'command':1, 'info': {'[INJECT]': 'UserInfo'}}},
				'edit': {'cmd': 'AddUpdateUser', 'data': {'command':1, 'info': {'[INJECT]': 'UserInfo'}}},
				'delete': {'cmd': 'AddUpdateUser', 'data': {'command':2, 'info': {'[INJECT]': 'UserInfo'}}}
			},
			'caption': 'Management / Users',
			'colNames': ['Organization', 'Full Name', 'Username', 'Email'],
			'colModel': [
							{'name': 'description', 	'index': 'description', 		'width': 200}, 
							{'name': 'numberOfApps', 	'index': 'numberOfApps', 		'width':  40, 	'align':'right'}, 
							{'name': 'numberOfUsers', 	'index': 'numberOfUsers', 		'width':  40, 	'align':'right'}, 
							{'name': 'orgId', 			'index': 'orgId', 				'width': 120, 	'align':'right'}, 
						]
		}, 
		{
			'path': 'managementUserRolesforApps', 
			'command': 'ListUserRoleMatch',
			'manage': {
				'add': {'cmd': 'AddUpdateUserRoleMatch', 'data': {'command':1, 'info': {'[INJECT]': 'UserRoleMatchInfo'}}},
				'edit': {'cmd': 'AddUpdateUserRoleMatch', 'data': {'command':1, 'info': {'[INJECT]': 'UserRoleMatchInfo'}}},
				'delete': {'cmd': 'AddUpdateUserRoleMatch', 'data': {'command':2, 'info': {'[INJECT]': 'UserRoleMatchInfo'}}},
			},
			'caption': 'Management / User Roles for Apps',
			'colNames': ['Role Key Name', 'Full Name', 'Username', 'Email'],
			'colModel': [
							{'name': 'description', 	'index': 'description', 		'width': 200}, 
							{'name': 'numberOfApps', 	'index': 'numberOfApps', 		'width':  40, 	'align':'right'}, 
							{'name': 'numberOfUsers', 	'index': 'numberOfUsers', 		'width':  40, 	'align':'right'}, 
							{'name': 'orgId', 			'index': 'orgId', 				'width': 120, 	'align':'right'}, 
						]
		}, 
		{
			'path': 'managementUserTokenforApps', 
			'command': 'AppWizListUserTokens',
			'manage': {'add': {'cmd': 'AppWizGetToken', 'data': {'appId':'', 'orgId': '', 'userId': ''}}},
			'caption': 'Management / User Token for Apps',
			'colNames': ['Full Name', 'Email', 'Token'],
			'colModel': [
							{'name': 'name', 			'index': 'name', 		'width': 200}, 
							{'name': 'email', 			'index': 'email', 		'width':  40, 	'align':'right'}, 
							{'name': 'token', 			'index': 'token', 		'width':  40, 	'align':'right'}, 
						]
		}, 
		{
			'path': 'managementApplications', 
			'command': 'ListApps',
			'manage': {
				'add': {
					'cmd': 'AddUpdateApp', 'data': {
							'command':1, 'countlyHostId': 'mkui1.nmdapps.com', 'info': {'[INJECT]': 'AppInfo'}}},
				'edit': {
					'cmd': 'AddUpdateApp', 'data': {
							'command':1, 'countlyHostId': 'mkui1.nmdapps.com', 'info': {'[INJECT]': 'AppInfo'}}},
				'delete': {
					'cmd': 'AddUpdateApp', 'data': {
							'command':2, 'countlyHostId': 'mkui1.nmdapps.com', 'info': {'[INJECT]': 'AppInfo'}}}
			},
			'caption': 'Management / Applications',
			'colNames': ['Application Name', 'Platform', 'Dashboard URL', 'Market URL', 'Google Analytics Key', 'Description'],
			'colModel': [
							{'name': 'appname', 		'index': 'appname', 		'width': 200}, 
							{'name': 'platform', 		'index': 'platform', 		'width':  40, 	'align':'right'}, 
							{'name': 'countlyUrl', 		'index': 'countlyUrl', 		'width':  40, 	'align':'right'}, 
							{'name': 'marketUrl', 		'index': 'marketUrl', 		'width': 120, 	'align':'right'}, 
							{'name': 'googleAnalyticsKey', 'index': 'googleAnalyticsKey', 'width': 200}, 
							{'name': 'description', 	'index': 'description', 	'width': 200}, 
						]
		}, 
		{
			'path': 'managementRoles', 
			'command': 'ListRoles',
			'manage': {
				'add': {
					'cmd': 'AddUpdateRole', 'data': {
							'command':1, 'info': {'[INJECT]': 'RoleInfo'}}},
				'edit': {
					'cmd': 'AddUpdateRole', 'data': {
							'command':1, 'info': {'[INJECT]': 'RoleInfo'}}},
				'delete': {
					'cmd': 'AddUpdateRole', 'data': {
							'command':2, 'info': {'[INJECT]': 'RoleInfo'}}}
			},
			'caption': 'Management / Roles',
			'colNames': ['Role Key Name', 'Description', 'Role Users'],
			'colModel': [
							{'name': 'roleName', 		'index': 'roleName', 		'width': 200}, 
							{'name': 'description', 	'index': 'description', 	'width':  40, 	'align':'right'}, 
							{'name': 'numberOfUsers', 	'index': 'numberOfUsers', 	'width':  40, 	'align':'right'}, 
						]
		}, 
		{
			'path': 'managementChannels', 
			'command': 'ListChannel',
			'manage': {
				'add': {'cmd': 'AddUpdateChannel', 'data': {'command':1, 'info': {'[INJECT]': 'ChannelInfo'}}},
				'edit': {'cmd': 'AddUpdateChannel', 'data': {'command':1, 'info': {'[INJECT]': 'ChannelInfo'}}},
				'delete': {'cmd': 'AddUpdateChannel', 'data': {'command':2, 'info': {'[INJECT]': 'ChannelInfo'}}}
			},
			'caption': 'Management / Channels',
			'colNames': ['Channel Key Name', 'Description', 'View Track', 'Click Track', 'Install Track', 'Action Track'],
			'colModel': [
							{'name': 'channelKeyName', 	'index': 'channelKeyName', 		'width': 200}, 
							{'name': 'description', 	'index': 'description', 		'width': 200}, 
							{'name': 'viewTrack', 		'index': 'viewTrack', 			'width':  40, 	'align':'right'}, 
							{'name': 'clickTrack', 		'index': 'clickTrack', 			'width':  40, 	'align':'right'}, 
							{'name': 'installTrack', 	'index': 'installTrack', 		'width':  40, 	'align':'right'}, 
							{'name': 'actionTrack', 	'index': 'actionTrack', 		'width':  40, 	'align':'right'}, 
						]
		}, 
		{
			'path': 'managementCampaigns', 
			'command': 'ListCampaign',
			'manage': {
				'add': {'cmd': 'AddUpdateCampaign', 'data': {'command':1, 'info': {'[INJECT]': 'CampaignInfo'}}},
				'edit': {'cmd': 'AddUpdateCampaign', 'data': {'command':1, 'info': {'[INJECT]': 'CampaignInfo'}}},
				'delete': {'cmd': 'AddUpdateCampaign', 'data': {'command':2, 'info': {'[INJECT]': 'CampaignInfo'}}}
			},
			'caption': 'Management / Campaigns',
			'colNames': ['Campaign Name', 'Channel', 'Type', 'Start', 'End', 'Postbacks on', 'Status'],
			'colModel': [
							{'name': 'name', 			'index': 'name', 				'width': 200}, 
							{'name': 'channelId', 		'index': 'channelId', 			'width': 120, 	'align':'right'}, 
							{'name': 'campaignType', 	'index': 'campaignType', 		'width':  40, 	'align':'right'}, 
							{'name': 'start', 			'index': 'start', 				'width': 120, 	'align':'right'}, 
							{'name': 'end',	 			'index': 'end', 				'width': 120, 	'align':'right'}, 
							{'name': 'postbackOnAction', 'index': 'postbackOnAction', 	'width': 120, 	'align':'right'}, 
							{'name': 'status', 			'index': 'status', 				'width': 120, 	'align':'right'}, 
						]
		}, 
		{
			'path': 'managementMakilinks', 
			'command': 'ListMakilinks',
			'manage': {
				'add': {'cmd': 'AddUpdateMakilink', 'appId':'', 'userId':'', 'data': {'command':1, 'info': {'[INJECT]': 'MakilinkInfo'}}},
				'edit': {'cmd': 'AddUpdateMakilink', 'appId':'', 'userId':'', 'data': {'command':1, 'info': {'[INJECT]': 'MakilinkInfo'}}},
				'delete': {'cmd': 'AddUpdateMakilink', 'appId':'', 'userId':'', 'data': {'command':2, 'info': {'[INJECT]': 'MakilinkInfo'}}}
			},
			'caption': 'Management / Makilinks',
			'colNames': ['Tags', 'Makilink', 'Channel', 'Start', 'End', 'Status'],
			'colModel': [
							{'name': 'tags', 			'index': 'tags', 			'width': 200}, 
							{'name': 'makiLink', 		'index': 'makiLink', 		'width': 200, 	'align':'right'}, 
							{'name': 'campId', 			'index': 'campId', 			'width': 120, 	'align':'right'}, 
							{'name': 'start', 			'index': 'start', 			'width': 120, 	'align':'right'}, 
							{'name': 'end',	 			'index': 'end', 			'width':  40, 	'align':'right'}, 
							{'name': 'status', 			'index': 'status', 			'width':  40, 	'align':'right'}, 
						]

		}
	]

	return response;
}
