// 
// action _MUST_ contain run function, returning the response object
//
function run(request, response){


	response.menuItems = [
      {'title': 'Select App'},
      {'title': 'Dashboard'},
      {'title': 'Events'},
      {'title': 'Sources'},
      {'title': 'Management', 'menuItems': [
        {'title': 'Organization'},
        {'title': 'User'},
        {'title': 'Apps'},
        {'title': 'Makilinks'},
        {'title': 'SDK Wizard'},
      ]},
    ];
  
	return response;
}
