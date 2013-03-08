var _userRoleRowId;

function GetUserRolesForUsersSuccessCallBack(obj) {
	makinaUserRole.SetUserRoles(obj.ListRolesResult.infoList);
}

function GetUserRolesForUsersFailedCallBack(obj) {

	if (obj.ListRolesResult.visibleMessage != null) {
		alert(obj.ListRolesResult.visibleMessage);
	}

	if (obj.message != null) {
		alert(obj.message);
	}

	return;
}

function GetUserRolesForUsers() {
	var b = new ListRolesRequest('', 1, 1, '', 'GetUserRolesForUsersSuccessCallBack', 'GetUserRolesForUsersFailedCallBack');
	b.send();
}

function GetUserRolesSuccessCallBack(obj) {
	$.when(makinaUserRole.SetUserRoles(obj.ListRolesResult.infoList)).then(makinaUserRole.initialize());
}

function GetUserRolesFailedCallBack(obj) {

	if (obj.ListRolesResult !=null && obj.ListRolesResult.visibleMessage != null) {
		alert(obj.ListRolesResult.visibleMessage);
	}

	if (obj.message != null) {
		alert(obj.message);
	}

	return;
}

function GetUserRoles() {
	var b = new ListRolesRequest('', 1, 1, '', 'GetUserRolesSuccessCallBack', 'GetUserRolesFailedCallBack');
	b.send();
}

function AddUpdateUserRoleSuccessCallBack(obj) {
	if (obj.AddUpdateUserRoleResult != null && obj.AddUpdateUserRoleResult.status == "ERROR") {
		AddUpdateUserRoleFailedCallBack(obj);
		return;
	}
	_userRoleRowId= null;
	GetUserRoles();
}

function AddUpdateUserRoleFailedCallBack(obj) {
	if (obj.AddUpdateUserRoleResult != null && obj.AddUpdateUserRoleResult.visibleMessage != null) {
		alert(obj.AddUpdateUserRoleResult.visibleMessage);
	}

	if (obj.message != null) {
		alert(obj.message);
	}
	return;
}

function DeleteUserRoleSuccessCallBack(obj) {
	if (obj.AddUpdateUserRoleResult != null && obj.AddUpdateUserRoleResult.status == "ERROR") {
		AddUpdateUserRoleFailedCallBack(obj);
		return;
	}	

	_userRoleRowId = null;
	GetUserRoles();
}

function DeleteUserRoleFailedCallBack(obj) {
	if (obj.AddUpdateUserRoleResult != null && obj.AddUpdateUserRoleResult.visibleMessage != null) {
		alert(obj.AddUpdateUserRoleResult.visibleMessage);
	}

	if (obj.message != null) {
		alert(obj.message);
	}
	return;
}

function AddUpdateUserRole() {
	var id = "";
	var roleName = "";
	var visibleName = "";
	var numberofUsers = "";
	var description = "";

	if (_userRoleRowId != null) {
		id = $("#tr-data-" + _userRoleRowId + " #userrole-id").val();
		roleName = $("#tr-data-" + _userRoleRowId + " #userrole-name").val();
		visibleName = $("#tr-data-" + _userRoleRowId + " #userrole-visiblename").val();
		description = $("#tr-data-" + _userRoleRowId + " #userrole-description").val();
		numberofUsers = $("#tr-data-" + _userRoleRowId + " #userrole-number-of-users  option:selected").val();
	}
	else {
		roleName = $("#tr-data-new-userrole #userrole-name").val();
		visibleName = $("#tr-data-new-userrole #userrole-visiblename").val();
		description = $("#tr-data-new-userrole #userrole-description").val();
		numberofUsers = $("#tr-data-new-userrole #userrole-number-of-users  option:selected").val();
	}

	var b = new AddUpdateRoleRequest(id, roleName, visibleName, numberofUsers, description, false, 'AddUpdateUserRoleSuccessCallBack', 'AddUpdateUserRoleFailedCallBack');
	b.send();
};

function DeleteUserRole() {
	var id = "";
	var roleName = "";
	var visibleName = "";
	var numberofUsers = "";
	var description = "";

	if (_userRoleRowId != null) {
		id = $("#tr-data-" + _userRoleRowId + " #userrole-id").val();
		roleName = $("#tr-data-" + _userRoleRowId + " #userrole-name").val();
		visibleName = $("#tr-data-" + _userRoleRowId + " #userrole-visiblename").val();
		description = $("#tr-data-" + _userRoleRowId + " #userrole-description").val();
		numberofUsers = $("#tr-data-" + _userRoleRowId + " #userrole-number-of-users  option:selected").val();

		var b = new AddUpdateRoleRequest(id, roleName, visibleName, numberofUsers, description, true, 'DeleteUserRoleSuccessCallBack', 'DeleteUserRoleFailedCallBack');
		b.send();
	}
};

function DisplayUpdateUserRoleRow(rowId) {

	$("tr[id*='tr-data-userrole']").hide();

	$("#tr-" + rowId).addClass("active");
	$("#tr-data-" + rowId).addClass("active");

	makinaUserRole.SetActiveUserRole($("#tr-data-" + rowId + " #userrole-id").val());

	var activeUserRole = makinaUserRole.GetActiveUserRole();

	$("#tr-data-" + rowId + " #userrole-number-of-users").val(activeUserRole.numberOfUsers);

	$("#tr-data-" + rowId).show();

	_userRoleRowId = rowId;
}

