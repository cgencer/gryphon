var _serviceName = "makinaweb";

var createSessionId = function () { return (createRandomValue() + "-" + createRandomValue() + "-" + createRandomValue() + "-" + createRandomValue()); };
var createRandomValue = function () { return Math.floor(Math.random() * 0x10000 /* 65536 */).toString(16); };
var grabHandsomeMng = function () {}

function BaseItem() {
	this.requiredFields = [];
	this.successCallback = '';
	this.failedCallback = '';
	this._error = null;
	this._value = null;
	this._type = '';
	this.callTag = '';
	this.registerId = '';
//	this.session = _sessionId;
	this.session = amplify.store( "sid" );
	this.verb = '';

/*
http://makina.nmdapps.com/makinaweb/ListOrganizations/
{"_type":"ListOrganizationsRequest",
"callTag":"",
"registerId":"",
"session":"1",
"verb":"",
"pager":{
	"_type":"Pager",
	"orderBy":"",
	"pageNum":1,
	"pageSize":1,
	"sort":""
	}}
{
  "_type": "ListOrganizationsRequest",
  "callTag": "",
  "registerId": "",
  "session": "b260021e-d5a3-461e-b341-c8ee5697490e",
  "verb": "",
  "pager": {
    "_type": "Pager",
    "orderBy": "",
    "pageNum": 1,
    "pageSize": 1,
    "sort": ""
  }
}
*/
	this.send = function () {

		if (this.IsAnyPropertyRequired()) {
			return;
		}

        if(this.session=="" || this.session== null){
            document.location.href = '/login';
            return;
        }

		var _successCallback = this.successCallback;
		var _failedCallback = this.failedCallback;

		var requestData = this.InitializeRequestData(this);
		var _this = this;
		var cmd = this._type.replace("Request", "");
		var urlx = "http://makina.nmdapps.com/" + _serviceName + "/" + cmd + '/' +
		$.base64.encode(requestData);
//console.log(requestData);
		$.when(
			$.ajax({
				successCallbackFunctionName: _successCallback,
				failedCallbackFunctionName: _failedCallback,
				contentType: "application/json; charset=utf-8",
				url: urlx,
				accepts: 'application/json',
				jsonpCallback: 'grabHandsomeMng',
//				processData: true,
				dataType: "jsonp",
				crossDomain: true,
				cache: false,
				type: "GET",
				success: function (data) {
//					console.log(JSON.stringify(data, void 0, "\t"));
					var sn = data._type;
					sn = sn.replace('Response', 'Result');
					sn = sn.replace('Request', 'Result');

					_value = {};
					_value[sn] = data;
					console.log("+#+#+#+#+#+#++#+#+#+#+#++#+#+#+#+#+#++#\n");
					console.log(JSON.stringify(_value, void 0, "\t"));
				},
				error: function (jqXHR, exception) {
					if (jqXHR.status === 0) {
						_error = 'Not connect.\n Verify Network.';
					} else if (jqXHR.status == 404) {
						_error = 'Requested page not found. [404]';
					} else if (jqXHR.status == 500) {
						_error = 'Internal Server Error [500].';
					} else if (exception === 'parsererror') {
						_error = 'Requested JSON parse failed.';
					} else if (exception === 'timeout') {
						_error = 'Time out error.';
					} else if (exception === 'abort') {
						_error = 'Ajax request aborted.';
					} else {
						_error = 'Uncaught Error.\n' + jqXHR.responseText;
					}
				}
			})
		).then(successCallback, failedCallback);
	};

	var successCallback = function () {
		if (_value.Error != null) {
			eval(this.failedCallbackFunctionName + "(_value.Error);");
		}
		else {
			eval(this.successCallbackFunctionName + "(_value);");
		}

	};

	var failedCallback = function () {
		eval(this.failedCallbackFunctionName + "(_error);");
	};

	this.IsAnyPropertyRequired = function () {
		for (i = 0; i < this.requiredFields.length; i++) {
			if (eval('this.' + this.requiredFields[i] == null) || eval('this.' + this.requiredFields[i]) == '') {
				alert(this.requiredFields[i] + ' is required.');
				return true;
			}
		}
	};
/*	{
		"_type": "GetSystemInfoRequest",
		"callTag": "",
		"registerId": "",
		"session": "b260021e-d5a3-461e-b341-c8ee5697490e",
		"verb": ""
	}*/
	this.InitializeRequestData = function (obj) {
		delete obj["requiredFields"];
		delete obj["successCallback"];
		delete obj["failedCallback"];
		delete obj["_value"];
		delete obj["_error"];
		var jsonString = JSON.stringify(obj, null, 2);
//		return '{"request":' + jsonString + '}';
		return jsonString;
	};
}

