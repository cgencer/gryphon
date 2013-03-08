/**
 * Created with JetBrains WebStorm.
 * User: NMD
 * Date: 15.01.2013
 * Time: 14:32
 * To change this template use File | Settings | File Templates.
 */

var _userTokenForAapplicationRowId;

// renamed ++
function GetOrganizationsForUserTokensForApplicationSuccessCallBack(obj) {
    makinaUserTokenForApplication.SetOrganizations(obj.ListOrganizationsResult.infoList);
}
// renamed ++
function GetOrganizationsForUserTokensForApplicationFailedCallBack(obj) {

    if (obj.ListOrganizationsResult !=null && obj.ListOrganizationsResult.visibleMessage != null) {
        alert(obj.ListOrganizationsResult.visibleMessage);
    }

    if (obj.message != null) {
        alert(obj.message);
    }

    return;
}
// renamed ++
function GetOrganizationsForUserTokensForApplication() {
    var b = new ListOrganizationsRequest('', 1, 1, '', 'GetOrganizationsForUserTokensForApplicationSuccessCallBack', 'GetOrganizationsForUserTokensForApplicationFailedCallBack');
    b.send();
}


function GetAppWizListUserTokenForApplicationSuccessCallBack(obj){
    console.log("GetAppWizListUserTokenForApplicationSuccessCallBack");

    makinaUserTokenForApplication.SetUserTokenForApplications(obj.AppWizListUserTokensResult.infoList);
    makinaUserTokenForApplication.LoadUserTokenForApplications();



}

function GetAppWizListUserTokenForApplicationFailedCallBack(obj){
    console.log("GetAppWizListUserTokenForApplicationFailedCallBack");
    console.log(obj);
    if (obj.ListOrganizationsResult !=null && obj.ListOrganizationsResult.visibleMessage != null) {
        alert(obj.ListOrganizationsResult.visibleMessage);
    }

    if (obj.message != null) {
        alert(obj.message);
    }

    return;
}

function GetAppWizListUserTokenForApplication(appId){
    var b=new ListUserTokenRequest(appId,'GetAppWizListUserTokenForApplicationSuccessCallBack','GetAppWizListUserTokenForApplicationFailedCallBack');
    b.send();
}


/*

// renamed ++
function GetUserRolesForUserTokenForApplicationSuccessCallBack(obj) {
    makinaUserTokenForApplication.SetUserRoles(obj.ListRolesResult.infoList);
}

function GetUserRolesForUserTokenForApplicationFailedCallBack(obj) {

    if (obj.ListRolesResult !=null && obj.ListRolesResult.visibleMessage != null) {
        alert(obj.ListRolesResult.visibleMessage);
    }

    if (obj.message != null) {
        alert(obj.message);
    }

    return;
}

function GetUserRolesForUserTokenForApplication() {
    var b = new ListRolesRequest('', 1, 1, '', 'GetUserRolesForUserTokenForApplicationSuccessCallBack', 'GetUserRolesForUserTokenForApplicationFailedCallBack');
    b.send();
}
*/
/*
//renamed ++
function GetUserRolesTokenByApplicationId(applicationId) {
    var b = new ListUserRoleMatchRequest(applicationId, '', 1, 1, '', 'GetUserRolesTokenByApplicationIdSuccessCallBack', 'GetUserRolesTokenByApplicationIdFailedCallBack');
    b.send();
};

function GetUserRolesTokenByApplicationIdSuccessCallBack(obj) {
    makinaUserTokenForApplication.SetUserTokenForApplications(obj.ListUserRoleMatchResult.infoList);
    makinaUserTokenForApplication.LoadUserTokenForApplications();

}

function GetUserRolesTokenByApplicationIdFailedCallBack(obj) {
    if (obj.ListUserRoleMatchResult != null && obj.ListUserRoleMatchResult.visibleMessage != null) {
        alert(obj.ListUserRoleMatchResult.visibleMessage);
    }

    if (obj.message != null) {
        alert(obj.message);
    }

    return;
}

*/
// renamed ++
function GetListOfApplicationsForUserTokenNavigationPanelSuccessCallBack(obj) {


    $.when(makinaUserTokenForApplication.SetApplications(obj.ListAppsResult.infoList))
        .then(makinaUserTokenForApplication.LoadApplicationsNavigationPanel());

    if(obj.ListAppsResult.infoList.length>0){
        makinaUserTokenForApplication.SetActiveApplication(obj.ListAppsResult.infoList[0].appId);
        GetAppWizListUserTokenForApplication(obj.ListAppsResult.infoList[0].appId);
    }

}
// renamed ++
function GetListOfApplicationsForUserTokenNavigationPanelFailedCallBack(obj) {
    if (obj.ListOrganizationsResult !=null && obj.ListOrganizationsResult.visibleMessage != null) {
        alert(obj.ListOrganizationsResult.visibleMessage);
    }

    if (obj.message != null) {
        alert(obj.message);
    }

    return;
}
// renamed ++
function GetListOfApplicationsForUserTokenNavigationPanel() {
    var b = new ListAppsRequest('', 1, 1, '', 'GetListOfApplicationsForUserTokenNavigationPanelSuccessCallBack', 'GetListOfApplicationsForUserTokenNavigationPanelFailedCallBack');
    b.send();
};






