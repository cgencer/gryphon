/**
 * Created with JetBrains WebStorm.
 * User: NMD
 * Date: 20.01.2013
 * Time: 12:17
 * To change this template use File | Settings | File Templates.
 */
var _userMakilinksForCampaignRowId;




function GetListOfApplicationsForMakilinksNavigationPanelSuccessCallBack(obj) {


    makilinksForApplication.SetApplications(obj.ListAppsResult.infoList);

    if(obj.ListAppsResult.infoList.length >0 ){
        makilinksForApplication.SetActiveApplication(obj.ListAppsResult.infoList[0].appId);
        GetListOfCampaignForMakilinks(obj.ListAppsResult.infoList[0].appId)
    }

    makilinksForApplication.LoadApplicationsNavigationPanel();

}

function GetListOfApplicationsForMakilinksNavigationPanelFailedCallBack(obj) {
    if (obj.ListAppsResult !=null && obj.ListAppsResult.visibleMessage != null) {
        alert(obj.ListAppsResult.visibleMessage);
    }

    if (obj.message != null) {
        alert(obj.message);
    }

    return;
}

function GetListOfApplicationsForMakilinksNavigationPanel() {
    var b = new ListAppsRequest('', 1, 1, '', 'GetListOfApplicationsForMakilinksNavigationPanelSuccessCallBack', 'GetListOfApplicationsForMakilinksNavigationPanelFailedCallBack');
    b.send();
};



function GetListOfCampaignForMakilinksSuccessCallBack(obj){


    makilinksForApplication.SetCampaigns(obj.ListCampaignResult.infoList);
    if(obj.ListCampaignResult.infoList.length>0){

        $.when(makilinksForApplication.SetActiveCampaign(obj.ListCampaignResult.infoList[0].campId))
            .then($("#makilinksforapplications-campaign-list").html(makilinksForApplication.GetCampaignAsItem(obj.ListCampaignResult.infoList[0].campId)))
            .then(GetListOfMakilinksForCampaign(obj.ListCampaignResult.infoList[0].campId));
    }


}
function GetListOfCampaignForMakilinksFailedCallBack(obj){
    if (obj.ListCampaignResult !=null && obj.ListCampaignResult.visibleMessage != null) {
        alert(obj.ListCampaignResult.visibleMessage);
    }

    if (obj.message != null) {
        alert(obj.message);
    }

    return;
}
function GetListOfCampaignForMakilinks(appId){
    var b=new ListCampaign(appId,'',1,1,'','GetListOfCampaignForMakilinksSuccessCallBack','GetListOfCampaignForMakilinksFailedCallBack');
    b.send();
}


function GetListOfMakilinksForCampaignSuccessCallBack(obj){


    makilinksForApplication.SetMakilinks(obj.ListMakilinksResult.infoList);
    if(obj.ListMakilinksResult.infoList.length>0){
        $.when(makilinksForApplication.LoadMakilinksNavigationPanel())
            .then($("#makilinksforapplications-campaign-list").html(makilinksForApplication.GetCampaignAsItem(makilinksForApplication.GetActiveCampaign().campId)));
    }


}
function GetListOfMakilinksForCampaignFailedCallBack(obj){
    if (obj.ListMakilinksResult !=null && obj.ListMakilinksResult.visibleMessage != null) {
        alert(obj.ListMakilinksResult.visibleMessage);
    }

    if (obj.message != null) {
        alert(obj.message);
    }

    return;
}
function GetListOfMakilinksForCampaign(campaignId){
    var b=new ListMakilinks(campaignId,'',1,1,'','GetListOfMakilinksForCampaignSuccessCallBack','GetListOfMakilinksForCampaignFailedCallBack');
    b.send();
}

function ChangeSelectedCampaignForMakilinks(){

    var campId=$("#makilinksforapplications-campaign-list").val();
    if(campId != ""){
        makilinksForApplication.SetActiveCampaign(campId);
        GetListOfMakilinksForCampaign();
    }
}

