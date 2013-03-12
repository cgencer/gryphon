var dbLayer = (function(dbLayer, $, undefined){

	var databaseUrl = "mydb"; // "username:password@example.com/mydb"
	var collections = ["users", "reports"]
	var db = require("mongojs").connect(databaseUrl, collections);
	init = function () {
		_ts = this;
	}

	this.init();

}(window.dbLayer = window.dbLayer || {}, jQuery));