function UserLoginRequest(deviceId, username, password, successCallbackMethodName, failedCallbackMethodName) {
	$.extend(this, new BaseItem());

	this.successCallback = successCallbackMethodName;
	this.failedCallback = failedCallbackMethodName;
	this._type = 'UserLoginRequest';
	this.deviceId = _sessionId;
	this.userName = username;
	this.pass = password;

	this.requiredFields.push('userName');
	this.requiredFields.push('pass');
};

function ListUsersRequest(orgId, orderby, pageNum, pageSize, sort, successCallbackMethodName, failedCallbackMethodName) {
	$.extend(this, new BaseItem());

	this.successCallback = successCallbackMethodName;
	this.failedCallback = failedCallbackMethodName;
	this._type = 'ListUsersRequest';
	this.orgId = orgId;
	this.pager = { "_type": "Pager", "orderBy": orderby, "pageNum": pageNum, "pageSize": pageSize, "sort": sort };
};
/* commented by nomad:  copy function
function AddUpdateOrganizationRequest(id, name, description, successCallbackMethodName, failedCallbackMethodName) {
	$.extend(this, new BaseItem());

	if (name == null || name == '') {
		alert('name is required.');
		return;
	}

	this.successCallback = successCallbackMethodName;
	this.failedCallback = failedCallbackMethodName;
	this._type = 'AddUpdateOrganizationRequest';
    this.countlyHostId="mkui4.nmdapps.com";//added by nomad
	this.command = 1;
	this.info = { "_type": "OrgInfo", "description": description, "orgId": id, "orgName": name };
};
*/
function ListOrganizationsRequest(orderby, pageNum, pageSize, sort, successCallbackMethodName, failedCallbackMethodName) {
	$.extend(this, new BaseItem());

	this.successCallback = successCallbackMethodName;
	this.failedCallback = failedCallbackMethodName;
	this._type = 'ListOrganizationsRequest';
	this.pager = { "_type": "Pager", "orderBy": orderby, "pageNum": pageNum, "pageSize": pageSize, "sort": sort };
};

function AddUpdateOrganizationRequest(id, name, description, successCallbackMethodName, failedCallbackMethodName) {
	$.extend(this, new BaseItem());

	if (name == null || name == '') {
		alert('name is required.');
		return;
	}

	this.successCallback = successCallbackMethodName;
	this.failedCallback = failedCallbackMethodName;
	this._type = 'AddUpdateOrganizationRequest';
    this.countlyHostId="mkui4.nmdapps.com";//added by nomad
	this.command = 1;
	this.info = { "_type": "OrgInfo", "description": description, "orgId": id, "orgName": name };
};

function ListRolesRequest(orderby, pageNum, pageSize, sort, successCallbackMethodName, failedCallbackMethodName) {
	$.extend(this, new BaseItem());

	this.successCallback = successCallbackMethodName;
	this.failedCallback = failedCallbackMethodName;
	this._type = 'ListRolesRequest';
	this.pager = { "_type": "Pager", "orderBy": orderby, "pageNum": pageNum, "pageSize": pageSize, "sort": sort };
};

