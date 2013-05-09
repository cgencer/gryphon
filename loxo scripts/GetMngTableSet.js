function run(request, response){

	response.tableSet = [
		{
			'path': 'managementOrganizations', 
			'command': 'ListOrganizations',
			'manage': 'AddUpdateOrganization',
			'caption': 'Management / Organizations',
			'colNames': ['Id', 'Name', 'Desc', 'Level'],
			'colModel': [
				{'name': 'orgId', 			'index': 'orgId', 			'width': 20}, 
				{'name': 'orgName', 		'index': 'orgName', 		'width': 200}, 
				{'name': 'description', 	'index': 'description', 	'width': 200}, 
				{'name': 'orgLevel', 		'index': 'orgLevel', 			'width': 120}, 
			]
		}, 
		{
			'path': 'managementUsers', 
			'command': 'ListUsers',
			'manage': 'AddUpdateUser',
			'caption': 'Management / Users',
			'colNames': ['Id', 'Username', 'Email', 'User Type'],
			'colModel': [
				{'name': 'userId', 			'index': 'userId', 			'width': 20}, 
				{'name': 'name', 			'index': 'name', 			'width': 200}, 
				{'name': 'email', 			'index': 'email', 			'width': 200}, 
				{'name': 'primaryRole_visibleName', 	'index': 'primaryRole_visibleName', 	'width': 100}, 
			]
		}, 
		{
			'path': 'managementApps', 
			'command': 'ListApps',
			'manage': 'AddUpdateApp',
			'caption': 'Management / Applications',
			'colNames': ['Id', 'Name', 'Platform', 'Token Owners', 'Description', 'URL'],
			'colModel': [
		{'name': 'appId',	 		'index': 'appId', 			'width': 20}, 
		{'name': 'appname', 		'index': 'appname', 		'width': 170}, 
		{'name': 'platform', 		'index': 'platform', 		'width':  60,}, 
		{'name': 'tokens',	 		'index': 'tokens', 			'width': 120, 	'align':'center'}, 
		{'name': 'description', 	'index': 'description', 	'width': 150}, 
		{'name': 'marketUrl', 		'index': 'marketUrl', 		'width': 140}
			]
		}, 
		{
			'path': 'managementRoles', 
			'command': 'ListRoles',
			'manage': 'AddUpdateRole',
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
			'manage': 'AddUpdateChannel',
			'caption': 'Management / Channels',
			'colNames': ['Channel Key Name', 'Description', 'View Track', 'Click Track', 'Install Track', 'Action Track'],
			'colModel': [
		{'name': 'channelKeyName', 	'index': 'channelKeyName', 	'width': 200}, 
		{'name': 'description', 	'index': 'description', 	'width': 200}, 
		{'name': 'viewTrack', 		'index': 'viewTrack', 		'width':  40, 	'align':'right'}, 
		{'name': 'clickTrack', 		'index': 'clickTrack', 		'width':  40, 	'align':'right'}, 
		{'name': 'installTrack', 	'index': 'installTrack', 	'width':  40, 	'align':'right'}, 
		{'name': 'actionTrack', 	'index': 'actionTrack', 	'width':  40, 	'align':'right'}, 
			]
		}, 
		{
			'path': 'managementCampaigns', 
			'command': 'ListCampaign',
			'manage': 'AddUpdateCampaign',
			'caption': 'Management / Campaigns',
			'colNames': ['Id', 'Campaign Name', 'Type', 'Start', 'End', 'Postbacks on', 'Status'],
			'colModel': [
		{'name': 'channelId', 		'index': 'channelId', 			'width': 120, 	'align':'right'}, 
		{'name': 'name', 			'index': 'name', 				'width': 200}, 
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
			'manage': 'AddUpdateMakilink',
			'caption': 'Management / Makilinks',
			'colNames': ['Id', 'Name', 'Channel', 'Campaign', 'Description'],
			'colModel': [
				{'name': 'makilinkId', 	'index': 'makilinkId', 	'width': 20}, 
				{'name': 'makilinkName', 'index': 'makilinkName', 	'width': 200}, 
				{'name': 'makiLink', 	'index': 'makiLink', 	'width': 200, 'align':'right'}, 
				{'name': 'campId', 		'index': 'campId', 		'width': 120, 'align':'right'}, 
				{'name': 'description', 'index': 'description', 'width': 120, 'align':'right'}, 
			]
		}
	]

	return response;
}