function LoadUsersForTokenByOrganizationIdSuccessCallBack(obj) {
    $.when(makinaUserTokenForApplication.SetUsers(obj.ListUsersResult.infoList))
        .then(function() {
            if (_userTokenForAapplicationRowId == null) {
                $("#tr-data-new-userroleforapplication #userroleforapplication-user").html(makinaUserTokenForApplication.GetUsersAsItem(null));
            } else {
                var userId = $("#tr-data-" + _userTokenForAapplicationRowId + " #userroleforapplication-user-id").val();
                $("#tr-data-" + _userTokenForAapplicationRowId + " #userroleforapplication-user").html(makinaUserTokenForApplication.GetUsersAsItem(userId));
            }
        });
}

function LoadUsersForTokenByOrganizationIdFailedCallBack(obj) {
    if (obj.ListUsersResult != null && obj.ListUsersResult.visibleMessage != null) {
        alert(obj.ListUsersResult.visibleMessage);
    }

    if (obj.message != null) {
        alert(obj.message);
    }

    return;
}

function LoadUsersForTokenByOrganizationId() {

    var organizationId = _userTokenForAapplicationRowId == null
        ? $("#tr-data-new-userroleforapplication #userroleforapplication-organization option:selected").val()
        : $("#tr-data-" + _userTokenForAapplicationRowId + " #userroleforapplication-organization-id").val();

    if (organizationId != -1) {
        var b = new ListUsersRequest(organizationId, '', 1, 1, '', 'LoadUsersForTokenByOrganizationIdSuccessCallBack', 'LoadUsersForTokenByOrganizationIdFailedCallBack');
        b.send();
    }
    else {
        alert("Please select an organization");
        return;
    }
}
/*
not using
function SetActiveUserForUserRoleForApplication() {
    var userId = $("#tr-data-new-userroleforapplication #userroleforapplication-user option:selected").val();
    makinaUserTokenForApplication.SetActiveUser(userId);
}
*/

function DisplayCreateUserTokenForApplicationRow() {

    $("tr[id*='tr-data-userroleforapplication']").hide();

    $("#tr-data-new-userroleforapplication #userroleforapplication-organization").html(makinaUserTokenForApplication.GetOrganizationsAsItem(null));

    $("#tr-data-new-userroleforapplication #userroleforapplication-role").html(makinaUserTokenForApplication.GetUserRolesAsItem(null));

    $("#tr-data-new-userroleforapplication").show();
}
/*
function HideGetTokenUserForApplicationRow() {
    $("#tr-data-new-userroleforapplication").hide();
}

function DisplayUserTokenForApplicationRow(rowId) {
    _userTokenForAapplicationRowId= rowId;

    $("tr[id*='tr-data-userroleforapplication']").hide();

    $("#tr-" + rowId).addClass("active");
    $("#tr-data-" + rowId).addClass("active");

    var organizationId = $("#tr-data-" + rowId + " #userroleforapplication-organization-id").val();
    var roleId = $("#tr-data-" + rowId + " #userroleforapplication-role-id").val();

    $.when(
        $("#tr-data-" + rowId + " #userroleforapplication-organization").html(makinaUserTokenForApplication.GetOrganizationsAsItem(organizationId))
    ).then(
        $("#tr-data-" + rowId + " #userroleforapplication-role").html(makinaUserTokenForApplication.GetUserRolesAsItem(roleId))
    ).then(
        LoadUsersForTokenByOrganizationId()
    );

    $("#tr-data-" + rowId).show();
}

function DeleteUserRolesForApplication() {
    var applicationId = makinaUserTokenForApplication.GetActiveApplication().appId;

    $("input[id*='chk-multiple-delete']").each(function () {
        var elem = $(this);
        if (elem.is(':checked')) {

            var userRolesForApplications = makinaUserTokenForApplication.GetUserTokenForApplications();

            for (var i = 0; i < userRolesForApplications.length; i++) {
                if (userRolesForApplications[i].matchId == $(this).val()) {
                    DeleteUserRoleForApplication(applicationId, userRolesForApplications[i].matchId);
                }
            }
        }
    });

    GetUserRolesTokenByApplicationId(applicationId);
}
*/

