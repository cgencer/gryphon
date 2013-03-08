(function (Gryphon, $, undefined) {

}(window.Gryphon = window.Gryphon || {}, jQuery));

(function (GryphonHelpers, $, undefined) {
	GryphonHelpers.randomId = function (len) {
			if(len == undefined){len = 36;}
			var s = [];
			var hexDigits = "0123456789abcdef";
			for (var i = 0; i < len; i++) {
				s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
			}
			return(s.join(""));
	};
}(window.GryphonHelpers = window.GryphonHelpers || {}, jQuery));