var _userRolesForAapplicationRowId;

function GetOrganizationsForUserRolesForApplicationSuccessCallBack(obj) {
	makinaUserRolesForApplication.SetOrganizations(obj.ListOrganizationsResult.infoList);
}

function GetOrganizationsForUserRolesForApplicationFailedCallBack(obj) {

	if (obj.ListOrganizationsResult !=null && obj.ListOrganizationsResult.visibleMessage != null) {
		alert(obj.ListOrganizationsResult.visibleMessage);
	}

	if (obj.message != null) {
		alert(obj.message);
	}

	return;
}

function GetOrganizationsForUserRolesForApplication() {
	var b = new ListOrganizationsRequest('', 1, 1, '', 'GetOrganizationsForUserRolesForApplicationSuccessCallBack', 'GetOrganizationsForUserRolesForApplicationFailedCallBack');
	b.send();
}

function GetUserRolesForUserRolesForApplicationSuccessCallBack(obj) {
	makinaUserRolesForApplication.SetUserRoles(obj.ListRolesResult.infoList);
}

function GetUserRolesForUserRolesForApplicationFailedCallBack(obj) {

	if (obj.ListRolesResult !=null && obj.ListRolesResult.visibleMessage != null) {
		alert(obj.ListRolesResult.visibleMessage);
	}

	if (obj.message != null) {
		alert(obj.message);
	}

	return;
}

function GetUserRolesForUserRolesForApplication() {
	var b = new ListRolesRequest('', 1, 1, '', 'GetUserRolesForUserRolesForApplicationSuccessCallBack', 'GetUserRolesForUserRolesForApplicationFailedCallBack');
	b.send();
}

function GetUserRolesByApplicationId(applicationId) {
	var b = new ListUserRoleMatchRequest(applicationId, '', 1, 1, '', 'GetUserRolesByApplicationIdSuccessCallBack', 'GetUserRolesByApplicationIdFailedCallBack');
	b.send();
};

function GetUserRolesByApplicationIdSuccessCallBack(obj) {
	makinaUserRolesForApplication.SetUserRolesForApplications(obj.ListUserRoleMatchResult.infoList);
	makinaUserRolesForApplication.LoadUserRolesForApplications();
}

function GetUserRolesByApplicationIdFailedCallBack(obj) {
	if (obj.ListUserRoleMatchResult != null && obj.ListUserRoleMatchResult.visibleMessage != null) {
		alert(obj.ListUserRoleMatchResult.visibleMessage);
	}

	if (obj.message != null) {
		alert(obj.message);
	}

	return;
}

function GetListOfApplicationsForUserNavigationPanelSuccessCallBack(obj) {
	$.when(makinaUserRolesForApplication.SetApplications(obj.ListAppsResult.infoList))
        .then(makinaUserRolesForApplication.LoadApplicationsNavigationPanel())
        .then(makinaUserRolesForApplication.LoadUserRolesForApplications());

    if(obj.ListAppsResult.infoList.length>0){
        makinaUserRolesForApplication.SetActiveApplication(obj.ListAppsResult.infoList[0].appId)
        GetUserRolesByApplicationId(obj.ListAppsResult.infoList[0].appId);
    }

}

function GetListOfApplicationsForUserNavigationPanelFailedCallBack(obj) {
	if (obj.ListOrganizationsResult !=null && obj.ListOrganizationsResult.visibleMessage != null) {
		alert(obj.ListOrganizationsResult.visibleMessage);
	}

	if (obj.message != null) {
		alert(obj.message);
	}

	return;
}
function GetListOfApplicationsForUserNavigationPanel() {
	var b = new ListAppsRequest('', 1, 1, '', 'GetListOfApplicationsForUserNavigationPanelSuccessCallBack', 'GetListOfApplicationsForUserNavigationPanelFailedCallBack');
	b.send();
};

function LoadUsersByOrganizationIdSuccessCallBack(obj) {
	$.when(makinaUserRolesForApplication.SetUsers(obj.ListUsersResult.infoList))
		.then(function() {
			if (_userRolesForAapplicationRowId == null) {
				$("#tr-data-new-userroleforapplication #userroleforapplication-user").html(makinaUserRolesForApplication.GetUsersAsItem(null));
			} else {
				var userId = $("#tr-data-" + _userRolesForAapplicationRowId + " #userroleforapplication-user-id").val();
				$("#tr-data-" + _userRolesForAapplicationRowId + " #userroleforapplication-user").html(makinaUserRolesForApplication.GetUsersAsItem(userId));
			}
		});
}

