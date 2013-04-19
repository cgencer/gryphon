function run(request, response){

	response.tableSet = [

		{'managementOrganizations': {
			
			
			}
		
		}, 
		{'managementApps': [
			{
				'viewSet': [
					// type of input : label : selected item / value / -
					'[AUTOCOMPLETE:Dev Name:username:-]',
					'[SELECT:Organization:-]'
				],
				'data': {'command':1,'info': {'[INJECT]': 'UserInfo'}}
			}, 
		]}

	];

	return response;
}


autocomplete name, 	if exists use it, 
					else ask email > create new user > use it
 