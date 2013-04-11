// 
// action _MUST_ contain run function, returning the response object
//
function run(request, response){
   
  	response.pathList = [
		{'command': 'userLogin', 			'cloudId': 'ff8080813d8c00cb013d8d1e73e00009'},
		{'command': 'getMenuItems', 		'cloudId': 'ff8080813d8c00cb013d8d1e73e00009'},
    ];
	return response;
}
