var _actionRowId;

function GetListOfApplicationsForActionsNavigationPanelSuccessCallBack(obj) {


    console.log(obj);

    if(obj.ListAppsResult.infoList.length>0){

	$.when(makinaAction.SetApplications(obj.ListAppsResult.infoList))
        .then(makinaAction.SetActiveApplication(obj.ListAppsResult.infoList[0].appId))
        .then(GetActionsByApplicationId())
        .then(makinaAction.LoadApplicationsNavigationPanel());

    }else{
        $.when(makinaAction.SetApplications(obj.ListAppsResult.infoList))
            .then(makinaAction.LoadApplicationsNavigationPanel());
    }
}

function GetListOfApplicationsForActionsNavigationPanelFailedCallBack(obj) {
	if (obj.ListOrganizationsResult !=null && obj.ListOrganizationsResult.visibleMessage != null) {
		alert(obj.ListOrganizationsResult.visibleMessage);
	}

	if (obj.message != null) {
		alert(obj.message);
	}

	return;
}
function GetListOfApplicationsForActionsNavigationPanel() {
	var b = new ListAppsRequest('', 1, 1, '', 'GetListOfApplicationsForActionsNavigationPanelSuccessCallBack', 'GetListOfApplicationsForActionsNavigationPanelFailedCallBack');
	b.send();
};

function GetActionsByApplicationIdSuccessCallBack(obj) {
	$.when(makinaAction.SetActions(obj.ListActionsResult.infoList)).then(makinaAction.initialize());
}

function GetActionsByApplicationIdFailedCallBack(obj) {
	if (obj.ListActionsResult != null && obj.ListActionsResult.visibleMessage != null) {
		alert(obj.ListActionsResult.visibleMessage);
	}

	if (obj.message != null) {
		alert(obj.message);
	}

	return;
}

function GetActionsByApplicationId() {
	var applicationId = makinaAction.GetActiveApplication().appId;
	var b = new ListActionsRequest(applicationId,'', 1, 1, '', 'GetActionsByApplicationIdSuccessCallBack', 'GetActionsByApplicationIdFailedCallBack');
	b.send();
}

function AddUpdateActionSuccessCallBack(obj) {
	if (obj.AddUpdateActionResult != null && obj.AddUpdateActionResult.status == "ERROR") {
		AddUpdateActionFailedCallBack(obj);
		return;
	}
	GetActionsByApplicationId();
}

function AddUpdateActionFailedCallBack(obj) {
	if (obj.AddUpdateActionResult != null && obj.AddUpdateActionResult.visibleMessage != null) {
		alert(obj.AddUpdateActionResult.visibleMessage);
	}

	if (obj.message != null) {
		alert(obj.message);
	}

	return;
}

function AddUpdateAction() {
	var actionid = "";
	var applicationId = "";
	var actionType = "";
	var actionName = "";
	var eventKeyName = "";

	var application = makinaAction.GetActiveApplication();

	if(application == null) {
		alert("Please select an application");
		return;
	}

	applicationId = application.appId;
	
	if (_actionRowId != null) {
		actionid = $("#tr-data-" + _actionRowId + " #action-id").val();
		actionType = $("#tr-data-" + _actionRowId + " #action-type option:selected").val();
		actionName = $("#tr-data-" + _actionRowId + " #action-name").val();
		eventKeyName = $("#tr-data-" + _actionRowId + " #action-keyname").val();
	}
	else {
		actionType = $("#tr-data-new-action #action-type option:selected").val();
		actionName = $("#tr-data-new-action #action-name").val();
		eventKeyName = $("#tr-data-new-action #action-keyname").val();
	}

	var b = new AddUpdateActionRequest(actionid, applicationId, actionName, actionType, eventKeyName,false, 'AddUpdateActionSuccessCallBack', 'AddUpdateActionFailedCallBack');

	b.send();
};

function DeleteActionSuccessCallBack() {
	
}

function DeleteActionFailedCallBack() {
	
}

function DeleteAction(actionId, applicationId) {
	var b = new DeleteActionRequest(actionId, applicationId, 'DeleteActionSuccessCallBack', 'DeleteActionFailedCallBack');
	b.send();
}

function DeleteActions() {
	var applicationId = makinaAction.GetActiveApplication().appId;

	$("input[id*='chk-multiple-delete']").each(function () {
		var elem = $(this);
		if (elem.is(':checked')) {

			var actions = makinaAction.GetActions();

			for (var i = 0; i < actions.length; i++) {
				if (actions[i].actionId == $(this).val()) {
					DeleteAction(actions[i].actionId, applicationId);
				}
			}
		}
	});

	GetActionsByApplicationId(applicationId);
}

function DisplayCreateActionRow() {

	$("tr[id*='tr-data-action']").hide();

	$("#tr-data-new-action").show();
}

function HideCreateActionRow() {
	$("#tr-data-new-action").hide();
}

function DisplayUpdateActionRow(rowId) {
	_actionRowId= rowId;
	
	$("tr[id*='tr-data-action']").hide();

	$("#tr-" + rowId).addClass("active");
	$("#tr-data-" + rowId).addClass("active");
	
	makinaAction.SetActiveAction($("#tr-data-" + rowId + " #action-id").val());

	var activeAction = makinaAction.GetActiveAction();

	$("#tr-data-" + rowId + " #action-name").val(activeAction.actionName);
	$("#tr-data-" + rowId + " #action-keyname").val(activeAction.eventKeyName);
	$("#tr-data-" + rowId + " #action-type option[value=" + activeAction.actionType +"]").attr("selected","selected");

	$("#tr-data-" + rowId).show();
}

