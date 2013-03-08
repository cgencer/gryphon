var _userRowId;

function generatePassword(isCreateNewUser) {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < 6; i++) {
	    text += possible.charAt(Math.floor(Math.random() * possible.length));
    }

	if(isCreateNewUser) {
		$("#tr-data-new-user #user-password").val(text);
	}
	else {
		$("#tr-data-" + _userRowId + " #user-password").val(text);
	}
}

function GetUsersSuccessCallBack(obj) {
	makinaUser.SetUsers(obj.ListUsersResult.infoList);
	makinaUser.LoadUsers();
}

function GetUsersFailedCallBack(obj) {
	if (obj.ListUsersResult !=null && obj.ListUsersResult.visibleMessage != null) {
		alert(obj.ListUsersResult.visibleMessage);
	}

	if (obj.message != null) {
		alert(obj.message);
	}

	return;
}

function GetListOfOrganizationsForUserNavigationPanelSuccessCallBack(obj) {
	$.when(makinaUser.SetOrganizations(obj.ListOrganizationsResult.infoList))
        .then(makinaUser.LoadOrganizationsNavigationPanel())
        .then(makinaUser.LoadUsers());
    if(obj.ListOrganizationsResult.infoList.length>0){
        makinaUser.SetActiveOrganization(obj.ListOrganizationsResult.infoList[0].orgId);
        GetUsers( makinaUser.GetActiveOrganization().orgId);
    }
}

function GetListOfOrganizationsForUserNavigationPanelFailedCallBack(obj) {
	if (obj.ListOrganizationsResult !=null && obj.ListOrganizationsResult.visibleMessage != null) {
		alert(obj.ListOrganizationsResult.visibleMessage);
	}

	if (obj.message != null) {
		alert(obj.message);
	}

	return;
}

function AddUpdateUserSuccessCallBack(obj) {

	if (obj.AddUpdateUserResult != null && obj.AddUpdateUserResult.status == "ERROR") {
		AddUpdateUserFailedCallBack(obj);
		return;
	}

	_userRowId = null;
	if (makinaUser.GetActiveOrganization() != null) {
		GetUsers( makinaUser.GetActiveOrganization().orgId);

	}
    if(_wizardStatus)
        makinaWizard.NextStep();
}

function AddUpdateUserFailedCallBack(obj) {
	if (obj.AddUpdateUserResult != null && obj.AddUpdateUserResult.visibleMessage != null) {
		alert(obj.AddUpdateUserResult.visibleMessage);
	}

	if (obj.message != null) {
		alert(obj.message);
	}
	return;
}

function DeleteUserSuccessCallBack(obj) {

	if (obj.AddUpdateUserResult != null && obj.AddUpdateUserResult.status == "ERROR") {
		AddUpdateUserFailedCallBack(obj);
		return;
	}

	_userRowId = null;
	if (makinaUser.GetActiveOrganization() != null) {
		GetUsers(makinaUser.GetActiveOrganization().orgId);
	}
}

function DeleteUserFailedCallBack(obj) {
	if (obj.AddUpdateUserResult != null && obj.AddUpdateUserResult.visibleMessage != null) {
		alert(obj.AddUpdateUserResult.visibleMessage);
	}

	if (obj.message != null) {
		alert(obj.message);
	}
	return;
}

function GetListOfOrganizationsForUserNavigationPanel() {
	var b = new ListOrganizationsRequest('', 1, 1, '', 'GetListOfOrganizationsForUserNavigationPanelSuccessCallBack', 'GetListOfOrganizationsForUserNavigationPanelFailedCallBack');
	b.send();
};

function GetUsers(organizationId) {
	var b = new ListUsersRequest(organizationId, '', 1, 1, '', 'GetUsersSuccessCallBack', 'GetUsersFailedCallBack');
	b.send();
};

