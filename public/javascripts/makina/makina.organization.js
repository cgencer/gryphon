var _orgRowId;

function ListOrganizationsSuccessCallBack(obj) {
	makinaOrganization.SetOrganizations(obj.ListOrganizationsResult.infoList);
	makinaOrganization.initialize();
}

function ListOrganizationsFailedCallBack(obj) {
	if (obj.ListOrganizationsResult !=null && obj.ListOrganizationsResult.visibleMessage != null) {
		alert(obj.ListOrganizationsResult.visibleMessage);
	}

	if (obj.message != null) {
		alert(obj.message);
	}

	return;
}

function AddUpdateOrganizationSuccessCallBack(obj) {
	_orgRowId = null;
	GetListOfOrganizations();
    if(_wizardStatus)
        makinaWizard.NextStep();

}

function AddUpdateOrganizationFailedCallBack(obj) {
	if (obj.AddUpdateOrganizationResult != null && obj.AddUpdateOrganizationResult.visibleMessage != null) {
		alert(obj.AddUpdateOrganizationResult.visibleMessage);
	}

	if (obj.message != null) {
		alert(obj.message);
	}
	return;
}

function GetListOfOrganizations() {
	var b = new ListOrganizationsRequest('', 1, 1, '', 'ListOrganizationsSuccessCallBack', 'ListOrganizationsFailedCallBack');
	b.send();
};

function AddUpdateOrganization() {
	var id = "";
	var name = "";
	var description = "";

	if (_orgRowId != null) {
		id = $("#tr-data-" + _orgRowId + " #organization-id").val();
		name = $("#tr-data-" + _orgRowId + " #organization-name").val();
		description = $("#tr-data-" + _orgRowId + " #organization-description").val();
	}
	else {
		name = $("#tr-data-new-organization #organization-name").val();
		description = $("#tr-data-new-organization #organization-description").val();
	}

	var b = new AddUpdateOrganizationRequest(id, name, description, 'AddUpdateOrganizationSuccessCallBack', 'AddUpdateOrganizationFailedCallBack');
	b.send();
};

function DisplayUpdateOrganizationRow(rowId) {

	$("tr[id*='tr-data-organization']").hide();

	$("#tr-" + rowId).addClass("active");
	$("#tr-data-" + rowId).addClass("active");

	$("#tr-data-" + rowId).show();

	_orgRowId = rowId;
}

function HideUpdateOrganizationRow(rowId) {

	if ($("#tr-" + rowId).hasClass("active")) { $("#tr-" + rowId).removeClass("active"); }
	if ($("#tr-data-" + rowId).hasClass("active")) { $("#tr-data-" + rowId).removeClass("active"); }

	$("#tr-data-" + rowId).hide();

	_orgRowId = null;
}

function DisplayCreateOrganizationRow() {

	$("tr[id*='tr-data-organization']").hide();
	$("#tr-data-new-organization").show();
}

function HideCreateOrganizationRow() {
	$("#tr-data-new-organization").hide();
}

(function (makinaOrganization, $, undefined) {
	var _organizations = null;

	makinaOrganization.SetOrganizations = function(organizationList) {
		_organizations = organizationList;
	};

	makinaOrganization.initialize = function() {

		var html = "";
		
		for(var i = 0;i<_organizations.length;i++) {
			var rowId = "organization-" + i.toString();
			var oDescription = _organizations[i].description;
			var oId = _organizations[i].orgId;
			var oName = _organizations[i].orgName;
			html = html  +	"<tr  id='tr-"+ rowId +"' style='opacity: 1;'>" +
							"	<td class='user-full-name'>" + oId +"</td>" +
							"	<td class='user-username'>" + oName +"</td>" +
							"	<td>" +
							"		<div>" +
							"			<span class='user-email'>" + oDescription + "</span>" +
							"			<div class='help-edit'><a id='organization-edit-link' href='javascript:DisplayUpdateOrganizationRow(\"" + rowId + "\");'>Click to edit</a></div>" +
							"			<div class='help-close'><a id='organization-close-link' href='javascript:HideUpdateOrganizationRow(\"" + rowId + "\");'>Click to close</a></div>" +
							"		</div>" +
							"	</td>" +
							"</tr>" +
							"<tr id='tr-data-"+ rowId +"' style='display: none;' class='user-details'>" +
							"	<td colspan='3'>" +
							"		<div>" +
							"			<div class='row'>" +
							"				<div class='title'>Organization Id</div><div class='detail'><input id='organization-id' class='full-name-text' readonly='true' value='" + oId +"' type='text'></div>" +
							"			</div>" +
							"			<div class='row'>" +
							"				<div class='title'>Organization Name</div><div class='detail'><input id='organization-name' class='username-text' value='" + oName +"' type='text'></div>" +
							"			</div>" +
							"			<div class='row'>" +
							"				<div class='title'>Organization Description</div><div class='detail'><input id='organization-description' class='email-text' value='" + oDescription +"' type='text'></div>" +
							"			</div>" +
							"			<div class='button-container'><a class='icon-button light create-user' id='update-organization' href='javascript:AddUpdateOrganization();'>Update</a><a id='cancel-update-organization' href='javascript:HideUpdateOrganizationRow(\"" + rowId + "\");' class='icon-button light cancel-user'>Cancel</a></div>" +
							"		</div>" +
							"	</td>" +
							"</tr>";
		}

		$("#content").html($("#template-organizations").html().replace("{{Organizations}}", html));
	};
}(window.makinaOrganization = window.makinaOrganization || {}, jQuery));
