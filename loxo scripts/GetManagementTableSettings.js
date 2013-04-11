function run(request, response){

	response.tableSet = [
		{
			'path': 'managementOrganizations', 
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
			'manage': {'add': {'cmd': 'AppWizGetToken', 'data': {'appId':'', 'orgId': '', 'userId': ''}}},
			'caption': 'Management / User Token for Apps',
			'colNames': ['Full Name', 'Email', 'Token'],
			'colModel': [
							{'name': 'description', 	'index': 'description', 		'width': 200}, 
							{'name': 'numberOfApps', 	'index': 'numberOfApps', 		'width':  40, 	'align':'right'}, 
							{'name': 'numberOfUsers', 	'index': 'numberOfUsers', 		'width':  40, 	'align':'right'}, 
							{'name': 'orgId', 			'index': 'orgId', 				'width': 120, 	'align':'right'}, 
						]
		}, 
		{
			'path': 'managementApplications', 
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
							{'name': 'description', 	'index': 'description', 		'width': 200}, 
							{'name': 'numberOfApps', 	'index': 'numberOfApps', 		'width':  40, 	'align':'right'}, 
							{'name': 'numberOfUsers', 	'index': 'numberOfUsers', 		'width':  40, 	'align':'right'}, 
							{'name': 'orgId', 			'index': 'orgId', 				'width': 120, 	'align':'right'}, 
						]
		}, 
		{
			'path': 'managementRoles', 
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
							{'name': 'description', 	'index': 'description', 		'width': 200}, 
							{'name': 'numberOfApps', 	'index': 'numberOfApps', 		'width':  40, 	'align':'right'}, 
							{'name': 'numberOfUsers', 	'index': 'numberOfUsers', 		'width':  40, 	'align':'right'}, 
							{'name': 'orgId', 			'index': 'orgId', 				'width': 120, 	'align':'right'}, 
						]
		}, 
		{
			'path': 'managementChannels', 
			'manage': {
				'add': {'cmd': 'AddUpdateChannel', 'data': {'command':1, 'info': {'[INJECT]': 'ChannelInfo'}}},
				'edit': {'cmd': 'AddUpdateChannel', 'data': {'command':1, 'info': {'[INJECT]': 'ChannelInfo'}}},
				'delete': {'cmd': 'AddUpdateChannel', 'data': {'command':2, 'info': {'[INJECT]': 'ChannelInfo'}}}
			},
			'caption': 'Management / Channels',
			'colNames': ['Channel Key Name', 'Description', 'View Track', 'Click Track', 'Install Track', 'Action Track'],
			'colModel': [
							{'name': 'description', 	'index': 'description', 		'width': 200}, 
							{'name': 'numberOfApps', 	'index': 'numberOfApps', 		'width':  40, 	'align':'right'}, 
							{'name': 'numberOfUsers', 	'index': 'numberOfUsers', 		'width':  40, 	'align':'right'}, 
							{'name': 'orgId', 			'index': 'orgId', 				'width': 120, 	'align':'right'}, 
						]
		}, 
		{
			'path': 'managementCampaigns', 
			'manage': {
				'add': {'cmd': 'AddUpdateCampaign', 'data': {'command':1, 'info': {'[INJECT]': 'CampaignInfo'}}},
				'edit': {'cmd': 'AddUpdateCampaign', 'data': {'command':1, 'info': {'[INJECT]': 'CampaignInfo'}}},
				'delete': {'cmd': 'AddUpdateCampaign', 'data': {'command':2, 'info': {'[INJECT]': 'CampaignInfo'}}}
			},
			'caption': 'Management / Campaigns',
			'colNames': ['Campaign Name', 'Channel', 'Type', 'Start', 'End', 'Postbacks on', 'Status', 'Selected'],
			'colModel': [
							{'name': 'description', 	'index': 'description', 		'width': 200}, 
							{'name': 'numberOfApps', 	'index': 'numberOfApps', 		'width':  40, 	'align':'right'}, 
							{'name': 'numberOfUsers', 	'index': 'numberOfUsers', 		'width':  40, 	'align':'right'}, 
							{'name': 'orgId', 			'index': 'orgId', 				'width': 120, 	'align':'right'}, 
						]
		}, 
		{
			'path': 'managementMakilinks', 
			'manage': {
				'add': {'cmd': 'AddUpdateMakilink', 'appId':'', 'userId':'', 'data': {'command':1, 'info': {'[INJECT]': 'MakilinkInfo'}}},
				'edit': {'cmd': 'AddUpdateMakilink', 'appId':'', 'userId':'', 'data': {'command':1, 'info': {'[INJECT]': 'MakilinkInfo'}}},
				'delete': {'cmd': 'AddUpdateMakilink', 'appId':'', 'userId':'', 'data': {'command':2, 'info': {'[INJECT]': 'MakilinkInfo'}}}
			},
			'caption': 'Management / Makilinks',
			'colNames': ['Tags', 'Makilink', 'Channel', 'Start', 'End', 'Status', 'Selected'],
			'colModel': [
							{'name': 'description', 	'index': 'description', 		'width': 200}, 
							{'name': 'numberOfApps', 	'index': 'numberOfApps', 		'width':  40, 	'align':'right'}, 
							{'name': 'numberOfUsers', 	'index': 'numberOfUsers', 		'width':  40, 	'align':'right'}, 
							{'name': 'orgId', 			'index': 'orgId', 				'width': 120, 	'align':'right'}, 
						]

		}
	]

	return response;
}