function DeleteUserTokenForApplication(){

   /// alert("not yet..");
}


    function HideUserTokenForApplicationRow(rowId) {

    if ($("#tr-" + rowId).hasClass("active")) {
        $("#tr-" + rowId).removeClass("active");
    }

    if ($("#tr-data-" + rowId).hasClass("active")) {
        $("#tr-data-" + rowId).removeClass("active");
    }

    $("#tr-data-" + rowId).hide();

    _userTokenForAapplicationRowId = null;
}

function AddGetUserTokenForApplicationSuccessCallBack(obj) {
    var applicationId = makinaUserTokenForApplication.GetActiveApplication().appId;
    GetAppWizListUserTokenForApplication(applicationId);
    if(_wizardStatus)
        makinaWizard.NextStep();
}

function AddGetUserTokenForApplicationFailedCallBack(obj) {
    if (obj.AddUpdateUserRoleMatchResult != null && obj.AddUpdateUserRoleMatchResult.visibleMessage != null) {
        alert(obj.AddUpdateUserRoleMatchResult.visibleMessage);
    }

    if (obj.message != null) {
        alert(obj.message);
    }

    return;
}
/*
function DeleteUserRoleMatchRequestSuccessCallBack() {

}

function DeleteUserRoleMatchRequestFailedCallBack() {

}

function DeleteUserRoleForApplication(applicationId,matchId) {
    var b = new DeleteUserRoleMatchRequest(applicationId, matchId, 'DeleteUserRoleMatchRequestSuccessCallBack', 'DeleteUserRoleMatchRequestFailedCallBack');
    b.send();
}
*/

function AddGetUserTokenForApplication() {

    var userId = _userTokenForAapplicationRowId == null
        ? $("#tr-data-new-userroleforapplication #userroleforapplication-user option:selected").val()
        : $("#tr-data-" + _userTokenForAapplicationRowId + " #userroleforapplication-user option:selected").val();

    var orgId= _userTokenForAapplicationRowId == null
        ? $("#tr-data-new-userroleforapplication #userroleforapplication-organization option:selected").val()
        : $("#tr-data-" + _userTokenForAapplicationRowId + " #userroleforapplication-organization option:selected").val();

    if (userId == "-1") {
        alert("Please select an user");
        return;
    }

    var applicationId = makinaUserTokenForApplication.GetActiveApplication().appId;
    var userInfo = makinaUserTokenForApplication.GetActiveUser();



    if (userInfo == null) {
        makinaUserTokenForApplication.SetActiveUser(userId);
        userInfo = makinaUserTokenForApplication.GetActiveUser();
    }


    //AppWizGetToken(appId,orgId,userId,successCallbackMethodName, failedCallbackMethodName)
    var b = new AppWizGetToken(applicationId, orgId, userId, 'AddGetUserTokenForApplicationSuccessCallBack', 'AddGetUserTokenForApplicationFailedCallBack');
    b.send();
}

/**----------------------------------------*/