function AddUpdateUser() {
	var id = "";
	var username = "";
	var fullname = "";
	var email = "";
	var password = "";
	var orgId = "";
	var roleId = "";

	if (_userRowId != null) {
		id = $("#tr-data-" + _userRowId + " #user-id").val();
		fullname = $("#tr-data-" + _userRowId + " #user-fullname").val();
		username = $("#tr-data-" + _userRowId + " #user-username").val();
		email = $("#tr-data-" + _userRowId + " #user-email").val();
		password = $("#tr-data-" + _userRowId + " #user-password").val();
		orgId = $("#tr-data-" + _userRowId + " #user-organization  option:selected").val();
		roleId = $("#tr-data-" + _userRowId + " #user-primary-role  option:selected").val();
	}
	else {
		username = $("#tr-data-new-user #user-username").val();
		fullname = $("#tr-data-new-user #user-fullname").val();
		email = $("#tr-data-new-user #user-email").val();
		password = $("#tr-data-new-user #user-password").val();
		orgId = $("#tr-data-new-user #user-organization  option:selected").val();
		roleId = $("#tr-data-new-user #user-primary-role  option:selected").val();
	}

	var b = new AddUpdateUserRequest(orgId, id, fullname, username, password, email, roleId, false,  'AddUpdateUserSuccessCallBack', 'AddUpdateOrganizationFailedCallBack');
	b.send();
};

function DeleteUser() {
	var id = "";
	var username = "";
	var fullname = "";
	var email = "";
	var password = "";
	var orgId = "";
	var roleId = "";

	if (_userRowId != null) {
		id = $("#tr-data-" + _userRowId + " #user-id").val();
		fullname = $("#tr-data-" + _userRowId + " #user-fullname").val();
		username = $("#tr-data-" + _userRowId + " #user-username").val();
		email = $("#tr-data-" + _userRowId + " #user-email").val();
		password = $("#tr-data-" + _userRowId + " #user-password").val();
		orgId = $("#tr-data-" + _userRowId + " #user-organization  option:selected").val();
		roleId = $("#tr-data-" + _userRowId + " #user-primary-role  option:selected").val();

		var b = new AddUpdateUserRequest(orgId, id, fullname, username, password, email, roleId, true , 'DeleteUserSuccessCallBack', 'DeleteOrganizationFailedCallBack');
		b.send();
	}
};


function DisplayUpdateUserRow(rowId) {

	$("tr[id*='tr-data-user']").hide();

	$("#tr-" + rowId).addClass("active");
	$("#tr-data-" + rowId).addClass("active");

	makinaUser.SetActiveUser($("#tr-data-" + rowId + " #user-id").val());

	var activeUser = makinaUser.GetActiveUser();
	var activeOrganization = makinaUser.GetActiveOrganization();

	if (activeUser != null) {
		$("#tr-data-" + rowId + " #user-primary-role").html(makinaUserRole.GetUserRolesAsItem(activeUser.primaryRole));
	}

	if (activeOrganization != null) {
		$("#tr-data-" + rowId + " #user-organization").html(makinaUser.GetOrganizationsAsItem(activeOrganization.orgId));
	}

	$("#tr-data-" + rowId).show();

	_userRowId = rowId;
}

function HideUpdateUserRow(rowId) {

	if ($("#tr-" + rowId).hasClass("active")) { $("#tr-" + rowId).removeClass("active"); }
	if ($("#tr-data-" + rowId).hasClass("active")) { $("#tr-data-" + rowId).removeClass("active"); }

	$("#tr-data-" + rowId).hide();

	_userRowId = null;
}

function HideCreateOrganizationRow() {
	$("#tr-data-new-user").hide();
}

function DisplayCreateUserRow() {
	
	$("tr[id*='tr-data-user']").hide();

	var activeUser = makinaUser.GetActiveUser();
	var activeOrganization = makinaUser.GetActiveOrganization();

	$("#tr-data-new-user #user-primary-role").html(makinaUserRole.GetUserRolesAsItem((activeUser != null) ? activeUser.primaryRole: null));

	$("#tr-data-new-user #user-organization").html(makinaUser.GetOrganizationsAsItem((activeOrganization != null) ? activeOrganization.orgId : null));

	$("#tr-data-new-user").show();
}

