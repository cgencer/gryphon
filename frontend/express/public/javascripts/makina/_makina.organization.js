var _orgInfo = null;

function ListOrganizationsRequest(orderby, pageNum, pageSize, sort, successCallbackMethodName, failedCallbackMethodName) {
	$.extend(this, new BaseItem());

	this.successCallback = successCallbackMethodName;
	this.failedCallback = failedCallbackMethodName;
	this._type = 'ListOrganizationsRequest';
	this.pager = { "_type": "Pager", "orderBy": orderby, "pageNum": pageNum, "pageSize": pageSize, "sort": sort };
};

function runSuccessCallBack(obj) {
	_orgInfo = obj.ListOrganizationsResult.infoList;
}

function runFailedCallBack(obj) {
	alert(obj.ListOrganizationsResult.visibleMessage);
	return;
}

(function (_makinaOrganization, $, undefined) {

	//Private Properties
	var _activeOrganizationDb = {},
		_activeOrganizations = {},
		_activeOrganization = "";

	//Public Methods
	makinaOrganization.initialize = function () {
		var b = new ListOrganizationsRequest('', 1,1, '', 'runSuccessCallBack', 'runFailedCallBack');
		b.send();		
	};
	makinaOrganization.refresh = function () {
		var b = new ListOrganizationsRequest('', 1,1, '', 'makinaOrganization.runSuccessCallBack', 'makinaOrganization.runFailedCallBack');
		b.send();
	};

	makinaOrganization.reset = function () {
		_activeOrganizationDb = {},
		_activeOrganizations = {},
		_activeOrganization = "";

	};
	makinaOrganization.refreshEvents = function () {
		var b = new ListOrganizationsRequest('', 1,1, '', 'makinaOrganization.runSuccessCallBack', 'makinaOrganization.runFailedCallBack');		
		$.when(b.send()).then(function() { return true; });
	};

	makinaOrganization.setActiveOrganization = function (activeOrganization) {
		_activeOrganization = activeOrganization;
		makinaOrganization.initialize();
	};

	makinaOrganization.getOrganizationData = function () {
		return _orgInfo;
	};

	makinaOrganization.getOrganizations = function () {
		var organizations = (_activeOrganizations) ? ((_activeOrganizations.list) ? _activeOrganizations.list : []) : [],
			organizationNames = [];

		organizationNames.push({
			"key": organizations[i],
			"name": organizations[i],
			"is_active": (_activeOrganization == organizations[i])
		});

		return organizationNames;
	};

	makinaOrganization.clearOrganizationsObject = function (obj) {
		if (obj) {
			if (!obj["c"]) obj["c"] = 0;
			if (!obj["s"]) obj["s"] = 0;
		} else {
			obj = { "c": 0, "s": 0 };
		}

		return obj;
	};


} (window._makinaOrganization = window._makinaOrganization || {}, jQuery));
