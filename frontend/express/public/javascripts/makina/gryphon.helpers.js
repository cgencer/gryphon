var GryphonHelpers = (function (GryphonHelpers, undefined) {

	function randomId (len) {
		if(len == undefined){len = 36;}
		var s = [];
		var hexDigits = "0123456789abcdef";
		for (var i = 0; i < len; i++) {
			s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
		}
		return(s.join(""));
	};

	return {
		'randomId': randomId
	}
}(GryphonHelpers = GryphonHelpers || {}));