function DisplayHidePasswordRow() {
	var passwordRow = $("#tr-data-" + _userRowId + " .password-row");
	
	if (passwordRow.is(':visible')) {
		passwordRow.hide();
	} else {
		passwordRow.show();
	}
}

(function (makinaUser, $, undefined) {
	var _organizations = null;
	var _organization = null;
	var _users = null;
	var _user = null;
	var _navigationHtml = null;


	makinaUser.SetActiveOrganization= function(organizationId) {
		if(_organizations != null) {
			for(var i=0;i<_organizations.length;i++) {
				if(_organizations[i].orgId == organizationId) {
					_organization = _organizations[i];
					break;
				}
			}
		}
	};
	
	makinaUser.GetActiveOrganization = function() {
		return _organization;
	};

	makinaUser.SetOrganizations= function(organizations) {
		_organizations = organizations;
	};
	
	makinaUser.GetOrganizations= function() {
		return _organizations;
	};

	makinaUser.SetUsers= function(userList) {
		_users = userList;
	};
	
	makinaUser.SetActiveUser = function(userId) {
		var users = makinaUser.GetUsers();

		if(users != null) {
			for(var i=0;i<users.length;i++) {
				if(users[i].userId == userId) {
					_user = users[i];
					break;
				}
			}
		}
	};

	makinaUser.GetActiveUser= function() {
		return _user;
	};

	
	makinaUser.GetUsers= function() {
		return _users;
	};
	
	makinaUser.SetNavigationHtml= function(navHtml) {
		_navigationHtml = navHtml;
	};
	
	makinaUser.GetNavigationHtml= function() {
		 return (_navigationHtml == null) ? "" : _navigationHtml;
	};
	
	makinaUser.GetOrganizationName= function(organizationId) {
		var retval = "";
		var organizations = makinaUser.GetOrganizations();

		if(organizations != null) {
			for(var i=0;i<organizations.length;i++) {
				if(organizations[i].orgId == organizationId) {
					retval = organizations[i].orgName;
					break;
				}
			}
		}

		return retval;
	};

	makinaUser.GetOrganizationsAsItem = function (selectedValue) {
		var retval = "";

		var organizations = makinaUser.GetOrganizations();

		if(organizations != null) {
			for(var i=0;i<organizations.length;i++) {

				var selectedText = "";
				if(selectedValue == organizations[i].orgId) {
					selectedText = "selected='True'";
				}

				retval = retval + "<option value='" + organizations[i].orgId +"' "+ selectedText +" >" + organizations[i].orgName + "</option>";
			}
		}

		return retval;
	};
	
	makinaUser.LoadOrganizationsNavigationPanel = function() {
		var navHtml = "";
		var organizations = makinaUser.GetOrganizations();
		
		for(var i = 0;i<organizations.length;i++) {
			var oId = organizations[i].orgId;
			var oName = organizations[i].orgName;
			navHtml = navHtml + "<div class='app-container' list-item-id='"+oId+"' onclick='$.when(makinaUser.SetActiveOrganization(\"" + oId + "\")).then(GetUsers(\"" + oId + "\"));'><div class='name'>"+ oName+"</div></div>";
		}

		makinaUser.SetNavigationHtml(navHtml);
		$("#content").html($("#template-users").html().replace("{{NavigationMenu}}", navHtml));

	};

    makinaUser.AddActiveClassItemForList = function(idd){

        $("#slimScrollDiv #items .app-container").removeClass("active");
        $(".app-container").each(function(){
            var appId=$(this).attr("list-item-id");
            if(appId == idd)$(this).addClass("active");
        });
    }

    makinaUser.BindEvent = function(){

        if(this.GetActiveOrganization() != null)
           this.AddActiveClassItemForList(this.GetActiveOrganization().orgId);
        var h=$(window).height();
        $("#slimScrollDiv").slimScroll({
            height: h+'px'
        });
    }

	makinaUser.LoadUsers = function () {
		var html = "";
		var users = makinaUser.GetUsers();

		if(users != null) {
			for (var i = 0; i < users.length; i++) {
				var rowId = "user-" + i.toString();
				var userFullName = users[i].name != null ? users[i].name : '';
				var username = users[i].username != null ? users[i].username : '';
				var userId = users[i].userId != null ? users[i].userId : '';
				var userEmail = users[i].email != null ? users[i].email : '';
				var userOrganizationName = makinaUser.GetActiveOrganization().orgName;
				var password = users[i].password != null ? users[i].password : '';
				
				html = html + "<tr  id='tr-" + rowId + "' style='opacity: 1;'>" +
					"	<td class='user-organization-name'>" + userOrganizationName + "</td>" +
					"	<td class='user-full-name'>" + userFullName + "</td>" +
					"	<td class='user-username'>" + username + "</td>" +
					"	<td>" +
					"		<div>" +
					"			<span class='user-email'>" + userEmail + "</span>" +
					"			<div class='help-edit'><a id='organization-edit-link' href='javascript:DisplayUpdateUserRow(\"" + rowId + "\");'>Click to edit</a></div>" +
					"			<div class='help-close'><a id='organization-close-link' href='javascript:HideUpdateUserRow(\"" + rowId + "\");'>Click to close</a></div>" +
					"		</div>" +
					"	</td>" +
					"</tr>" +
					"<tr id='tr-data-" + rowId + "' style='display: none;' class='user-details'>" +
					"	<td colspan='4'>" +
					"		<div>" +
					"			<div class='row'>" +
					"				<div class='title'>User Id</div><div class='detail'><input id='user-id' class='full-name-text' readonly='true' value='" + userId + "' type='text'></div>" +
					"			</div>" +
					"			<div class='row'>" +
					"				<div class='title'>Full Name</div><div class='detail'><input id='user-fullname' class='username-text' value='" + userFullName + "' type='text'></div>" +
					"			</div>" +
					"			<div class='row '>" +
					"				<div class='title'>Username</div><div class='detail'><input id='user-username' class='email-text' value='" + username + "' type='text'><br><div class='small-link change-password' onclick='DisplayHidePasswordRow();'>Change password</div></div>" +
					"			</div>" +
					"			<div class='row password-row'>" +
					"				<div class='title'>Password</div><div class='detail'><input class='password-text' id='user-password' value='" + password + "' type='text'><br><div class='small-link generate-password'onclick='generatePassword(false);'>Generate password</div></div>" +
					"			</div>" +
					"			<div class='row'>" +
					"				<div class='title'>Email</div><div class='detail'><input id='user-email' class='email-text' value='" + userEmail + "' type='text'></div>" +
					"			</div>" +
					"			<div class='row'>" +
					"				<div class='title'>Organization</div><div class='detail'><select id='user-organization'></select></div>" +
					"			</div>" +
					"			<div class='row'>" +
					"				<div class='title'>Primary Role</div><div class='detail'><select id='user-primary-role'></select></div>" +
					"			</div>" +
					"			<div class='button-container'><a class='icon-button light create-user' id='update-organization' href='javascript:AddUpdateUser();'>Update</a><a id='cancel-update-organization' href='javascript:HideUpdateUserRow(\"" + rowId + "\");' class='icon-button light cancel-user'>Cancel</a><a class='icon-button red delete-user' href='javascript:DeleteUser();'>Delete User</a></div>" +
					"		</div>" +
					"	</td>" +
					"</tr>";
			}
		}

		$("#content").html($("#template-users").html().replace("{{Users}}", html).replace("{{NavigationMenu}}", makinaUser.GetNavigationHtml()));
        makinaUser.BindEvent();

	};

}(window.makinaUser = window.makinaUser || {}, jQuery));
