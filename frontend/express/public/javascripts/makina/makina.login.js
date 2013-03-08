function Login(username, password) {
	var b = new UserLoginRequest('', username, password, 'RunSuccessCallBack', 'RunFailedCallBack');
	b.send();
}

function LogOut(){
    _sessionId="";
    document.location.href = '/Login.aspx';
}

function RunSuccessCallBack(obj) {
    console.log(obj);
	if (obj.UserLoginResult.status != "OK") {
		$("#message").html(obj.UserLoginResult.visibleMessage);
		return;
	}
    document.cookie=" userId="+obj.UserLoginResult.userId;

	document.location.href = '/default.aspx';
}

function RunFailedCallBack(obj) {
	alert(obj);
}