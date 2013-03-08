var _applicationRowId;

function GetApplicationsSuccessCallBack(obj) {
	$.when(makinaApplication.SetApplications(obj.ListAppsResult.infoList)).then(makinaApplication.initialize());
}

function GetApplicationsFailedCallBack(obj) {

	if (obj.ListAppsResult !=null && obj.ListAppsResult.visibleMessage != null) {
		alert(obj.ListAppsResult.visibleMessage);
	}

	if (obj.message != null) {
		alert(obj.message);
	}

	return;
}

function GetApplications() {
	var b = new ListAppsRequest('', 1, 1, '', 'GetApplicationsSuccessCallBack', 'GetApplicationsFailedCallBack');
	b.send();
}

function AddUpdateApplicationSuccessCallBack(obj) {
	if (obj.AddUpdateApplicationResult != null && obj.AddUpdateApplicationResult.status == "ERROR") {
		AddUpdateApplicationFailedCallBack(obj);
		return;
	}

	_applicationRowId= null;
	GetApplications();
    if(_wizardStatus)
        makinaWizard.NextStep();
}

function AddUpdateApplicationFailedCallBack(obj) {
	if (obj.AddUpdateApplicationResult != null && obj.AddUpdateApplicationResult.visibleMessage != null) {
		alert(obj.AddUpdateApplicationResult.visibleMessage);
	}

	if (obj.message != null) {
		alert(obj.message);
	}
	return;
}

function DeleteApplicationSuccessCallBack(obj) {
	if (obj.AddUpdateApplicationResult != null && obj.AddUpdateApplicationResult.status == "ERROR") {
		AddUpdateApplicationFailedCallBack(obj);
		return;
	}
	_applicationRowId = null;
	GetApplications();
}

function DeleteApplicationFailedCallBack(obj) {
	if (obj.AddUpdateApplicationResult != null && obj.AddUpdateApplicationResult.visibleMessage != null) {
		alert(obj.AddUpdateApplicationResult.visibleMessage);
	}

	if (obj.message != null) {
		alert(obj.message);
	}
	return;
}

function AddUpdateApplication() {
	var id = "";
	var applicationName = "";
	var marketUrl = "";
	var platform = "";
	var description = "";
	var registerActionId = "";

	if (_applicationRowId != null) {
		id = $("#tr-data-" + _applicationRowId + " #application-id").val();
		applicationName = $("#tr-data-" + _applicationRowId + " #application-name").val();
		marketUrl = $("#tr-data-" + _applicationRowId + " #application-market-url").val();
		description = $("#tr-data-" + _applicationRowId + " #application-description").val();
		platform = $("#tr-data-" + _applicationRowId + " #application-platform  option:selected").val();
		registerActionId = $("#tr-data-" + _applicationRowId + " #application-default-register-action  option:selected").val();
	}
	else {
		applicationName = $("#tr-data-new-application #application-name").val();
		marketUrl = $("#tr-data-new-application #application-market-url").val();
		description = $("#tr-data-new-application #application-description").val();
		platform = $("#tr-data-new-application #application-platform  option:selected").val();
		registerActionId = $("#tr-data-new-application #application-default-register-action  option:selected").val();
	}

	var b = new AddUpdateAppRequest(id, applicationName, marketUrl, platform, description, registerActionId, false, 'AddUpdateApplicationSuccessCallBack', 'AddUpdateApplicationFailedCallBack');

	b.send();
};

function DeleteApplication() {
	var id = "";
	var applicationName = "";
	var marketUrl = "";
	var platform = "";
	var description = "";
	var registerActionId = "";

	if (_applicationRowId != null) {
		id = $("#tr-data-" + _applicationRowId + " #application-id").val();
		applicationName = $("#tr-data-" + _applicationRowId + " #application-name").val();
		marketUrl = $("#tr-data-" + _applicationRowId + " #application-market-url").val();
		description = $("#tr-data-" + _applicationRowId + " #application-description").val();
		platform = $("#tr-data-" + _applicationRowId + " #application-platform  option:selected").val();
		registerActionId = $("#tr-data-" + _applicationRowId + " #application-default-register-action  option:selected").val();

		var b = new AddUpdateAppRequest(id, applicationName, marketUrl, platform, description, registerActionId, true, 'AddUpdateApplicationSuccessCallBack', 'AddUpdateApplicationFailedCallBack');

		b.send();
	}
};

function DisplayUpdateApplicationRow(rowId) {

	$("tr[id*='tr-data-application']").hide();

	$("#tr-" + rowId).addClass("active");
	$("#tr-data-" + rowId).addClass("active");

	makinaApplication.SetActiveApplication($("#tr-data-" + rowId + " #application-id").val());

	var activeApplication = makinaApplication.GetActiveApplication();

	$("#tr-data-" + rowId + " #application-platform").val(activeApplication.platform);
	$("#tr-data-" + rowId + " #application-default-register-action").val(activeApplication.registerActionId);

	$("#tr-data-" + rowId).show();

	_applicationRowId = rowId;
}

function HideUpdateApplicationRow(rowId) {

	if ($("#tr-" + rowId).hasClass("active")) { $("#tr-" + rowId).removeClass("active"); }
	if ($("#tr-data-" + rowId).hasClass("active")) { $("#tr-data-" + rowId).removeClass("active"); }

	$("#tr-data-" + rowId).hide();

	_applicationRowId = null;
}

function DisplayCreateApplicationRow() {

	$("tr[id*='tr-data-application']").hide();
	$("#tr-data-new-application").show();
}