function DisplayCreateMakilinksApplicationRow() {

    $("tr[id*='tr-data-makilinksforcampaign']").hide();

    _userMakilinksForCampaignRowId=null;

    var activeCampaign = makilinksForApplication.GetActiveCampaign();
    var start = makilinksForApplication.GetDateForCampaign(activeCampaign.start);
    var end = makilinksForApplication.GetDateForCampaign(activeCampaign.end);
    var marketUrl = makilinksForApplication.GetActiveApplication().marketUrl;

    console.log(marketUrl);

    $.when($("#tr-data-new-makilinksforcampaign #makilinksforcampaign-frontend").html(makilinksForApplication.GetFrontEndAsItem(null)))
        .then($("#tr-data-new-makilinksforcampaign #makilinksforcampaign-backend").html(makilinksForApplication.GetBackEndAsItem(null)))
        .then($("#tr-data-new-makilinksforcampaign #makilinksforcampaign-target").val(''))
        .then($("#tr-data-new-makilinksforcampaign #makilinksforcampaign-status").html(makilinksForApplication.GetStatusAsItem(null)));

    $("#tr-data-new-makilinksforcampaign #makilinksforcampaign-start").text(start);
    $("#tr-data-new-makilinksforcampaign #makilinksforcampaign-end").text(end);

    $("#tr-data-new-makilinksforcampaign #makilinksforcampaign-tags").html(makilinksForApplication.GetTagsHtml(null));

    $("#tr-data-new-makilinksforcampaign #makilinksforcampaign-target").val(marketUrl);


    $("#tr-data-new-makilinksforcampaign").show();
}



function HideUpdateMakilinksForCampaignRow(rowId) {

    console.log(_userMakilinksForCampaignRowId);

    if ($("#tr-" + rowId).hasClass("active")) {
        $("#tr-" + rowId).removeClass("active");
    }

    if ($("#tr-data-" + rowId).hasClass("active")) {
        $("#tr-data-" + rowId).removeClass("active");
    }
    $("#tr-data-" + rowId).hide();
    _userMakilinksForCampaignRowId = null;
}

function HideCreateMakilinksForCampaign(){
    $("#tr-data-new-makilinksforcampaign").hide();
}

function DisplayUpdateMakilinksForCampaignRow(rowId,makilinksId) {

    _userMakilinksForCampaignRowId= rowId;

    $("tr[id*='tr-data-makilinksforcampaign']").hide();
    $("#tr-data-new-makilinksforcampaign").hide();

    $("#tr-" + rowId).addClass("active");
    $("#tr-data-" + rowId).addClass("active");


    var frontEnd = $("#tr-data-" + rowId + " #makilinksforcampaign-frontend-id").val();
    var backEnd = $("#tr-data-" + rowId + " #makilinksforcampaign-backend-id").val();


    var target = $("#tr-data-" + rowId + " #makilinksforcampaign-target-id").val();

    var status = $("#tr-data-" + rowId + " #makilinksforcampaign-status-id").val();

    $.when($("#tr-data-" + rowId + " #makilinksforcampaign-frontend").html(makilinksForApplication.GetFrontEndAsItem(frontEnd)))
        .then($("#tr-data-" + rowId + " #makilinksforcampaign-backend").html(makilinksForApplication.GetBackEndAsItem(backEnd)))
        .then($("#tr-data-" + rowId + " #makilinksforcampaign-target").val(target))
        .then($("#tr-data-" + rowId + " #makilinksforcampaign-status").html(makilinksForApplication.GetStatusAsItem(status)));




  //  $("#tr-" + rowId + " .help-edit").hide();
  //  $("#tr-" + rowId + " .help-close").show();
    $("#tr-data-" + rowId).show();

    makilinksForApplication.SetActiveMakilink(makilinksId);
}


function AddUpdateMakilinksForCampaignSuccessCallBack(obj){
   // console.log(obj);
    GetListOfMakilinksForCampaign();
}

function AddUpdateMakilinksForCampaignFailedCallBack(obj){
    if (obj.AddUpdateMakilinkResult !=null && obj.AddUpdateMakilinkResult.visibleMessage != null) {
        alert(obj.AddUpdateMakilinkResult.visibleMessage);
    }

    if (obj.message != null) {
        alert(obj.message);
    }

    return;
}