function HideUpdateActionRow(rowId) {

	if ($("#tr-" + rowId).hasClass("active")) {
		$("#tr-" + rowId).removeClass("active");
	}

	if ($("#tr-data-" + rowId).hasClass("active")) {
		$("#tr-data-" + rowId).removeClass("active");
	}

	$("#tr-data-" + rowId).hide();

	_actionRowId = null;
}


(function (makinaAction, $, undefined) {
	var _applications = null;
	var _application = null;
	var _actions = null;
	var _action = null;
	var _navigationHtml = null;

	makinaAction.SetActiveAction = function (actionId) {
		var retval = null;
		
		if (_actions != null) {
			for (var i = 0; i < _actions.length; i++) {
				if (_actions[i].actionId == actionId) {
					retval = _actions[i];
					break;
				}
			}
		}
		_action = retval;
	};

	makinaAction.GetActiveAction = function () {
		return _action;
	};

	makinaAction.SetActiveApplication = function (applicationId) {
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

	makinaAction.GetActiveApplication = function () {
		return _application;
	};

	makinaAction.SetApplications = function (applications) {
		_applications = applications;
	};

	makinaAction.GetApplications = function () {
		return _applications;
	};

	makinaAction.SetNavigationHtml = function (navHtml) {
		_navigationHtml = navHtml;
	};

	makinaAction.GetNavigationHtml = function () {
		return (_navigationHtml == null) ? "" : _navigationHtml;
	};

	makinaAction.LoadApplicationsNavigationPanel = function () {
		var navHtml = "";
		var applications = makinaAction.GetApplications();

		for (var i = 0; i < applications.length; i++) {
			var appId = applications[i].appId;
			var appname = applications[i].appname;
			navHtml = navHtml + "<div  class='app-container' list-item-id='"+appId+"' onclick='$.when(makinaAction.SetActiveApplication(\"" + appId + "\")).then(GetActionsByApplicationId(\"" + appId + "\"));'><div class='name'>" + appname + "</div></div>";
		}

		makinaAction.SetNavigationHtml(navHtml);
		$("#content").html($("#template-actions").html().replace("{{Actions}}", "").replace("{{NavigationMenu}}", navHtml));
	};

	makinaAction.SetActions = function(actions) {
		_actions = actions;
	};

	makinaAction.GetActions = function() {
		return _actions;
	};

    makinaAction.AddActiveClassItemForList = function(idd){

        $("#slimScrollDiv #items .app-container").removeClass("active");
        $(".app-container").each(function(){
            var appId=$(this).attr("list-item-id");
            if(appId == idd)$(this).addClass("active");
        });
    }

    makinaAction.BindEvent = function(){

        if(this.GetActiveApplication() != null)
            this.AddActiveClassItemForList(this.GetActiveApplication().appId);

        var h=$(window).height();
        $("#slimScrollDiv").slimScroll({
            height: h+'px'
        });
    }

	makinaAction.initialize = function () {
		var html = "";
		var actions = makinaAction.GetActions();

		if (actions != null) {
			for (var i = 0; i < actions.length; i++) {
				var rowId = "action-" + i.toString();
				var actionId = actions[i].actionId;
				var actionName = actions[i].actionName;
				var actionTypeName = actions[i].actionType == 0 ? "Makina Action" : "Applicaion Action";
				var eventKeyName = actions[i].eventKeyName;

				html = html + "<tr  id='tr-" + rowId + "' style='opacity: 1;'>" +
					"	<td class='user-action-name'>" + actionName + "</td>" +
					"	<td class='user-action-type'>" + actionTypeName + "</td>" +
					"	<td class='user-action-event-key-name'>" + eventKeyName+ "</td>" +
					"	<td>" +
					"		<div>" +
					"			<span class='user-email'><input type='checkbox' checked='false' id=chk-multiple-delete value='" + actionId + "'/></span>" +
					"			<div class='help-edit'><a id='organization-edit-link' href='javascript:DisplayUpdateActionRow(\"" + rowId + "\");'>Click to edit</a></div>" +
					"			<div class='help-close'><a id='organization-close-link' href='javascript:HideUpdateActionRow(\"" + rowId + "\");'>Click to close</a></div>" +
					"		</div>" +
					"	</td>" +
					"</tr>" +
					"<tr id='tr-data-" + rowId + "' style='display: none;' class='user-details'>" +
					"	<td colspan='5'>"+
					"		<div>"+
					"			<div class='row'>" +
					"				<div class='title'>Action Id</div><div class='detail'><input id='action-id' class='full-name-text' readonly='true' value='" + actionId + "' type='text'></div>" +
					"			</div>" +
					"			<div class='row'>" +
					"				<div class='title'>Action Type</div><div class='detail'><select id='action-type'><option value='0'>Makina Action</option><option value='1'>Application Action</option></select></div>" +
					"			</div>" + 
					"			<div class='row'>" + 
					"				<div class='title'>Action Name</div><div class='detail'><input id='action-name' type='text' /></div>" + 
					"			</div>" + 
					"			<div class='row'>" + 
					"				<div class='title'>InApp Event KeyName</div><div class='detail'><input id='action-keyname' type='text' /></div>" +
					"			</div>" +
					"			<div class='button-container'><a class='icon-button light create-user' id='create-action' href='javascript:AddUpdateAction();'>Update</a><a id='cancel-create-action' href='javascript:HideCreateactionRow();' class='icon-button light cancel-user'>Cancel</a></div>"+
					"		</div>"+
					"	</td>"+
					"</tr>";
			}
		}

		$("#content").html($("#template-actions").html().replace("{{Actions}}", html).replace("{{NavigationMenu}}", makinaAction.GetNavigationHtml()));
        makinaAction.BindEvent();

	};

} (window.makinaAction = window.makinaAction || {}, jQuery));