function HideCreateApplicationRow() {
	$("#tr-data-new-application").hide();
}

function GetPlatformName(platformId) {
	var result = "";

	/*switch (platformId) {
	case 0:
		result = "Android";
		break;
	case 1:
		result = "IOS";
		break;
	case 2:
		result = "Windows Phone";
		break;
	}

	*/

    switch (platformId){
        case 0: result = "UNKNOWN"; break;
        case 1: result = "IOS"; break;
        case 2: result = "ANDROID"; break;
        case 3: result = "WINPHONE"; break;
        case 4: result = "SYMBIAN"; break;
        case 5: result = "TIZEN"; break;
    }


	return result;
}


(function (makinaApplication, $, undefined) {
	var _applications = null;
	var _application = null;
	
	makinaApplication.SetApplications = function(applications) {
		_applications = applications;
	};

	makinaApplication.GetApplications = function() {
		return _applications;
	};
	
	makinaApplication.SetActiveApplication = function(appId) {
		var applications = makinaApplication.GetApplications();

		if(applications != null) {
			for(var i=0;i<applications.length;i++) {
				if(applications[i].appId == appId) {
					_application = applications[i];
					break;
				}
			}
		}
	};

	makinaApplication.GetActiveApplication = function() {
		return _application;
	};

	makinaApplication.initialize = function() {
		var html = "";
		
		for(var i = 0;i<_applications.length;i++) {
			var rowId = "application-" + i.toString();
			var description = _applications[i].description;
			var applicationId = _applications[i].appId;
			var applicationName = _applications[i].appname;
			var token = _applications[i].appToken;
			var platform = _applications[i].platform;
			var marketUrl = _applications[i].marketUrl;
			var dashboardUrl = _applications[i].countlyUrl;
			var registerActionId = _applications[i].registerActionId;
			html = html + "<tr  id='tr-" + rowId + "' style='opacity: 1;'>" +
				"	<td class='user-username'>" + applicationName + "</td>" +
				"	<td class='user-username'>" + GetPlatformName(platform) + "</td>" +
				"	<td class='user-username'>" + token + "</td>" +
				"	<td class='user-username'>" + dashboardUrl + "</td>" +
				"	<td class='user-username'>" + marketUrl + "</td>" +
				"	<td>" +
				"		<div>" +
				"			<span class='user-email'>" + description + "</span>" +
				"			<div class='help-edit'><a id='application-edit-link' href='javascript:DisplayUpdateApplicationRow(\"" + rowId + "\");'>Click to edit</a></div>" +
				"			<div class='help-close'><a id='application-close-link' href='javascript:HideUpdateApplicationRow(\"" + rowId + "\");'>Click to close</a></div>" +
				"		</div>" +
				"	</td>" +
				"</tr>" +
				"<tr id='tr-data-" + rowId + "' style='display: none;' class='user-details'>" +
				"	<td colspan='6'>" +
				"		<div>" +
				"			<div class='row'>" +
				"				<div class='title'>Application Id</div><div class='detail'><input id='application-id' class='full-name-text' readonly='true' value='" + applicationId + "' type='text'></div>" +
				"			</div>" +
				"			<div class='row'>" +
				"				<div class='title'>Application Name</div><div class='detail'><input id='application-name' class='username-text' value='" + applicationName +"' type='text'></div>" +
				"			</div>" +
				"			<div class='row'>" +
				"				<div class='title'>Platform</div>" +
				"				<div class='detail'>" +
				"					<select id='application-platform'>" +
				"						<option value='0'>Unknown</option>" +
				"						<option value='1'>IOS</option>" +
				"						<option value='2'>Android</option>" +
				"						<option value='3'>Windows Phone</option>" +
				"						<option value='4'>Symbian</option>" +
				"						<option value='5'>Tizen</option>" +
				"					</select>" +
				"				</div>" +
				"			</div>" +
				"			<div class='row'>" +
				"				<div class='title'>Market Url</div><div class='detail'><input id='application-market-url' class='email-text' value='" + marketUrl + "' type='text'></div>" +
				"			</div>" +
				"			<div class='row'>" +
				"				<div class='title'>Description</div><div class='detail'><input id='application-description' class='email-text' value='" + description + "' type='text'></div>" +
				"			</div>" +
				"			<div class='row'>" +
				"				<div class='title'>Default Register Action</div>" +
				"				<div class='detail'>" +
				"					<select id='application-default-register-action'>" +
				"						<option value='0'>Install</option>" +
				"						<option value='1'>Visit</option>" +
				"					</select>" +
				"				</div>" +
				"			</div>" +
				"			<div class='button-container'><a class='icon-button light create-user' id='update-application' href='javascript:AddUpdateApplication();'>Update</a><a id='cancel-update-application' href='javascript:HideUpdateApplicationRow(\"" + rowId + "\");' class='icon-button light cancel-user'>Cancel</a><a class='icon-button red delete-user' href='javascript:DeleteApplication();'>Delete Application</a></div>" +
				"			<div class='row'>" +
				"				<div class='title'>Token</div><div class='detail'>" + token + "</div>" +
				"				<div class='title'>Dashboard</div><div class='detail'>" + dashboardUrl+ "</div>" +
				"			</div>" +
				"		</div>" +
				"	</td>" +
				"</tr>";
		}

		$("#content").html($("#template-applications").html().replace("{{Applications}}", html));
	};
}(window.makinaApplication = window.makinaApplication || {}, jQuery));