function AddUpdateMakilinksForCampaign(){

    console.log("AddUpdateMakilinksForCampaign");
    var appId = makilinksForApplication.GetActiveApplication().appId;
    var campId = makilinksForApplication.GetActiveCampaign().campId;


    var frontend= "";
    var backend= "";
    var target= "";
    var status= "";

//    var userId=getCookie("userId");
	var userId=amplify.store( "sid" )
    var tags=[];
    var makilinkId=null;

    if(_userMakilinksForCampaignRowId == null){

         frontend= $("#tr-data-new-makilinksforcampaign #makilinksforcampaign-frontend").val();
         backend= $("#tr-data-new-makilinksforcampaign #makilinksforcampaign-backend").val();
         target= $("#tr-data-new-makilinksforcampaign #makilinksforcampaign-target").val();
         status= $("#tr-data-new-makilinksforcampaign #makilinksforcampaign-status").val();

        $("#tr-data-new-makilinksforcampaign #table-tags > tbody > tr").each(function(){
            var idd=""+this.id.toString();
            var key=$("#tr-data-new-makilinksforcampaign #"+idd+" .makinlinks-tags-key").val();
            var val=$("#tr-data-new-makilinksforcampaign #"+idd+" .makinlinks-tags-val").val();

            var obj={};
            obj._type="MakiTagInfo";
            obj.tagName=key;
            obj.tagValue=val;
            tags.push(obj);
        });

    }else{
        makilinkId= $("#tr-data-"+ _userMakilinksForCampaignRowId +" #makilinksforcampaign-makilink-id").val();

        frontend= $("#tr-data-"+ _userMakilinksForCampaignRowId +" #makilinksforcampaign-frontend").val();
        backend= $("#tr-data-"+ _userMakilinksForCampaignRowId +" #makilinksforcampaign-backend").val();
        target= $("#tr-data-"+ _userMakilinksForCampaignRowId +" #makilinksforcampaign-target").val();
        status= $("#tr-data-"+ _userMakilinksForCampaignRowId +" #makilinksforcampaign-status").val();

        $("#tr-data-"+ _userMakilinksForCampaignRowId +"  #table-tags > tbody > tr").each(function(){

            var idd=""+this.id.toString();
            var key=$("#tr-data-"+ _userMakilinksForCampaignRowId +" #"+idd+" .makinlinks-tags-key").val();
            var val=$("#tr-data-"+ _userMakilinksForCampaignRowId +" #"+idd+" .makinlinks-tags-val").val();

            var obj={};
            obj._type="MakiTagInfo";
            obj.tagName=key;
            obj.tagValue=val;

            tags.push(obj);
        });



    }



    var b= new AddUpdateMakilink(userId, appId, makilinkId, campId, target, backend, frontend, status, tags, 'AddUpdateMakilinksForCampaignSuccessCallBack', 'AddUpdateMakilinksForCampaignFailedCallBack');
    b.send();


}





