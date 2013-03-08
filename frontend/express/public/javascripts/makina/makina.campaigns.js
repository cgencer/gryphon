/**
 * Created with JetBrains WebStorm.
 * User: NMD
 * Date: 16.01.2013
 * Time: 16:18
 * To change this template use File | Settings | File Templates.
 */





var _userCampaignForApplicationRowId;




function GetListOfApplicationsForCampaignNavigationPanelSuccessCallBack(obj) {


    $.when(makinaCampaignForApplication.SetApplications(obj.ListAppsResult.infoList),GetListOfChannelForApplication())
        .then(makinaCampaignForApplication.SetActiveApplication(obj.ListAppsResult.infoList[0].appId))
        .then(makinaCampaignForApplication.LoadApplicationsNavigationPanel())
        .then(GetListOfCampaignForApplication(obj.ListAppsResult.infoList[0].appId)) ;
    ;
}

function GetListOfApplicationsForCampaignNavigationPanelFailedCallBack(obj) {
    if (obj.ListAppsResult !=null && obj.ListAppsResult.visibleMessage != null) {
        alert(obj.ListAppsResult.visibleMessage);
    }

    if (obj.message != null) {
        alert(obj.message);
    }

    return;
}

function GetListOfApplicationsForCampaignNavigationPanel() {
    var b = new ListAppsRequest('', 1, 1, '', 'GetListOfApplicationsForCampaignNavigationPanelSuccessCallBack', 'GetListOfApplicationsForCampaignNavigationPanelFailedCallBack');
    b.send();
};


function GetListOfCampaignForApplicationSuccessCallBack(obj){


    makinaCampaignForApplication.SetCampaigns(obj.ListCampaignResult.infoList);
    if(obj.ListCampaignResult.infoList.length>0)
        makinaCampaignForApplication.SetActiveCampaign(obj.ListCampaignResult.infoList[0].campId);
    makinaCampaignForApplication.LoadCampaignsNavigationPanel();

}
function GetListOfCampaignForApplicationFailedCallBack(obj){
    if (obj.ListCampaignResult !=null && obj.ListCampaignResult.visibleMessage != null) {
        alert(obj.ListCampaignResult.visibleMessage);
    }

    if (obj.message != null) {
        alert(obj.message);
    }

    return;
}
function GetListOfCampaignForApplication(appId){
   var b=new ListCampaign(appId,'',1,1,'','GetListOfCampaignForApplicationSuccessCallBack','GetListOfCampaignForApplicationFailedCallBack');
    b.send();
}


function GetListOfChannelForApplicationSuccessCallBack(obj){
    console.log("GetListOfChannelForApplicationSuccessCallBack");
    makinaCampaignForApplication.SetChannels(obj.ListChannelResult.infoList);
}

function GetListOfChannelForApplicationFailedCallBack(obj){
    if (obj.ListChannelResult !=null && obj.ListChannelResult.visibleMessage != null) {
        alert(obj.ListChannelResult.visibleMessage);
    }

    if (obj.message != null) {
        alert(obj.message);
    }

    return;
}

function GetListOfChannelForApplication(){
    var b=new ListChannelRequest('',1,1,'','GetListOfChannelForApplicationSuccessCallBack','GetListOfChannelForApplicationFailedCallBack');
    b.send();
}


function DisplayCreateUserCampaignForApplicationRow() {

    $("tr[id*='tr-data-usercampaignforapplication']").hide();

    $("#tr-data-new-usercampaignforapplication #usercampaignforapplication-channel").html(makinaCampaignForApplication.GetChannelsAsItem(null));
    $("#tr-data-new-usercampaignforapplication #usercampaignforapplication-campaign-type").html(makinaCampaignForApplication.GetCampaignTypeAsItem(null));
    $("#tr-data-new-usercampaignforapplication #usercampaignforapplication-status").html(makinaCampaignForApplication.GetStatusAsItem(null));
    $("#usercampaignforapplication-start").datepicker({dateFormat: _dateFormat});
    $("#usercampaignforapplication-end").datepicker({dateFormat: _dateFormat});


    $("#tr-data-new-usercampaignforapplication").show();
}



function HideCreateCampaignForApplicationRow() {
    $("#tr-data-new-usercampaignforapplication").hide();
    $("#tr-data-" + _userCampaignForApplicationRowId).hide();
    $("#tr-data-" + _userCampaignForApplicationRowId + " .help-edit").show();
    $("#tr-data-" + _userCampaignForApplicationRowId + " .help-close").hide();
    _userCampaignForApplicationRowId = null;
}