function AddUpdateUserRequest(orgId, id, fullname, username, password, email, roleId, deleteUser, successCallbackMethodName, failedCallbackMethodName) {
	$.extend(this, new BaseItem());

	if (!deleteUser) {
		if (username == null || username == '') {
			alert('username is required.');
			return;
		}

		if (email == null || email == '') {
			alert('email is required.');
			return;
		}
	}

	this.successCallback = successCallbackMethodName;
	this.failedCallback = failedCallbackMethodName;
	this._type = 'AddUpdateUserRequest';
	this.command = deleteUser ? 2: 1;
	this.info = {
		"_type": "UserInfo",
		"email": email,
		"name": fullname,
		"orgId": orgId,
		"password": password,
		"primaryRole": {
			"_type": "RoleInfo",
			"description": "",
			"numberOfUsers": 1,
			"roleId": roleId,
			"roleName": null,
			"verbs": null,
			"visibleName": null
		},
		"userId": id,
		"username": username
	};
};

function AddUpdateRoleRequest(id, roleName, visibleName, numberOfUsers, description, deleteUserRole, successCallbackMethodName, failedCallbackMethodName) {
	$.extend(this, new BaseItem());

	if (!deleteUserRole) {
		if (roleName == null || roleName == '') {
			alert('Role Name is required.');
			return;
		}

		if (visibleName == null || visibleName == '') {
			alert('Visible Name is required.');
			return;
		}
	}

	this.successCallback = successCallbackMethodName;
	this.failedCallback = failedCallbackMethodName;
	this._type = 'AddUpdateRoleRequest';
	this.command = deleteUserRole ? 2 : 1;
	this.info = {
		"_type": "RoleInfo",
		"description": description,
		"numberOfUsers": numberOfUsers,
		"roleId": id,
		"roleName": roleName,
		"verbs": null,
		"visibleName": visibleName
	};
};

function ListAppsRequest(orderby, pageNum, pageSize, sort, successCallbackMethodName, failedCallbackMethodName) {
	$.extend(this, new BaseItem());

	this.successCallback = successCallbackMethodName;
	this.failedCallback = failedCallbackMethodName;
	this._type = 'ListAppsRequest';
	this.pager = { "_type": "Pager", "orderBy": orderby, "pageNum": pageNum, "pageSize": pageSize, "sort": sort };
};

function AddUpdateAppRequest(id, applicationName, marketUrl, platform, description, registerActionId,  deleteApplication, successCallbackMethodName, failedCallbackMethodName) {
	$.extend(this, new BaseItem());

	if (!deleteApplication) {
		if (applicationName == null || applicationName == '') {
			alert('Application Name is required.');
			return;
		}
	}

	this.successCallback = successCallbackMethodName;
	this.failedCallback = failedCallbackMethodName;
	this._type = 'AddUpdateAppRequest';
	this.command = deleteApplication ? 2 : 1;
    this.countlyHostId="mkui4.nmdapps.com";//added by nomad
	this.info = {
		"_type": "AppInfo",
		"appId": id,
		"appToken": "",
		"appType": 0,
		"appname": applicationName,
		"countlyApiKey": "",
		"countlyAppKey": "",
		"countlyUrl": "",
		"description": description,
		"iconUrl": "",
		"marketUrl": marketUrl,
		"platform": platform,
		"registerActionId": registerActionId
	};
};
function ListChannelRequest(orderby, pageNum, pageSize, sort, successCallbackMethodName, failedCallbackMethodName) {
	$.extend(this, new BaseItem());

	this.successCallback = successCallbackMethodName;
	this.failedCallback = failedCallbackMethodName;
	this._type = 'ListChannelRequest';
	this.pager = { "_type": "Pager", "orderBy": orderby, "pageNum": pageNum, "pageSize": pageSize, "sort": sort };
};