(function (makinaUserTokenForApplication, $, undefined) {
    var _user = null;
    var _users = null;
    var _applications = null;
    var _organization = null;
    var _organizations = null;
    var _application = null;
    var _userRoles = null;
    var _userRole = null;
    var _navigationHtml = null;
    var _userTokenForApplications = null;

    makinaUserTokenForApplication.SetActiveApplication = function (applicationId) {
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

    makinaUserTokenForApplication.GetActiveApplication = function () {
        return _application;
    };

    makinaUserTokenForApplication.SetApplications = function (applications) {
        console.log("makinaUserTokenForApplication.SetApplications");
        console.log(applications);
        _applications = applications;
    };

    makinaUserTokenForApplication.GetApplications = function () {
        return _applications;
    };

    makinaUserTokenForApplication.SetActiveUser = function (userId) {
        var retval = null;
        var users = makinaUserTokenForApplication.GetUsers();

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

    makinaUserTokenForApplication.GetActiveUser = function () {
        return _user;
    };

    makinaUserTokenForApplication.SetUserRoles = function (userRoleList) {
        console.log("makinaUserTokenForApplication.SetUserRoles");
        console.log(userRoleList);
        _userRoles = userRoleList;
    };

    makinaUserTokenForApplication.GetUserRoles = function () {
        return _userRoles;
    };

    makinaUserTokenForApplication.SetActiveUserRole = function (roleId) {
        var retval = null;
        var userRoles = makinaUserTokenForApplication.GetUserRoles();

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

    makinaUserTokenForApplication.GetActiveUserRole = function () {
        return _userRole;
    };

    makinaUserTokenForApplication.SetUsers = function (users) {
        _users = users;
    };

    makinaUserTokenForApplication.GetUsers = function () {
        return _users;
    };

    makinaUserTokenForApplication.GetUsersAsItem = function(selectedValue) {
        var retval = "";

        var users = makinaUserTokenForApplication.GetUsers();

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

    makinaUserTokenForApplication.SetNavigationHtml = function (navHtml) {
        _navigationHtml = navHtml;
    };

    makinaUserTokenForApplication.GetNavigationHtml = function () {
        return (_navigationHtml == null) ? "" : _navigationHtml;
    };

    makinaUserTokenForApplication.GetOrganizations = function () {
        console.log("makinaUserTokenForApplication.GetOrganizations");
        return _organizations;
    };

    makinaUserTokenForApplication.SetOrganizations = function (organizations) {
        console.log("makinaUserTokenForApplication.SetOrganizations ");
        console.log(organizations);
        _organizations = organizations;
    };

    makinaUserTokenForApplication.GetActiveOrganization = function () {
        return _organization;
    };

    makinaUserTokenForApplication.SetActiveOrganization = function (organization) {
        _organization = organization;
    };

    makinaUserTokenForApplication.GetOrganizationName = function (organizationId) {
        var retval = "";
        var organizations = makinaUserTokenForApplication.GetOrganizations();

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

    makinaUserTokenForApplication.GetUserRolesAsItem = function (selectedValue) {
        var retval = "";

        var userRoles = makinaUserTokenForApplication.GetUserRoles();

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

    makinaUserTokenForApplication.GetOrganizationsAsItem = function (selectedValue) {
        var retval = "<option value='-1'>Please select an organization</option>";

        var organizations = makinaUserTokenForApplication.GetOrganizations();

        console.log("makinaUserTokenForApplication.GetOrganizationsAsItem");
        console.log(organizations);

        if (organizations != null) {
            for (var i = 0; i < organizations.length; i++) {

                var selectedText = "";

                if(selectedValue == null) {
                    makinaUserTokenForApplication.SetActiveOrganization(organizations[0]);
                }
                else if (selectedValue == organizations[i].orgId) {
                    selectedText = "selected='True'";
                    makinaUserTokenForApplication.SetActiveOrganization(organizations[i]);
                }

                retval = retval + "<option value='" + organizations[i].orgId + "' " + selectedText + " >" + organizations[i].orgName + "</option>";
            }
        }

        return retval;
    };

    makinaUserTokenForApplication.LoadApplicationsNavigationPanel = function () {
        var navHtml = "";
        var applications = makinaUserTokenForApplication.GetApplications();

        for (var i = 0; i < applications.length; i++) {
            var appId = applications[i].appId;
            var appname = applications[i].appname;
           // navHtml = navHtml + "<div class='organization-container' onclick='$.when(makinaUserTokenForApplication.SetActiveApplication(\"" + appId + "\")).then(GetUserRolesTokenByApplicationId(\"" + appId + "\"));'><div class='name'>" + appname + "</div></div>";
            navHtml = navHtml + "<div class='app-container' list-item-id='"+appId+"' onclick='$.when(makinaUserTokenForApplication.SetActiveApplication(\"" + appId + "\")).then(GetAppWizListUserTokenForApplication(\"" + appId + "\"));'><div class='name'>" + appname + "</div></div>";
        }

        makinaUserTokenForApplication.SetNavigationHtml(navHtml);
       //// $("#content").html($("#template-userrolesforapplications").html().replace("{{NavigationMenu}}", navHtml));
    };

    makinaUserTokenForApplication.SetUserTokenForApplications = function(userTokenForApplications) {
        _userTokenForApplications = userTokenForApplications;
    };

    makinaUserTokenForApplication.GetUserTokenForApplications = function() {
        return _userTokenForApplications;
    };

    makinaUserTokenForApplication.AddActiveClassItemForList = function(idd){

        $("#slimScrollDiv #items .app-container").removeClass("active");
        $(".app-container").each(function(){
            var appId=$(this).attr("list-item-id");
            if(appId == idd)$(this).addClass("active");
        });
    }

    makinaUserTokenForApplication.BindEvent = function(){

        if(this.GetActiveApplication() != null)
            this.AddActiveClassItemForList(this.GetActiveApplication().appId);

        var h=$(window).height();
        $("#slimScrollDiv").slimScroll({
            height: h+'px'
        });
    }
    makinaUserTokenForApplication.LoadUserTokenForApplications = function () {
        var html = "";

        var userTokens = makinaUserTokenForApplication.GetUserTokenForApplications();

        console.log("makinaUserTokenForApplication.LoadUserTokenForApplications ");
        console.log(userTokens);
        if (userTokens != null) {
            for (var i = 0; i < userTokens.length; i++) {

                var rowId = "userroleforapplication-" + i.toString();

                var userFullName = userTokens[i] != null ? userTokens[i].name : '';
                var userEmail = userTokens[i] != null ? userTokens[i].email : '';
                var userId = userTokens[i] != null ? userTokens[i].userId : '';
                var userToken = userTokens[i] != null ? userTokens[i].token : '';

                var organizationId="0";
                var matchId = userTokens[i].matchId;


                html = html + "<tr  id='tr-" + rowId + "' style='opacity: 1;'>" +
                   /// "	<td class='user-role-key-name'>" + roleName + "</td>" +
                    "	<td class='user-full-name'>" + userFullName + "</td>" +
                   /// "	<td class='user-username'>" + username + "</td>" +
                    "	<td class='user-email'>" + userEmail + "</td>" +
                    "   <td class='user-token'>" + userToken + "</td>"+
                    "</tr>";

                  /*  "<tr id='tr-data-" + rowId + "' style='display: none;' class='user-details'>" +
                    "	<td colspan='4'>"+
                    "		<div>"+
                    "			<div class='row'>"+
                    "				<div class='title'>Organization</div><div class='detail'><select onchange='LoadUsersForTokenByOrganizationId();' id='userroleforapplication-organization'></select><input type='hidden' id='userroleforapplication-organization-id' value='" + organizationId +"'/></div>"+
                    "			</div>"+
                    "			<div class='row'>"+
                    "				<div class='title'>User</div><div class='detail'><select id='userroleforapplication-user'><option value='-1'>Please select an user</option></select><input type='hidden' id='userroleforapplication-user-id' value='" + userId +"'/></div>"+
                    "			</div>"+
                    "			<div class='button-container'><a class='icon-button light create-user' id='create-userroleforapplication' href='javascript:AddGetUserTokenForApplication();'>Get Token</a><a id='cancel-create-userroleforapplication' href='javascript:HideGetTokenUserForApplicationRow();' class='icon-button light cancel-user'>Cancel</a></div>"+
                    "		</div>"+
                    "	</td>"+
                    "</tr>";*/
            }
        }

        $("#content").html($("#template-usertokenforapplications").html().replace("{{UserTokens}}", html).replace("{{NavigationMenu}}", makinaUserTokenForApplication.GetNavigationHtml()));
        makinaUserTokenForApplication.BindEvent();
    };

} (window.makinaUserTokenForApplication = window.makinaUserTokenForApplication || {}, jQuery));