function DisplayUpdateCampaignForApplicationRow(rowId,campId) {

    _userCampaignForApplicationRowId= rowId;

    $("tr[id*='tr-data-usercampaignforapplication']").hide();

    $("#tr-" + rowId).addClass("active");
    $("#tr-data-" + rowId).addClass("active");


    var channelId = $("#tr-data-" + rowId + " #usercampaignforapplication-channel-id").val();
    var campaignType = $("#tr-data-" + rowId + " #usercampaignforapplication-campaign-type-id").val();
    var statusId = $("#tr-data-" + rowId + " #usercampaignforapplication-status-id").val();

    $.when(
        $("#tr-data-" + rowId + " #usercampaignforapplication-channel").html(makinaCampaignForApplication.GetChannelsAsItem(channelId))
    ).then(
        $("#tr-data-" + rowId + " #usercampaignforapplication-campaign-type").html(makinaCampaignForApplication.GetCampaignTypeAsItem(campaignType))
    ).then(
        $("#tr-data-" + rowId + " #usercampaignforapplication-status").html(makinaCampaignForApplication.GetStatusAsItem(statusId))
    );

    $("#tr-data-" + rowId + "-usercampaignforapplication-start").datepicker({dateFormat: _dateFormat});
    $("#tr-data-" + rowId + "-usercampaignforapplication-end").datepicker({dateFormat: _dateFormat});



    $("#tr-data-" + rowId + " .help-edit").hide();
    $("#tr-data-" + rowId + " .help-close").show();
    $("#tr-data-" + rowId).show();
    makinaCampaignForApplication.SetActiveCampaign(campId);
}


function UpdateCampaignForApplicationSuccessCallBack(obj){
    GetListOfCampaignForApplication(makinaCampaignForApplication.GetActiveApplication().appId);
}

function UpdateCampaignForApplicationFailedCallBack(obj){
    if (obj.AddUpdateCampaignResult !=null && obj.AddUpdateCampaignResult.visibleMessage != null) {
        alert(obj.AddUpdateCampaignResult.visibleMessage);
    }

    if (obj.message != null) {
        alert(obj.message);
    }

    return;
}


function UpdateCampaignForApplication(){

    var appId = makinaCampaignForApplication.GetActiveApplication().appId;

    var channelId= makinaCampaignForApplication.GetActiveCampaign().channelId;
    var campId= makinaCampaignForApplication.GetActiveCampaign().campId;
    var campaignType= makinaCampaignForApplication.GetActiveCampaign().campaignType;
    var name= makinaCampaignForApplication.GetActiveCampaign().name;

    var start= $("#tr-data-" + _userCampaignForApplicationRowId + " #tr-data-" + _userCampaignForApplicationRowId + "-usercampaignforapplication-start").val();
    var end= $("#tr-data-" + _userCampaignForApplicationRowId + " #tr-data-" + _userCampaignForApplicationRowId + "-usercampaignforapplication-end").val();
    var status= $("#tr-data-" + _userCampaignForApplicationRowId + " #usercampaignforapplication-status").val();


    if(start =="" || start == null){
        alert("start date is required.");
        return;
    }
    if(end =="" || end == null){
        alert("end date is required.");
        return;
    }
    if(name =="" || name == null){
        alert("campaign name is required.");
        return;
    }

    var startDate= makinaCampaignForApplication.ConvertDateForCampaign(start);
    var endDate= makinaCampaignForApplication.ConvertDateForCampaign(end);




    var b = new AddUpdateCampaignRequest(appId,campId, campaignType, channelId, name, status, startDate, endDate, 'UpdateCampaignForApplicationSuccessCallBack', 'UpdateCampaignForApplicationFailedCallBack');
    b.send();

}


function AddCampaignForApplicationSuccessCallBack(obj){
    GetListOfCampaignForApplication(makinaCampaignForApplication.GetActiveApplication().appId);
}

function AddCampaignForApplicationFailedCallBack(obj){
    if (obj.AddUpdateCampaignResult !=null && obj.AddUpdateCampaignResult.visibleMessage != null) {
        alert(obj.AddUpdateCampaignResult.visibleMessage);
    }

    if (obj.message != null) {
        alert(obj.message);
    }

    return;
}