function AddUpdateChannelRequest(id, channelKeyName, description, actionTrack, clickTrack, installTrack, viewTrack, deleteChannel, successCallbackMethodName, failedCallbackMethodName) {
	$.extend(this, new BaseItem());

	if (!deleteChannel) {
		if (channelKeyName == null || channelKeyName == '') {
			alert('Channel key Name is required.');
			return;
		}
	}

	this.successCallback = successCallbackMethodName;
	this.failedCallback = failedCallbackMethodName;
	this._type = 'AddUpdateChannelRequest';
	this.command = deleteChannel ? 2 : 1;
	this.info = {
		"_type": "ChannelInfo",
		"actionTrack": actionTrack,
		"appId": "",
		"channelId": id,
		"channelKeyName": channelKeyName,
		"clickTrack": clickTrack,
		"description": description,
		"installTrack": installTrack,
		"viewTrack": viewTrack
	};
};


function ListUserRoleMatchRequest(applicationId, orderby, pageNum, pageSize, sort, successCallbackMethodName, failedCallbackMethodName) {
	$.extend(this, new BaseItem());

	this.successCallback = successCallbackMethodName;
	this.failedCallback = failedCallbackMethodName;
	this._type = 'ListUserRoleMatchRequest';
	this.appId = applicationId;
	this.pager = { "_type": "Pager", "orderBy": orderby, "pageNum": pageNum, "pageSize": pageSize, "sort": sort };
};


function AddUpdateUserRoleMatchRequest(applicationId, roleInfo, userInfo,  successCallbackMethodName, failedCallbackMethodName) {
	$.extend(this, new BaseItem());

	this.successCallback = successCallbackMethodName;
	this.failedCallback = failedCallbackMethodName;
	this._type = 'AddUpdateUserRoleMatchRequest';
	this.command = 1;
	this.info = {
		"_type": "UserRoleMatchInfo",
		"appId": applicationId,
		"roleInfo": roleInfo,
		"userInfo": userInfo
	};
};

function DeleteUserRoleMatchRequest(applicationId, matchId, successCallbackMethodName, failedCallbackMethodName) {
	$.extend(this, new BaseItem());

	this.successCallback = successCallbackMethodName;
	this.failedCallback = failedCallbackMethodName;
	this._type = 'AddUpdateUserRoleMatchRequest';
	this.command = 2 ;
	this.info = {
		"_type": "UserRoleMatchInfo",
		"appId": applicationId,
		"matchId": matchId,
		"roleInfo": null,
		"userInfo": null
	};
};


/**
 *
 * @param appId
 * @param successCallbackMethodName
 * @param failedCallbackMethodName
 * @constructor
 */
function ListUserTokenRequest(appId, successCallbackMethodName, failedCallbackMethodName) {
    $.extend(this, new BaseItem());

    this.successCallback = successCallbackMethodName;
    this.failedCallback = failedCallbackMethodName;
    this._type = 'AppWizListUserTokensRequest';
    this.appId=appId;
    this.userId=null;
};



/**
 *
 * @param appId
 * @param orgId
 * @param userId
 * @param successCallbackMethodName
 * @param failedCallbackMethodName
 * @constructor
 */
function AppWizGetToken(appId,orgId,userId,successCallbackMethodName, failedCallbackMethodName){
    $.extend(this, new BaseItem());

    this.successCallback = successCallbackMethodName;
    this.failedCallback = failedCallbackMethodName;
    this._type = 'AppWizGetTokenRequest';
    this.appId=appId;
    this.orgId=orgId;
    this.userId=userId;
}
/**
 *
 * @param applicationId
 * @param orderby
 * @param pageNum
 * @param pageSize
 * @param sort
 * @param successCallbackMethodName
 * @param failedCallbackMethodName
 * @constructor
 */
function ListCampaign(applicationId, orderby, pageNum, pageSize, sort, successCallbackMethodName, failedCallbackMethodName){
    $.extend(this, new BaseItem());

    this.successCallback = successCallbackMethodName;
    this.failedCallback = failedCallbackMethodName;
    this._type = 'ListCampaignRequest';
    this.applicationId = applicationId;
    this.pager = { "_type": "Pager", "orderBy": orderby, "pageNum": pageNum, "pageSize": pageSize, "sort": sort };
}