function LoadUsersByOrganizationIdFailedCallBack(obj) {
	if (obj.ListUsersResult != null && obj.ListUsersResult.visibleMessage != null) {
		alert(obj.ListUsersResult.visibleMessage);
	}

	if (obj.message != null) {
		alert(obj.message);
	}

	return;
}

function LoadUsersByOrganizationId() {

	var organizationId = _userRolesForAapplicationRowId == null 
		? $("#tr-data-new-userroleforapplication #userroleforapplication-organization option:selected").val()
		: $("#tr-data-" + _userRolesForAapplicationRowId + " #userroleforapplication-organization-id").val();

	if (organizationId != -1) {
		var b = new ListUsersRequest(organizationId, '', 1, 1, '', 'LoadUsersByOrganizationIdSuccessCallBack', 'LoadUsersByOrganizationIdFailedCallBack');
		b.send();
	}
	else {
		alert("Please select an organization");
		return;
	}
}

function SetActiveUserForUserRoleForApplication() {
	var userId = $("#tr-data-new-userroleforapplication #userroleforapplication-user option:selected").val();
	makinaUserRolesForApplication.SetActiveUser(userId);
}

function DisplayCreateUserRoleForApplicationRow() {

	$("tr[id*='tr-data-userroleforapplication']").hide();

	$("#tr-data-new-userroleforapplication #userroleforapplication-organization").html(makinaUserRolesForApplication.GetOrganizationsAsItem(null));

	$("#tr-data-new-userroleforapplication #userroleforapplication-role").html(makinaUserRolesForApplication.GetUserRolesAsItem(null));

	$("#tr-data-new-userroleforapplication").show();
}

function HideCreateUserRoleForApplicationRow() {
	$("#tr-data-new-userroleforapplication").hide();
}

function DisplayUpdateUserRolesForApplicationRow(rowId) {
	_userRolesForAapplicationRowId= rowId;
	
	$("tr[id*='tr-data-userroleforapplication']").hide();

	$("#tr-" + rowId).addClass("active");
	$("#tr-data-" + rowId).addClass("active");
	
	var organizationId = $("#tr-data-" + rowId + " #userroleforapplication-organization-id").val();
	var roleId = $("#tr-data-" + rowId + " #userroleforapplication-role-id").val();

	$.when(
		$("#tr-data-" + rowId + " #userroleforapplication-organization").html(makinaUserRolesForApplication.GetOrganizationsAsItem(organizationId))
	).then( 
		$("#tr-data-" + rowId + " #userroleforapplication-role").html(makinaUserRolesForApplication.GetUserRolesAsItem(roleId))
	).then(
		LoadUsersByOrganizationId()
	);

	$("#tr-data-" + rowId).show();
}

function DeleteUserRolesForApplication() {
	var applicationId = makinaUserRolesForApplication.GetActiveApplication().appId;

	$("input[id*='chk-multiple-delete']").each(function () {
		var elem = $(this);
		if (elem.is(':checked')) {

			var userRolesForApplications = makinaUserRolesForApplication.GetUserRolesForApplications();

			for (var i = 0; i < userRolesForApplications.length; i++) {
				if (userRolesForApplications[i].matchId == $(this).val()) {
					DeleteUserRoleForApplication(applicationId, userRolesForApplications[i].matchId);
				}
			}
		}
	});

	GetUserRolesByApplicationId(applicationId);
}

function HideUpdateUserRolesForApplicationRow(rowId) {

	if ($("#tr-" + rowId).hasClass("active")) {
		$("#tr-" + rowId).removeClass("active");
	}

	if ($("#tr-data-" + rowId).hasClass("active")) {
		$("#tr-data-" + rowId).removeClass("active");
	}

	$("#tr-data-" + rowId).hide();

	_userRolesForAapplicationRowId = null;
}

function AddUpdateUserRoleMatchRequestSuccessCallBack(obj) {
	var applicationId = makinaUserRolesForApplication.GetActiveApplication().appId;
	GetUserRolesByApplicationId(applicationId);
    if(_wizardStatus)
        makinaWizard.NextStep();
}