function HideUpdateUserRoleRow(rowId) {

	if ($("#tr-" + rowId).hasClass("active")) { $("#tr-" + rowId).removeClass("active"); }
	if ($("#tr-data-" + rowId).hasClass("active")) { $("#tr-data-" + rowId).removeClass("active"); }

	$("#tr-data-" + rowId).hide();

	_userRoleRowId = null;
}

function DisplayCreateUserRoleRow() {

	$("tr[id*='tr-data-userrole']").hide();
	$("#tr-data-new-userrole").show();
}

function HideCreateUserRoleRow() {
	$("#tr-data-new-userrole").hide();
}

(function (makinaUserRole, $, undefined) {
	var _userRoles = null;
	var _userRole = null;
	
	makinaUserRole.GetUserRolesAsItem = function(selectedValue) {
		var retval = "";		
	
		var userRoles = makinaUserRole.GetUserRoles();

		if(userRoles != null) {

			for(var i=0;i<userRoles.length;i++) {

				var selectedText = "";
				if(selectedValue == userRoles[i].roleId) {
					selectedText = "selected='True'";
				}

				retval = retval + "<option value='" + userRoles[i].roleId +"' "+ selectedText +" >" + userRoles[i].visibleName + "</option>";
			}
		}

		return retval;

	};

	makinaUserRole.SetUserRoles = function(userRoles) {
		_userRoles = userRoles;
	};

	makinaUserRole.GetUserRoles = function() {
		return _userRoles;
	};
	
	makinaUserRole.SetActiveUserRole = function(roleId) {
		var userRoles = makinaUserRole.GetUserRoles();

		if(userRoles != null) {
			for(var i=0;i<userRoles.length;i++) {
				if(userRoles[i].roleId == roleId) {
					_userRole = userRoles[i];
					break;
				}
			}
		}
	};

	makinaUserRole.GetActiveUserRole = function() {
		return _userRole;
	};

	makinaUserRole.initialize = function() {
		var html = "";
		
		for(var i = 0;i<_userRoles.length;i++) {
			var rowId = "userrole-" + i.toString();
			var description = _userRoles[i].description;
			var userRoleId = _userRoles[i].roleId;
			var userRoleName = _userRoles[i].roleName;
			var userRoleVisibleName = _userRoles[i].visibleName;
			var numberOfUsers = _userRoles[i].numberOfUsers;
			html = html + "<tr  id='tr-" + rowId + "' style='opacity: 1;'>" +
				"	<td class='user-username'>" + userRoleVisibleName + "</td>" +
				"	<td class='user-username'>" + description + "</td>" +
				"	<td>" +
				"		<div>" +
				"			<span class='user-email'>" + numberOfUsers + "</span>" +
				"			<div class='help-edit'><a id='userrole-edit-link' href='javascript:DisplayUpdateUserRoleRow(\"" + rowId + "\");'>Click to edit</a></div>" +
				"			<div class='help-close'><a id='userrole-close-link' href='javascript:HideUpdateUserRoleRow(\"" + rowId + "\");'>Click to close</a></div>" +
				"		</div>" +
				"	</td>" +
				"</tr>" +
				"<tr id='tr-data-" + rowId + "' style='display: none;' class='user-details'>" +
				"	<td colspan='4'>" +
				"		<div>" +
				"			<div class='row'>" +
				"				<div class='title'>Role Id</div><div class='detail'><input id='userrole-id' class='full-name-text' readonly='true' value='" + userRoleId + "' type='text'></div>" +
				"			</div>" +
				"			<div class='row'>" +
				"				<div class='title'>Role Name</div><div class='detail'><input id='userrole-name' class='username-text' value='" + userRoleName + "' type='text'></div>" +
				"			</div>" +
				"			<div class='row'>" +
				"				<div class='title'>Role Visible Name</div><div class='detail'><input id='userrole-visiblename' class='username-text' value='" + userRoleVisibleName + "' type='text'></div>" +
				"			</div>" +
				"			<div class='row'>" +
				"				<div class='title'>Description</div><div class='detail'><input id='userrole-description' class='email-text' value='" + description + "' type='text'></div>" +
				"			</div>" +
				"			<div class='row'>" +
				"				<div class='title'>Number of Users</div>" +
				"				<div class='detail'>" +
				"					<select id='userrole-number-of-users'>" +
				"						<option value='0'>0</option>" +
				"						<option value='1'>1</option>" +
				"						<option value='2'>2</option>" +
				"						<option value='3'>3</option>" +
				"						<option value='4'>4</option>" +
				"						<option value='5'>5</option>" +
				"					</select>" +
				"				</div>" +
				"			</div>" +
				"			<div class='button-container'><a class='icon-button light create-user' id='update-userrole' href='javascript:AddUpdateUserRole();'>Update</a><a id='cancel-update-userrole' href='javascript:HideUpdateUserRoleRow(\"" + rowId + "\");' class='icon-button light cancel-user'>Cancel</a><a class='icon-button red delete-user' href='javascript:DeleteUserRole();'>Delete User</a></div>" +
				"		</div>" +
				"	</td>" +
				"</tr>";
		}

		$("#content").html($("#template-userroles").html().replace("{{UserRoles}}", html));
	};
}(window.makinaUserRole = window.makinaUserRole || {}, jQuery));