function AddCampaignForApplication(){

    var appId = makinaCampaignForApplication.GetActiveApplication().appId;
    var channelId= $("#tr-data-new-usercampaignforapplication #usercampaignforapplication-channel").val();
    var campaignType= $("#tr-data-new-usercampaignforapplication #usercampaignforapplication-campaign-type").val();
    var start= $("#tr-data-new-usercampaignforapplication #usercampaignforapplication-start").val();
    var end= $("#tr-data-new-usercampaignforapplication #usercampaignforapplication-end").val();
    var status= $("#tr-data-new-usercampaignforapplication #usercampaignforapplication-status").val();
    var name= $("#tr-data-new-usercampaignforapplication #usercampaignforapplication-campaign-name").val();


    if(start =="" || start == null){
        alert("start date is required.");
        return;
    }
    if(end =="" || end == null){
        alert("end date is required.");
        return;
    }
    if(name =="" || name == null){
        alert("campaign name is required.");
        return;
    }

    var startDate= makinaCampaignForApplication.ConvertDateForCampaign(start);
    var endDate= makinaCampaignForApplication.ConvertDateForCampaign(end);


    var b = new AddUpdateCampaignRequest(appId,"", campaignType, channelId, name, status, startDate, endDate, 'AddCampaignForApplicationSuccessCallBack', 'AddCampaignForApplicationFailedCallBack');
    b.send();

}

function DeleteCampaignForApplication(campId){
    var appId = makinaCampaignForApplication.GetActiveApplication().appId;
    var b = new DeleteCampaignRequest(appId, campId, 'AddCampaignForApplicationSuccessCallBack', 'AddCampaignForApplicationFailedCallBack');
    b.send();
}