function AddUpdateUserRoleMatchRequestFailedCallBack(obj) {
	if (obj.AddUpdateUserRoleMatchResult != null && obj.AddUpdateUserRoleMatchResult.visibleMessage != null) {
		alert(obj.AddUpdateUserRoleMatchResult.visibleMessage);
	}

	if (obj.message != null) {
		alert(obj.message);
	}
	
	return;
}

function DeleteUserRoleMatchRequestSuccessCallBack() {
	
}

function DeleteUserRoleMatchRequestFailedCallBack() {

}

function DeleteUserRoleForApplication(applicationId,matchId) {
	var b = new DeleteUserRoleMatchRequest(applicationId, matchId, 'DeleteUserRoleMatchRequestSuccessCallBack', 'DeleteUserRoleMatchRequestFailedCallBack');
	b.send();
}

function AddUpdateUserRoleForApplication() {

	var userId = _userRolesForAapplicationRowId == null 
		? $("#tr-data-new-userroleforapplication #userroleforapplication-user option:selected").val()
		: $("#tr-data-" + _userRolesForAapplicationRowId + " #userroleforapplication-user option:selected").val();

	var roleId = _userRolesForAapplicationRowId == null 
		? $("#tr-data-new-userroleforapplication #userroleforapplication-role option:selected").val()
		: $("#tr-data-" + _userRolesForAapplicationRowId + " #userroleforapplication-role option:selected").val();

	if (userId == "-1") {
		alert("Please select an user");
		return;
	}
	
	var applicationId = makinaUserRolesForApplication.GetActiveApplication().appId;
	var roleInfo = makinaUserRolesForApplication.GetActiveUserRole();
	var userInfo = makinaUserRolesForApplication.GetActiveUser();

	if (userInfo == null) {
		makinaUserRolesForApplication.SetActiveUser(userId);
		userInfo = makinaUserRolesForApplication.GetActiveUser();
	}

	if (roleInfo == null) {
		makinaUserRolesForApplication.SetActiveUserRole(roleId);
		roleInfo = makinaUserRolesForApplication.GetActiveUserRole();
	}

	var b = new AddUpdateUserRoleMatchRequest(applicationId, roleInfo, userInfo, 'AddUpdateUserRoleMatchRequestSuccessCallBack', 'AddUpdateUserRoleMatchRequestFailedCallBack');
	b.send();
}

