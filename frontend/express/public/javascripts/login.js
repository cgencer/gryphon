(function(){

	_this = this;

	var sexy = Object.create(cuteNSexy);
	sexy.init();
	sexy.createUUID();
	amplify.store('sid', '');
	amplify.store('uid', '');

	function clickHandler(e){
		e.preventDefault();
		sexy.userLogin( $("input[name=username]").val(), $("input[name=password]").val() );
		amplify.store('name', $("input[name=username]").val());
	}
	function receivedStatusOK(){
		amplify.store('sid', sexy.buffer.sid);
		amplify.store('uid', sexy.buffer.uid);
//		window.location.href = "/dashboard";
		$('form').submit();
	}

	$(function() {
		$(document).one("newMessage", receivedStatusOK);
		$('input[type=submit]').bind('click', clickHandler);
	});
})();