/**
 *
 * @param appId
 * @param campId
 * @param campaignType
 * @param channelId
 * @param name
 * @param status
 * @param start
 * @param end
 * @param successCallbackMethodName
 * @param failedCallbackMethodName
 * @constructor
 */
function AddUpdateCampaignRequest(appId, campId, campaignType, channelId, name, status, start, end, successCallbackMethodName, failedCallbackMethodName){
    $.extend(this, new BaseItem());

    this.successCallback = successCallbackMethodName;
    this.failedCallback = failedCallbackMethodName;
    this._type = 'AddUpdateCampaignRequest';
    this.command = 1;
    this.info = {
        "_type": "CampaignInfo",
        "appId": appId,
        "campId": campId,
        "campaignType": campaignType,
        "channelId": channelId,
        "name": name,
        "status":status,
        "parentCampId":"",
        "postbackOnAction":"",
        "postbackOnClick":"",
        "postbackOnInstall":"",
        "postbackOnView":"",
        "start":start,
        "end":end
    };
}
/**
 *
 * @param appId
 * @param campId
 * @param successCallbackMethodName
 * @param failedCallbackMethodName
 * @constructor
 */
function DeleteCampaignRequest(appId, campId, successCallbackMethodName, failedCallbackMethodName){
    $.extend(this, new BaseItem());

    this.successCallback = successCallbackMethodName;
    this.failedCallback = failedCallbackMethodName;
    this._type = 'AddUpdateCampaignRequest';
    this.command = 2;
    this.info = {
        "_type": "CampaignInfo",
        "appId": appId,
        "campId": campId
    };
}
/**
 *
 * @param campaignId
 * @param orderby
 * @param pageNum
 * @param pageSize
 * @param sort
 * @param successCallbackMethodName
 * @param failedCallbackMethodName
 * @constructor
 */

function ListMakilinks(campaignId, orderby, pageNum, pageSize, sort, successCallbackMethodName, failedCallbackMethodName){
    $.extend(this, new BaseItem());

    this.successCallback = successCallbackMethodName;
    this.failedCallback = failedCallbackMethodName;
    this._type = 'ListMakilinksRequest';
    this.campaignId = campaignId;
    this.pager = { "_type": "Pager", "orderBy": orderby, "pageNum": pageNum, "pageSize": pageSize, "sort": sort };
}
/**
 *
 * @param userId
 * @param appId
 * @param makilinkId
 * @param campId
 * @param backEndUrl
 * @param makilinkBackEnd
 * @param makilinkFrontEnd
 * @param status
 * @param tags
 * @param successCallbackMethodName
 * @param failedCallbackMethodName
 * @constructor
 */

function AddUpdateMakilink(userId, appId, makilinkId, campId, backEndUrl, makilinkBackEnd, makilinkFrontEnd, status, tags, successCallbackMethodName, failedCallbackMethodName){
    $.extend(this, new BaseItem());

    this.successCallback = successCallbackMethodName;
    this.failedCallback = failedCallbackMethodName;
    this._type = 'AddUpdateMakilinkRequest';
    this.command = 1;
    this.appId=appId;
    this.userId=userId;
    this.info = {
        "_type": "MakilinkInfo",
        "backEndUrl":backEndUrl,
        "campId": campId,
        "makilinkId": makilinkId,
        "makilinkBackEnd": makilinkBackEnd,
        "makilinkFrontEnd": makilinkFrontEnd,
        "status":status,
        "tags":tags
    };
}

function ListAppEnums(successCallbackMethodName, failedCallbackMethodName){

    $.extend(this, new BaseItem());
    this.successCallback = successCallbackMethodName;
    this.failedCallback = failedCallbackMethodName;
    this._type = 'ListAppEnumsRequest';
}