(function (makilinksForApplication, $, undefined) {

    var _applications = null;
    var _application = null;
    var _campaigns = null;
    var _campaign = null;
    var _makilinks = null;
    var _makilink = null;

    var _status = [{"name":"Active", "value":true },{"name":"Passive", "value":false }];


    var _navigationHtml = null;

    makilinksForApplication.SetApplications = function (applications) {
        _applications = applications;
    };

    makilinksForApplication.GetApplications = function () {
        return _applications;
    };

    makilinksForApplication.SetActiveApplication = function (applicationId) {
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

    makilinksForApplication.GetActiveApplication = function () {
        return _application;
    };

    makilinksForApplication.SetCampaigns = function(listOfCampaigns){
        _campaigns = listOfCampaigns;
    }

    makilinksForApplication.GetCampaigns = function(){
        return _campaigns;
    }

    makilinksForApplication.SetActiveCampaign = function(campaignId){
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

    makilinksForApplication.GetActiveCampaign = function(){
        return _campaign;
    }

    makilinksForApplication.SetMakilinks = function(listOfMakilinks){
        _makilinks = listOfMakilinks;
    }

    makilinksForApplication.GetMakilinks = function(){
        return _makilinks;
    }

    makilinksForApplication.SetActiveMakilink = function(makilinkId){
        var retval = null;

        if(_makilinks != null){
            var lengthOfMakilinks=_makilinks.length;
            for(var i=0;i < lengthOfMakilinks; i++){
                if(_makilinks[i].makilinkId == makilinkId){
                    retval = _makilinks[i];
                    break;
                }
            }
        }
        _makilink = retval;
    }

    makilinksForApplication.GetActiveMakilink = function(){
        return _makilink;
    }

    makilinksForApplication.GetStatusAsItem = function(selectedValue){
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

    makilinksForApplication.GetCampaignAsItem = function(selectedValue){
        var retval = "";

        var campaigns= _campaigns;

        if (status != null) {
            var lengthOfCampaigns = campaigns.length;
            for (var i = 0; i < lengthOfCampaigns; i++) {
                var selectedText = "";
                if (selectedValue == campaigns[i].campId) {
                    selectedText = "selected='True'";
                }
                retval = retval + "<option value='" + campaigns[i].campId + "' " + selectedText + " >" + campaigns[i].name + "</option>";
            }
        }
        return retval;
    }

    makilinksForApplication.SetNavigationHtml = function (navHtml) {
        _navigationHtml = navHtml;
    };

    makilinksForApplication.GetNavigationHtml = function () {
        return (_navigationHtml == null) ? "" : _navigationHtml;
    };

    makilinksForApplication.LoadApplicationsNavigationPanel = function () {
        var navHtml = "";
        var applications = makilinksForApplication.GetApplications();

        console.log("makilinksForApplication.LoadApplicationsNavigationPanel");

        for (var i = 0; i < applications.length; i++) {
            var appId = applications[i].appId;
            var appname = applications[i].appname;

            navHtml = navHtml + "<div class='app-container' list-item-id='"+appId+"'  onclick='$.when(makilinksForApplication.SetActiveApplication(\"" + appId + "\")).then(GetListOfCampaignForMakilinks(\"" + appId + "\"));'><div class='name'>" + appname + "</div></div>";
        }

        makilinksForApplication.SetNavigationHtml(navHtml);

        $("#content").html($("#template-makilinksforapplications").html().replace("{{Makilinks}}", "").replace("{{NavigationMenu}}", makilinksForApplication.GetNavigationHtml()));
    };

    makilinksForApplication.AddActiveClassItemForList = function(idd){

        $("#slimScrollDiv #items .app-container").removeClass("active");
        $(".app-container").each(function(){
            var appId=$(this).attr("list-item-id");
            if(appId == idd)$(this).addClass("active");
        });
    }

    makilinksForApplication.BindEvent = function(){

        if(this.GetActiveApplication() != null)
            this.AddActiveClassItemForList(this.GetActiveApplication().appId);

        var h=$(window).height();
        $("#slimScrollDiv").slimScroll({
            height: h+'px'
        });
    }

    makilinksForApplication.GetDateForCampaign = function (mDate){


        var date= mDate.date;
        var newDate = $.datepicker.parseDate("ddmmyy",date);
        var newFormat = $.datepicker.formatDate(_dateFormat, newDate);

        return newFormat;
    }
    makilinksForApplication.ConvertDateForCampaign = function(stringDate){

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
    makilinksForApplication.GetFrontEndAsItem = function(selectedValue){

        var _enum =  GetItemFromEnumObject("MakilinkFrontEnd");
        var retval = "";
        if (_enum != null) {
            $.each(_enum,function(key,value){
                var selectedText = "";
                if (selectedValue == value) {
                    selectedText = "selected='True'";
                }
                retval = retval + "<option value='" + value + "' " + selectedText + " >" + key + "</option>";
            });
        }
        return retval;
    }

    makilinksForApplication.GetBackEndAsItem = function(selectedValue){
        var _enum =  GetItemFromEnumObject("MakilinkBackEnd");
        var retval = "";
        if (_enum != null) {
            $.each(_enum,function(key,value){
                var selectedText = "";
                if (selectedValue == value) {
                    selectedText = "selected='True'";
                }
                retval = retval + "<option value='" + value + "' " + selectedText + " >" + key + "</option>";
            });
        }
        return retval;
    }

    makilinksForApplication.GetTagsHtml = function(tags){

        var html="";
        html+="<table border='0' id='table-tags'>" +
            "<thead>" +
            "   <tr>" +
            "       <th>Name</th>" +
            "       <th>Value</th>" +
            "   </tr>" +
            "</thead>" +
            "<tbody>";

    //    var tags= makilinksForApplication.GetActiveMakilink().tags;
        var lengthOfTags=0;
        if(tags !=null)
            lengthOfTags=tags.length;

        if(lengthOfTags>0){
            $.each(tags,function(i,item){
                var j=i+1;
                var rowId="table-tags-tr-"+ j.toString();
                html+="<tr class='cls-table-tags-tr' id='"+rowId+"'>" +
                        "<td><input class='makinlinks-tags-key' name='tags-key' type='text' value='"+item.tagName+"' /></td>" +
                        "<td><input class='makinlinks-tags-val' name='tags-val' type='text' value='"+item.tagValue+"' /></td>" +
                        "<td><a class='icon-button light' href='javascript:makilinksForApplication.RemoveTableTagsRow(\""+rowId+"\");'>Remove Tags</a></td>" +
                    "</tr>";
            });
        }else{
            var rowId="table-tags-tr-1";

            html+="<tr class='cls-table-tags-tr' id='"+rowId+"'>" +
                "<td><input class='makinlinks-tags-key' name='tags-key' id='tags-key' type='text' /></td>" +
                "<td><input class='makinlinks-tags-val' name='tags-val' id='tags-val' type='text'  /></td>" +
                "<td><a class='icon-button light' href='javascript:makilinksForApplication.RemoveTableTagsRow(\""+rowId+"\");'>Remove Tags</a></td>" +
                "</tr>";
        }

        html+="</tbody>" +
            "<tfoot>" +
                "<tr>" +
                "<td colspan='2'>" +
            "     <a class='icon-button light create-user' id='create-makilinksforcampaign-tags' href='javascript:makilinksForApplication.AddNewTagsActiveRow();'>Add New Tags</a>" +
            "    </td>" +
            "</tr>" +
            "</tfoot>"+
            "</table>" ;
        return html;

    }

    makilinksForApplication.AddNewTagsActiveRow = function(){


        var idd=0;
        var activeRowId = "tr-data-new-makilinksforcampaign";

        if(_userMakilinksForCampaignRowId != null)
            activeRowId = "tr-data-" + _userMakilinksForCampaignRowId;

        if($("#" + activeRowId + " #table-tags tbody tr").size()>0){
            idd=parseInt($("#" + activeRowId + " #table-tags >tbody tr:last").attr("id").toString().replace("table-tags-tr-",""),10);
            idd++;
        }


        var rowId="table-tags-tr-"+ idd.toString();

        var html="<tr id='"+rowId+"'>" +
            "<td><input class='makinlinks-tags-key' name='tags-key' type='text' /></td>" +
            "<td><input class='makinlinks-tags-val' name='tags-val' type='text' /></td>" +
            "<td><a class='icon-button light' href='javascript:makilinksForApplication.RemoveTableTagsRow(\""+rowId+"\");'>Remove Tags</a></td>" +
            "</tr>";
        $("#" + activeRowId + " #table-tags >tbody").append(html);

    }
    makilinksForApplication.RemoveTableTagsRow = function(rowId){
        var activeRowId = "tr-data-new-makilinksforcampaign";

        if(_userMakilinksForCampaignRowId != null)
            activeRowId = "tr-data-" + _userMakilinksForCampaignRowId;

        $("#" + activeRowId +" #"+rowId).remove();

    }


    makilinksForApplication.LoadMakilinksNavigationPanel = function(){


        var html="";
        console.log("makilinksForApplication.LoadMakilinksNavigationPanel");

        var makilinks = makilinksForApplication.GetMakilinks();
        var activeCampaign = makilinksForApplication.GetActiveCampaign();

        if(makilinks != null ){

            var lengthOfMakilinks= makilinks.length;
            for(var i=0; i < lengthOfMakilinks; i++){

                var rowId = "makilinksforcampaign-" + i.toString();

                var makiLink = makilinks[i].makiLink;
                var makilinkId = makilinks[i].makilinkId;
                var frontEndValue =  makilinks[i].makilinkFrontEnd;
                var backEndValue =  makilinks[i].makilinkBackEnd;

                var frontEnd = GetItemFromEnumObject("MakilinkFrontEnd",frontEndValue).name;
                var backEnd = GetItemFromEnumObject("MakilinkBackEnd",backEndValue).name;
                var target = makilinks[i].backEndUrl;
                var start = makilinksForApplication.GetDateForCampaign(activeCampaign.start);
                var end = makilinksForApplication.GetDateForCampaign(activeCampaign.end);
                var status = makilinks[i].status;

                var tags= makilinks[i].tags;



                for(var j=0;j<_status.length; j++){
                    if(_status[j].value == status){
                        statusName = _status[j].name;
                        break;
                    }
                }

                html +=  "<tr  id='tr-" + rowId + "' style='opacity: 1;'>" +
                    "	<td class='makilink-name'>" + makiLink + "</td>" +
                    "	<td class='makilink-link-id'>" + makilinkId + "</td>" +
                    "	<td class='makilink-front-end'>" + frontEnd + "</td>" +
                    "	<td class='makilink-back-end'>" + backEnd + "</td>" +
                    "   <td class='makilink-target'>" + target + "</td>"+
                    "   <td class='makilink-start'>" + start + "</td>"+
                    "   <td class='makilink-end'>" + end + "</td>"+
                    "   <td class='makilink-status'>" + statusName + "</td>"+
                    "	<td  style='width:90px;'>" +
                    "		<div>" +
                    "			<span class='campaign-name' >" +
                    "			<div class='help-edit'><a id='campaign-edit-link' href='javascript:DisplayUpdateMakilinksForCampaignRow(\"" + rowId + "\");'>Click to edit</a></div>" +
                    "			<div class='help-close'><a id='campaign-close-link' href='javascript:HideUpdateMakilinksForCampaignRow(\"" + rowId + "\");'>Click to close</a></div>" +
                    "		</div>" +
                    "	</td>" +
                    "</tr>"+
                    "<tr id='tr-data-" + rowId + "' style='display: none;' class='user-details'>" +
                    "	<td colspan='8'>"+
                    "       <div>"+
                    "           <div class='row'>"+
                    "               <div class='title'>FrontEnd</div><div class='detail'><select  id='makilinksforcampaign-frontend'></select>" +
                    "               <input type='hidden' id='makilinksforcampaign-makilink-id' value='"+makilinkId+"'  />    " +
                    "               <input type='hidden' id='makilinksforcampaign-frontend-id' value='"+frontEndValue+"'  /></div>"+
                    "           </div>"+
                    "           <div class='row'>"+
                    "               <div class='title'>BackEnd</div><div class='detail'><select id='makilinksforcampaign-backend'></select>" +
                    "               <input type='hidden' id='makilinksforcampaign-backend-id' value='"+backEndValue+"'  /></div>"+
                    "           </div>"+
                    "           <div class='row'>"+
                    "               <div class='title'>BackEnd Target</div><div class='detail'><input type='text' id='makilinksforcampaign-target' /> " +
                    "               <input type='hidden' id='makilinksforcampaign-target-id' value='"+target+"'  /></div>"+
                    "           </div>"+
                    "           <div class='row'>"+
                    "               <div class='title'>Start</div><div class='detail'>" + start+ "</div>"+
                    "           </div>"+
                    "           <div class='row'>"+
                    "               <div class='title'>End</div><div class='detail'>" + end+ "</div>"+
                    "           </div>"+
                    "           <div class='row'>"+
                    "               <div class='title'>Status</div><div class='detail'><select id='makilinksforcampaign-status'></select>" +
                    "               <input type='hidden' id='makilinksforcampaign-status-id' value='"+status+"'  /></div>"+
                    "           </div>"+
                    "           <div class='row'>"+
                    "              <div class='title'>Tags</div><div class='detail'> "+ makilinksForApplication.GetTagsHtml(tags)+"</div>"+
                    "           </div>"+
                    "           <div class='row'>"+
                    "               <div class='title'>Link Id</div><div class='detail'>"+makiLink+"</div>"+
                    "           </div>"+
                    "           <div class='row'>"+
                    "               <div class='title'>Makilink</div><div class='detail'>"+makilinkId+"</div>"+
                    "           </div>"+
                    "           <div class='button-container'>" +
                    "               <a class='icon-button light create-user' id='create-makilinksforcampaign' href='javascript:AddUpdateMakilinksForCampaign();'>Update</a>"+
                    "               <a id='cancel-create-makilinksforcampaign' href='javascript:HideUpdateMakilinksForCampaignRow(\"" + rowId + "\");' class='icon-button light cancel-user'>Cancel</a></div>"+
                    "           </div>"+
                    "   </td>"+
                    "</tr>";
            }

        }


        $("#content").html($("#template-makilinksforapplications").html().replace("{{Makilinks}}", html).replace("{{NavigationMenu}}", makilinksForApplication.GetNavigationHtml()));

        makilinksForApplication.BindEvent();

    }


} (window.makilinksForApplication = window.makilinksForApplication || {}, jQuery));