(function (makinaUserRolesForApplication, $, undefined) {
	var _user = null;
	var _users = null;
	var _applications = null;
	var _organization = null;
	var _organizations = null;
	var _application = null;
	var _userRoles = null;
	var _userRole = null;
	var _navigationHtml = null;
	var _userRolesForApplications = null;

	makinaUserRolesForApplication.SetActiveApplication = function (applicationId) {
		var retval = null;
		
		if (_applications != null) {
			for (var i = 0; i < _applications.length; i++) {
				if (_applications[i].appId == applicationId) {
					retval = _applications[i];
					break;
				}
			}
		}
		_application = retval;
	};

	makinaUserRolesForApplication.GetActiveApplication = function () {
		return _application;
	};

	makinaUserRolesForApplication.SetApplications = function (applications) {
		_applications = applications;
	};

	makinaUserRolesForApplication.GetApplications = function () {
		return _applications;
	};
	
	makinaUserRolesForApplication.SetActiveUser = function (userId) {
		var retval = null;
		var users = makinaUserRolesForApplication.GetUsers();

		if (users != null) {
			for (var i = 0; i < users.length; i++) {
				if (users[i].userId == userId) {
					retval = users[i];
					break;
				}
			}
		}

		_user = retval;
	};

	makinaUserRolesForApplication.GetActiveUser = function () {
		return _user;
	};

	makinaUserRolesForApplication.SetUserRoles = function (userRoleList) {
		_userRoles = userRoleList;
	};

	makinaUserRolesForApplication.GetUserRoles = function () {
		return _userRoles;
	};

	makinaUserRolesForApplication.SetActiveUserRole = function (roleId) {
		var retval = null;
		var userRoles = makinaUserRolesForApplication.GetUserRoles();

		if (userRoles != null) {
			for (var i = 0; i < userRoles.length; i++) {
				if (userRoles[i].roleId == roleId) {
					retval = userRoles[i];
					break;
				}
			}
		}

		_userRole = retval;
	};

	makinaUserRolesForApplication.GetActiveUserRole = function () {
		return _userRole;
	};
	
	makinaUserRolesForApplication.SetUsers = function (users) {
		_users = users;
	};
	
	makinaUserRolesForApplication.GetUsers = function () {
		return _users;
	};

	makinaUserRolesForApplication.GetUsersAsItem = function(selectedValue) {
		var retval = "";

		var users = makinaUserRolesForApplication.GetUsers();

		if (users != null) {
			for (var i = 0; i < users.length; i++) {

				var selectedText = "";
				if (selectedValue == users[i].userId) {
					selectedText = "selected='True'";
				}

				retval = retval + "<option value='" + users[i].userId + "' " + selectedText + " >" + users[i].name + "</option>";
			}
		}
		return retval;
	};

	makinaUserRolesForApplication.SetNavigationHtml = function (navHtml) {
		_navigationHtml = navHtml;
	};

	makinaUserRolesForApplication.GetNavigationHtml = function () {
		return (_navigationHtml == null) ? "" : _navigationHtml;
	};

	makinaUserRolesForApplication.GetOrganizations = function () {
		return _organizations;
	};

	makinaUserRolesForApplication.SetOrganizations = function (organizations) {
		_organizations = organizations;
	};

	makinaUserRolesForApplication.GetActiveOrganization = function () {
		return _organization;
	};

	makinaUserRolesForApplication.SetActiveOrganization = function (organization) {
		_organization = organization;
	};

	makinaUserRolesForApplication.GetOrganizationName = function (organizationId) {
		var retval = "";
		var organizations = makinaUserRolesForApplication.GetOrganizations();

		if (organizations != null) {
			for (var i = 0; i < organizations.length; i++) {
				if (organizations[i].orgId == organizationId) {
					retval = organizations[i].orgName;
					break;
				}
			}
		}

		return retval;
	};

	makinaUserRolesForApplication.GetUserRolesAsItem = function (selectedValue) {
		var retval = "";

		var userRoles = makinaUserRolesForApplication.GetUserRoles();

		if (userRoles != null) {
			for (var i = 0; i < userRoles.length; i++) {

				var selectedText = "";
				if (selectedValue == userRoles[i].roleId) {
					selectedText = "selected='True'";
				}
				
				retval = retval + "<option value='" + userRoles[i].roleId + "' " + selectedText + " >" + userRoles[i].visibleName + "</option>";
			}
		}

		return retval;
	};

	makinaUserRolesForApplication.GetOrganizationsAsItem = function (selectedValue) {
		var retval = "<option value='-1'>Please select an organization</option>";

		var organizations = makinaUserRolesForApplication.GetOrganizations();

		if (organizations != null) {
			for (var i = 0; i < organizations.length; i++) {

				var selectedText = "";
				
				if(selectedValue == null) {
					makinaUserRolesForApplication.SetActiveOrganization(organizations[0]);
				}
				else if (selectedValue == organizations[i].orgId) {
					selectedText = "selected='True'";
					makinaUserRolesForApplication.SetActiveOrganization(organizations[i]);
				}

				retval = retval + "<option value='" + organizations[i].orgId + "' " + selectedText + " >" + organizations[i].orgName + "</option>";
			}
		}

		return retval;
	};

	makinaUserRolesForApplication.LoadApplicationsNavigationPanel = function () {
		var navHtml = "";
		var applications = makinaUserRolesForApplication.GetApplications();

		for (var i = 0; i < applications.length; i++) {
			var appId = applications[i].appId;
			var appname = applications[i].appname;
			navHtml = navHtml + "<div  class='app-container' list-item-id='"+appId+"' onclick='$.when(makinaUserRolesForApplication.SetActiveApplication(\"" + appId + "\")).then(GetUserRolesByApplicationId(\"" + appId + "\"));'><div class='name'>" + appname + "</div></div>";
		}

		makinaUserRolesForApplication.SetNavigationHtml(navHtml);
		$("#content").html($("#template-userrolesforapplications").html().replace("{{NavigationMenu}}", navHtml));
	};

	makinaUserRolesForApplication.SetUserRolesForApplications = function(userRolesForApplications) {
		_userRolesForApplications = userRolesForApplications;
	};

	makinaUserRolesForApplication.GetUserRolesForApplications = function() {
		return _userRolesForApplications;
	};

    makinaUserRolesForApplication.AddActiveClassItemForList = function(idd){

        $("#slimScrollDiv #items .app-container").removeClass("active");
        $(".app-container").each(function(){
            var appId=$(this).attr("list-item-id");
            if(appId == idd)$(this).addClass("active");
        });
    }

    makinaUserRolesForApplication.BindEvent = function(){

        if(this.GetActiveApplication() != null)
            this.AddActiveClassItemForList(this.GetActiveApplication().appId);

        var h=$(window).height();
        $("#slimScrollDiv").slimScroll({
            height: h+'px'
        });
    }

	makinaUserRolesForApplication.LoadUserRolesForApplications = function () {
		var html = "";
		var userRoles = makinaUserRolesForApplication.GetUserRolesForApplications();

		if (userRoles != null) {
			for (var i = 0; i < userRoles.length; i++) {
				var rowId = "userroleforapplication-" + i.toString();
				var roleName = userRoles[i].roleInfo != null ? userRoles[i].roleInfo.visibleName : '';
				var userFullName = userRoles[i].userInfo != null ? userRoles[i].userInfo.name : '';
				var username = userRoles[i].userInfo != null ? userRoles[i].userInfo.username : '';
				var organizationId = userRoles[i].userInfo != null ? userRoles[i].userInfo.orgId : '';
				var roleId = userRoles[i].roleInfo != null ? userRoles[i].roleInfo.roleId : '';
				var userId = userRoles[i].roleInfo != null ? userRoles[i].userInfo.userId : '';
				var matchId = userRoles[i].matchId;
				var userEmail = userRoles[i].userInfo != null ? userRoles[i].userInfo.email : '';

				html = html + "<tr  id='tr-" + rowId + "' style='opacity: 1;'>" +
					"	<td class='user-role-key-name'>" + roleName + "</td>" +
					"	<td class='user-full-name'>" + userFullName + "</td>" +
					"	<td class='user-username'>" + username + "</td>" +
					"	<td class='user-email'>" + userEmail + "</td>" +
					"	<td>" +
					"		<div>" +
					"			<span class='user-email'><input type='checkbox' checked='false' id=chk-multiple-delete value='" + matchId + "'/></span>" +
					"			<div class='help-edit'><a id='organization-edit-link' href='javascript:DisplayUpdateUserRolesForApplicationRow(\"" + rowId + "\");'>Click to edit</a></div>" +
					"			<div class='help-close'><a id='organization-close-link' href='javascript:HideUpdateUserRolesForApplicationRow(\"" + rowId + "\");'>Click to close</a></div>" +
					"		</div>" +
					"	</td>" +
					"</tr>" +
					"<tr id='tr-data-" + rowId + "' style='display: none;' class='user-details'>" +
					"	<td colspan='5'>"+
					"		<div>"+
					"			<div class='row'>"+
					"				<div class='title'>Organization</div><div class='detail'><select onchange='LoadUsersByOrganizationId();' id='userroleforapplication-organization'></select><input type='hidden' id='userroleforapplication-organization-id' value='" + organizationId +"'/></div>"+
					"			</div>"+
					"			<div class='row'>"+
					"				<div class='title'>User</div><div class='detail'><select onchange='SetActiveUserForUserRoleForApplication();' id='userroleforapplication-user'><option value='-1'>Please select an user</option></select><input type='hidden' id='userroleforapplication-user-id' value='" + userId +"'/></div>"+
					"			</div>"+
					"			<div class='row'>"+
					"				<div class='title'>Role</div><div class='detail'><select id='userroleforapplication-role'></select><input type='hidden' id='userroleforapplication-role-id' value='" + roleId +"'/></div>"+
					"			</div>"+
					"			<div class='button-container'><a class='icon-button light create-user' id='create-userroleforapplication' href='javascript:AddUpdateUserRoleForApplication();'>Assign</a><a id='cancel-create-userroleforapplication' href='javascript:HideCreateUserRoleForApplicationRow();' class='icon-button light cancel-user'>Cancel</a></div>"+
					"		</div>"+
					"	</td>"+
					"</tr>";
			}
		}

		$("#content").html($("#template-userrolesforapplications").html().replace("{{UserRoles}}", html).replace("{{NavigationMenu}}", makinaUserRolesForApplication.GetNavigationHtml()));
        makinaUserRolesForApplication.BindEvent();

	};

} (window.makinaUserRolesForApplication = window.makinaUserRolesForApplication || {}, jQuery));