function ListDashboards(successCallbackMethodName, failedCallbackMethodName){
    $.extend(this, new BaseItem());
    this.successCallback = successCallbackMethodName;
    this.failedCallback = failedCallbackMethodName;
    this._type = 'ListDashboardsRequest';
}

function GetSystemInfo(successCallbackMethodName, failedCallbackMethodName){
    $.extend(this, new BaseItem());
    this.successCallback = successCallbackMethodName;
    this.failedCallback = failedCallbackMethodName;
    this._type = 'GetSystemInfoRequest';
}


var _dateFormat="dd/mm/yy";

var AllEnums ={

    MakilinkFrontEnd:{
    NONE:0,
    QR:1
    },
    MakilinkBackEnd:{
        NONE:0,
        MARKET:1,
        LANDINGPAGE:2,
        ROUTER:3
    }

}
function getCookie(c_name){

    var i,x,y,ARRcookies=document.cookie.split(";");
    for (i=0;i<ARRcookies.length;i++)
    {
        x=ARRcookies[i].substr(0,ARRcookies[i].indexOf("="));
        y=ARRcookies[i].substr(ARRcookies[i].indexOf("=")+1);
        x=x.replace(/^\s+|\s+$/g,"");
        if (x==c_name)
        {
            return unescape(y);
        }
    }
}


function GetItemFromEnumObject(enumName,selectedValue){

    var _enum = null;
    var _selectedValue = null;

    if(typeof(selectedValue) == "number" || typeof(selectedValue) == "string" || typeof(selectedValue) == "boolean"){
        _selectedValue=selectedValue;
    }


    if(typeof(AllEnums[enumName]) != undefined){

        if(_selectedValue == null){
            _enum = AllEnums[enumName];
        }else{
            var tmp = eval(AllEnums[enumName]);
            _enum={};
            $.each(tmp,function(k,v){
                if( v == _selectedValue) {
                    _enum.name=k;
                    _enum.value=v;
                }
            });
        }
    }
    return _enum;

}




































































   function ListActionsRequest(applicationId, orderby, pageNum, pageSize, sort, successCallbackMethodName, failedCallbackMethodName) {
   	$.extend(this, new BaseItem());

   	this.successCallback = successCallbackMethodName;
   	this.failedCallback = failedCallbackMethodName;
   	this._type = 'ListActionsRequest';
   	this.appId = applicationId;
   	this.pager = { "_type": "Pager", "orderBy": orderby, "pageNum": pageNum, "pageSize": pageSize, "sort": sort };
   }

   function AddUpdateActionRequest(id, appId,  name, actionType,  eventKeyName, deleteAction, successCallbackMethodName, failedCallbackMethodName) {
   	$.extend(this, new BaseItem());

   	if (name == null || name == '') {
   		alert('name is required.');
   		return;
   	}

   	this.successCallback = successCallbackMethodName;
   	this.failedCallback = failedCallbackMethodName;
   	this._type = 'AddUpdateActionRequest';
   	this.command = deleteAction ? 2 : 1;
   	this.info = {"_type":"ActionInfo","actionId":id,"actionName":name,"actionType":actionType,"appId": appId,"eventKeyName":eventKeyName};

   };

   function DeleteActionRequest(id, appId, successCallbackMethodName, failedCallbackMethodName) {
   	$.extend(this, new BaseItem());

   	if (appId == null || appId == '') {
   		alert('Application Id is required.');
   		return;
   	}

   	if (id == null || id == '') {
   		alert('Action Id is required.');
   		return;
   	}

   	this.successCallback = successCallbackMethodName;
   	this.failedCallback = failedCallbackMethodName;
   	this._type = 'AddUpdateActionRequest';
   	this.command = 2;
   	this.info = { "_type": "ActionInfo", "actionId": id, "actionName": "", "actionType": 0, "appId": appId, "eventKeyName": "" };

   };