(function (makinaCampaignForApplication, $, undefined) {

    var _applications = null;
    var _application = null;
    var _campaigns = null;
    var _campaign = null;
    var _channels = null;

    var _status = [{"name":"Active", "value":true },{"name":"Passive", "value":false }];
    var _campaignType =[{"name":"CPI", "value":0 }, {"name":"CPA", "value":1 } ];

    var _navigationHtml = null;

    makinaCampaignForApplication.SetApplications = function (applications) {
        _applications = applications;
    };

    makinaCampaignForApplication.GetApplications = function () {
        return _applications;
    };

    makinaCampaignForApplication.SetActiveApplication = function (applicationId) {
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

    makinaCampaignForApplication.GetActiveApplication = function () {
        return _application;
    };

    makinaCampaignForApplication.SetCampaigns = function(listOfCampaigns){
       _campaigns = listOfCampaigns;
    }

    makinaCampaignForApplication.GetCampaigns = function(){
        return _campaigns;
    }


    makinaCampaignForApplication.SetActiveCampaign = function(campaignId){
        var retval = null;

        if(_campaigns != null){
            var lengthOfCampaigns=_campaigns.length;
            for(var i=0;i < lengthOfCampaigns; i++){
                if(_campaigns[i].campId == campaignId){
                    retval = _campaigns[i];
                    break;
                }
            }
        }
        _campaign = retval;
    }

    makinaCampaignForApplication.GetActiveCampaign = function(){
        return _campaign;
    }

    makinaCampaignForApplication.GetDateForCampaign = function (mDate){


        var date= mDate.date;
        var newDate = $.datepicker.parseDate("ddmmyy",date);
        var newFormat = $.datepicker.formatDate(_dateFormat, newDate);

        return newFormat;
    }

    makinaCampaignForApplication.ConvertDateForCampaign = function(stringDate){

        var newDate = $.datepicker.parseDate(_dateFormat,stringDate);
        var newFormat = $.datepicker.formatDate("ddmmyy", newDate);

         var _time ="";

         var MDate={
             "_type":"MDate",
             "date":newFormat,
             "time":"000000",
             "zone":"+0200"
         };
         return MDate;

     }

    makinaCampaignForApplication.SetChannels = function(listOfChannel){
        _channels = listOfChannel;
    }

    makinaCampaignForApplication.GetChannels = function(){
        return _channels;
    }
    makinaCampaignForApplication.GetChannelsName = function(channelId){

        var channels = makinaCampaignForApplication.GetChannels();

        var name="";
        for(var i=0;i<channels.length;i++){
            if(channels[i].channelId == channelId){
                name=channels[i].channelKeyName;
                break;
            }
        }


        return name;
    }

    makinaCampaignForApplication.GetChannelsAsItem = function(selectedValue){
        var retval = "";

        var channels = makinaCampaignForApplication.GetChannels();

        if (channels != null) {
            var lengthOfChannels = channels.length;
            for (var i = 0; i < lengthOfChannels; i++) {
                var selectedText = "";
                if (selectedValue == channels[i].channelId) {
                    selectedText = "selected='True'";
                }
                retval = retval + "<option value='" + channels[i].channelId + "' " + selectedText + " >" + channels[i].channelKeyName + "</option>";
            }
        }
        return retval;
    }

    makinaCampaignForApplication.GetStatusAsItem = function(selectedValue){
        var retval = "";

        var status = _status;

        if (status != null) {
            var lengthOfStatus = status.length;
            for (var i = 0; i < lengthOfStatus; i++) {
                var selectedText = "";
                if (selectedValue == status[i].value.toString()) {
                    selectedText = "selected='True'";
                }
                retval = retval + "<option value='" + status[i].value + "' " + selectedText + " >" + status[i].name + "</option>";
            }
        }
        return retval;
    }

    makinaCampaignForApplication.GetCampaignTypeAsItem = function(selectedValue){
        var retval = "";

        var campaignType = _campaignType;

        if (status != null) {
            var lengthOfCampaignType = campaignType.length;
            for (var i = 0; i < lengthOfCampaignType; i++) {
                var selectedText = "";
                if (selectedValue == campaignType[i].value) {
                    selectedText = "selected='True'";
                }
                retval = retval + "<option value='" + campaignType[i].value + "' " + selectedText + " >" + campaignType[i].name + "</option>";
            }
        }
        return retval;
    }

    makinaCampaignForApplication.SetNavigationHtml = function (navHtml) {
        _navigationHtml = navHtml;
    };

    makinaCampaignForApplication.GetNavigationHtml = function () {
        return (_navigationHtml == null) ? "" : _navigationHtml;
    };

    makinaCampaignForApplication.LoadApplicationsNavigationPanel = function () {
        var navHtml = "";
        var applications = makinaCampaignForApplication.GetApplications();

        console.log("makinaCampaignForApplication.LoadApplicationsNavigationPanel");

        for (var i = 0; i < applications.length; i++) {
            var appId = applications[i].appId;
            var appname = applications[i].appname;
            // navHtml = navHtml + "<div class='organization-container' onclick='$.when(makinaUserTokenForApplication.SetActiveApplication(\"" + appId + "\")).then(GetUserRolesTokenByApplicationId(\"" + appId + "\"));'><div class='name'>" + appname + "</div></div>";
            navHtml = navHtml + "<div class='app-container' list-item-id='"+appId+"'  onclick='$.when(makinaCampaignForApplication.SetActiveApplication(\"" + appId + "\")).then(GetListOfCampaignForApplication(\"" + appId + "\"));'><div class='name'>" + appname + "</div></div>";
        }

        makinaCampaignForApplication.SetNavigationHtml(navHtml);

        //$("#content").html($("#template-usercampaignforapplications").html().replace("{{NavigationMenu}}", navHtml));
         $("#content").html($("#template-usercampaignforapplications").html().replace("{{Campaigns}}", "").replace("{{NavigationMenu}}", makinaCampaignForApplication.GetNavigationHtml()));
    };
    makinaCampaignForApplication.AddActiveClassItemForList = function(idd){

        $("#slimScrollDiv #items .app-container").removeClass("active");
        $(".app-container").each(function(){
            var appId=$(this).attr("list-item-id");
            if(appId == idd)$(this).addClass("active");
        });
    }

    makinaCampaignForApplication.BindEvent = function(){

        if(this.GetActiveApplication() != null)
            this.AddActiveClassItemForList(this.GetActiveApplication().appId);

        var h=$(window).height();
        $("#slimScrollDiv").slimScroll({
            height: h+'px'
        });
    }

    makinaCampaignForApplication.LoadCampaignsNavigationPanel = function(){

        console.log("makinaCampaignForApplication.LoadCampaignsNavigationPanel");
        var html="";
        ///alert("11111111");

        var campaigns=makinaCampaignForApplication.GetCampaigns();
        if(campaigns != null ){

            var lengthOfCampaigns= campaigns.length;
            for(var i=0; i < lengthOfCampaigns; i++){

                var rowId = "usercampaignforapplication-" + i.toString();
                var campId = campaigns[i].campId;
                var campaignName = campaigns[i].name;
                var channel = campaigns[i].channelId;
                var channelName = makinaCampaignForApplication.GetChannelsName(campaigns[i].channelId);
                var campaignType = campaigns[i].campaignType;
                var start = makinaCampaignForApplication.GetDateForCampaign(campaigns[i].start);
                var end = makinaCampaignForApplication.GetDateForCampaign(campaigns[i].end);
                var postBacksOn = "";
                var status = campaigns[i].status;
                var statusName = "";
                var campaignTypeName = "";


                for(var j=0;j<_status.length; j++){
                    if(_status[j].value == status){
                        statusName = _status[j].name;
                        break;
                    }
                }

                for(var k=0; k<_campaignType.length; k++){
                    if(_campaignType[k].value == campaignType){
                        campaignTypeName=_campaignType[k].name;
                        break;
                    }
                }

                html +=  "<tr  id='tr-" + rowId + "' style='opacity: 1;'>" +
                     "	<td class='campaign-name'>" + campaignName + "</td>" +
                    "	<td class='campaign-channel'>" + channelName + "</td>" +
                     "	<td class='campaign-type'>" + campaignTypeName + "</td>" +
                    "	<td class='campaign-start'>" + start + "</td>" +
                    "   <td class='campaign-end'>" + end + "</td>"+
                    "   <td class='campaign-postbackson'>" + postBacksOn + "</td>"+
                    "   <td class='campaign-status'>" + statusName + "</td>"+
                    "	<td  style='width:90px;'>" +
                    "		<div>" +
                    "			<span class='campaign-name' >" +
                    "			<div class='help-edit'><a id='campaign-edit-link' href='javascript:DisplayUpdateCampaignForApplicationRow(\"" + rowId + "\", \""+campId+"\");'>Click to edit</a></div>" +
                    "			<div class='help-close'><a id='campaign-close-link' href='javascript:HideCreateCampaignForApplicationRow(\"" + rowId + "\");'>Click to close</a></div>" +
                    "		</div>" +
                    "	</td>" +
                    "</tr>" +
                "<tr id='tr-data-" + rowId + "' style='display: none;' class='user-details'>" +
                    "	<td colspan='8'>"+
                    "       <div>"+
                    "           <div class='row'>"+
                    "               <div class='title'>Channel</div><div class='detail'><select disabled id='usercampaignforapplication-channel'></select>" +
                    "               <input type='hidden' id='usercampaignforapplication-channel-id' value='"+channel+"'  /></div>"+
                    "           </div>"+
                    "           <div class='row'>"+
                    "               <div class='title'>Campaign Type</div><div class='detail'><select disabled  id='usercampaignforapplication-campaign-type'></select>" +
                    "               <input type='hidden' id='usercampaignforapplication-campaign-type-id' value='"+campaignType+"'  /></div>"+
                    "           </div>"+
                    "           <div class='row'>"+
                    "               <div class='title'>Start</div>" +
                    "               <div class='detail'>" +
                    "                   <input readonly id='tr-data-" + rowId + "-usercampaignforapplication-start' type='text' style='width: 100px;' value='"+start+"' />" +
                    "               </div>"+
                    "           </div>"+
                    "           <div class='row'>"+
                    "               <div class='title'>End</div><div class='detail'><input readonly id='tr-data-" + rowId + "-usercampaignforapplication-end' type='text' style='width: 100px;' value='"+end+"' /></div>"+
                    "           </div>"+
                    "           <div class='row'>"+
                    "               <div class='title'>Status</div><div class='detail'><select id='usercampaignforapplication-status'></select>" +
                    "               <input type='hidden' id='usercampaignforapplication-status-id' value='"+status+"'  /></div>"+
                    "           </div>"+
                    "           <div class='row'>"+
                    "               <div class='title'>Campaign Id</div><div class='detail'>"+campId+"</div>"+
                    "           </div>"+
                    "           <div class='button-container'>" +
                    "               <a class='icon-button red delete-user' href='javascript:DeleteCampaignForApplication(\""+campId+"\");'>Delete</a>" +
                    "               <a class='icon-button light create-user' id='create-usercampaignforapplication' href='javascript:UpdateCampaignForApplication();'>Update</a>"+
                    "               <a id='cancel-create-usercampaignforapplication' href='javascript:HideCreateCampaignForApplicationRow();' class='icon-button light cancel-user'>Cancel</a></div>"+
                    "           </div>"+
                    "   </td>"+
                    "</tr>";
            }

        }


        $("#content").html($("#template-usercampaignforapplications").html().replace("{{Campaigns}}", html).replace("{{NavigationMenu}}", makinaCampaignForApplication.GetNavigationHtml()));

        makinaCampaignForApplication.BindEvent();

    }


} (window.makinaCampaignForApplication = window.makinaCampaignForApplication || {}, jQuery));