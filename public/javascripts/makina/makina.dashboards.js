/**
 * Created with JetBrains WebStorm.
 * User: NMD
 * Date: 20.01.2013
 * Time: 21:27
 * To change this template use File | Settings | File Templates.
 */




function GetDashBoardsListSuccessCallBack(obj){

    $.when(makinaDashboards.SetDashboards(obj.ListDashboardsResult.infoList))
        .then(makinaDashboards.LoadDashboards());

}

function GetDashBoardsListFailedCallBack(obj){
    if (obj.ListDashboardsResult !=null && obj.ListDashboardsResult.visibleMessage != null) {
        alert(obj.ListDashboardsResult.visibleMessage);
    }

    if (obj.message != null) {
        alert(obj.message);
    }

    return;
}

function GetDashBoardsList(){
    var b= new ListDashboards('GetDashBoardsListSuccessCallBack', 'GetDashBoardsListFailedCallBack');
    b.send();
}


function MakinaDashboardsGoSelectedUser(row){

    console.log(makinaDashboards.GetUserInfo(row));
}



(function (makinaDashboards, $, undefined) {

    var _dashboards=null;

    makinaDashboards.SetDashboards = function(dashboardsList){
        _dashboards = dashboardsList;
    }
    makinaDashboards.GetDashboards = function(){
        return _dashboards;
    }
    makinaDashboards.GetUserInfo = function(idx){

        return _dashboards[idx];
    }

    makinaDashboards.GetUserLoginInfoWithBas64 = function(name,password){

        var data = "user="+name+"&password="+password;
        return $.base64.encode(data);
    }
    makinaDashboards.MakinaDashboardsGoSelectedUser = function(host,go){

        document.location.href = host+"?go="+go;

    }

    makinaDashboards.LoadDashboards = function(){

        var html="";
        var dashboards=makinaDashboards.GetDashboards();

        if(dashboards != null ){

            var lengthOfDashboards= dashboards.length;


            for(var i=0; i < lengthOfDashboards; i++){

                var rowId = "makinadashboards-" + i.toString();
                var url = dashboards[i].hostUrl;
                var userName = dashboards[i].username;
                var password = dashboards[i].password;
                var hostUrl = dashboards[i].hostUrl;

                var go = makinaDashboards.GetUserLoginInfoWithBas64(userName, password);

                html +=  "<tr  id='tr-" + rowId + "' style='opacity: 1;'>" +
                    "	<td class='campaign-name'>" + url + "</td>" +
                    "	<td class='campaign-channel'>" + userName + "</td>" +
                    "	<td class='campaign-type'>" +
                    "       <a class='icon-button light' onclick='makinaDashboards.MakinaDashboardsGoSelectedUser(\""+hostUrl+"/login\" , \""+go+"\");' >Go</a>" +
                    "    </td>" +
                    "</tr>";
            }
        }

        $("#content").html($("#template-dashboard").html().replace("{{Dashboards}}", html));

    }


} (window.makinaDashboards = window.makinaDashboards || {}, jQuery));