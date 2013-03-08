/**
 * Created with JetBrains WebStorm.
 * User: NMD
 * Date: 20.01.2013
 * Time: 21:56
 * To change this template use File | Settings | File Templates.
 */


function GetWelcomeGetSystemInfoSuccessCallBack(obj){

console.log("ALALALALA....\n"+JSON.stringify(obj, void 0, "\t"));
    $.when(makinaWelcome.SetSystemInfoList(obj.GetSystemInfoResult.infoList))
        .then(makinaWelcome.SetSystemInfo(obj.GetSystemInfoResult.infoList[0]))
        .then(makinaWelcome.LoadWelcomePage());

}

function GetWelcomeGetSystemInfoFailedCallBack(obj){
    if (obj.GetSystemInfoResult !=null && obj.GetSystemInfoResult.visibleMessage != null) {
        alert(obj.GetSystemInfoResult.visibleMessage);
    }

    if (obj.message != null) {
        alert(obj.message);
    }

    return;
}

function GetWelcomeGetSystemInfo(){
    var b= new GetSystemInfo('GetWelcomeGetSystemInfoSuccessCallBack', 'GetWelcomeGetSystemInfoFailedCallBack');
    b.send();
}






(function (makinaWelcome, $, undefined) {

    var _systemInfoList = null;
    var _systemInfo = null;


    makinaWelcome.SetSystemInfoList = function(systemInfoList){
        _systemInfoList = systemInfoList;
    }
    makinaWelcome.GetSystemInfoList = function(){
        return _systemInfoList;
    }

    makinaWelcome.SetSystemInfo = function(systemInfo){
        _systemInfo = systemInfo;
    }
    makinaWelcome.GetSystemInfo = function(){
        return _systemInfo;
    }
    makinaWelcome.GetGraphicsOptions = function(){

        var options={
            xaxis: {
                min: (new Date(2012, 1, 1)).getTime(),
                max: (new Date(2012, 12, 30)).getTime(),
                mode: "time",
                tickSize: [1, "month"],
                monthNames: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
                tickLength: 0,
                axisLabel: 'Month',
                axisLabelUseCanvas: true,
                axisLabelFontSizePixels: 12,
                axisLabelFontFamily: 'Verdana, Arial, Helvetica, Tahoma, sans-serif',
                axisLabelPadding: 5
            },
            yaxis: {
                axisLabelUseCanvas: true,
                axisLabelFontSizePixels: 12,
                axisLabelFontFamily: 'Verdana, Arial, Helvetica, Tahoma, sans-serif',
                axisLabelPadding: 5
            },
            series:{
                lines:{ stack:false, show:true, fill:true, lineWidth:2, fillColor:{ colors:[
                    { opacity:0 },
                    { opacity:0.15 }
                ] }, shadowSize:0 },
                points:{ show:true, radius:4, shadowSize:0 },
                shadowSize:0
            },
            grid: {
                hoverable: true,
                borderColor:"null", color:"#999", borderWidth:0, minBorderMargin:10
            },
            legend: {
                labelBoxBorderColor: "none",
                position: "right",
                show:false
            }
        };

        return options;
    }

    makinaWelcome.GetDateObject = function(MDate){

        return $.datepicker.parseDate("ddmmyy",MDate.date);

    }


    makinaWelcome.GraphicsShowTooltip = function(x, y, contents, z) {
        $('<div id="graph-tooltip">' + contents + '</div>').css({
            top: y - 30,
            left: x - 80,
            'border-color': z
        }).appendTo("body").fadeIn(200);
    }

    makinaWelcome.GraphicsGetMonthName =function (numericMonth) {
        var monthArray = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        var alphaMonth = monthArray[numericMonth];
        return alphaMonth;
    }

    makinaWelcome.GraphicsConvertToDate = function(timestamp) {
        var newDate = new Date(timestamp);
        var dateString = newDate.getMonth();
        var monthName = makinaWelcome.GraphicsGetMonthName(dateString);

        return monthName;
    }





    makinaWelcome.DrawGraphics = function(){

        var options = makinaWelcome.GetGraphicsOptions();

        var systemInfoList = makinaWelcome.GetSystemInfoList();

        var lenghtOfData = systemInfoList.length;

        var json_line_1=[];
        var json_line_2=[];

        var PlotData={};


        for(var i=0;i< lenghtOfData; i++){

            var obj=systemInfoList[i];
            var date = makinaWelcome.GetDateObject(obj.infoDay);


            var day=date.getDate();
            var month=date.getMonth();
            var year=date.getFullYear();


            var click = obj.avgClickPerCampaign;
            var install = obj.avgInstallPerCampaign;

            if(PlotData[year] == undefined){
                PlotData[year]={};
            }
            if(PlotData[year][month] == undefined){
                PlotData[year][month]={};
            }
            if(PlotData[year][month][day] == undefined){
                PlotData[year][month][day]={};
            }

            PlotData[year][month][day]["click"]=click;
            PlotData[year][month][day]["install"]=install;


        }


        var year=2013;

        var minYear=null;
        var maxYear=null;
        var minMonth=null;
        var maxMonth=null;
        var minDay=null;
        var maxDay=null;

        $.each(PlotData,function(year,months){

            if(minYear== null || minYear>year)minYear=year;
            if(maxYear== null || maxYear<year)maxYear=year;

            $.each(months,function(month,days){

                if(minMonth== null || minMonth>month)minMonth=month;
                if(maxMonth== null || maxMonth<month)maxMonth=month;

             for(var i=1;i<=31;i++){
                    var day = i;

                    if(days[i] != undefined){
                        var pnt1=[(new Date(year,month,day)).getTime(),(days[i].click)];
                        var pnt2=[(new Date(year,month,day)).getTime(),days[i].install];
                        json_line_1.push(pnt1);
                        json_line_2.push(pnt2);
                        if(minDay== null || minDay>day)minDay=day;
                        if(maxDay== null || maxDay<day)maxDay=day;
                    }else{
                        var pnt1=[(new Date(year,month,day)).getTime(), 0];
                        var pnt2=[(new Date(year,month,day)).getTime(), 0];
                        json_line_1.push(pnt1);
                        json_line_2.push(pnt2);
                    }
                }

            });

        });



        var data1 = [
            {label: "click",    data: json_line_1/*,  color: '#FF9D00'*/},
            {label: "install",  data: json_line_2/*,  color: '#AA4643'*/}
            /*{label: "Madrid, Spain",  data: d3, points: { symbol: "square", fillColor: "#50B432" }, color: '#50B432'},
             {label: "London, UK",  data: d4, points: { symbol: "triangle", fillColor: "#ED561B" }, color: '#ED561B'}*/
        ];

        options.xaxis= {
            min: (new Date(minYear, minMonth, minDay)).getTime(),
            max: (new Date(maxYear, maxMonth, maxDay)).getTime(),
            mode: "time",
            tickSize: [1, "day"],
            tickLength: 0,
            axisLabel: 'Day',
            axisLabelUseCanvas: true,
            axisLabelFontSizePixels: 15,
            axisLabelFontFamily: 'Verdana, Arial, Helvetica, Tahoma, sans-serif',
            axisLabelPadding: 5
        };

        $("#right-top-date-average").html(minDay+"-"+(minMonth+1)+"-"+minYear+" / "+maxDay+"-"+(maxMonth+1)+"-"+maxYear );
        $.plot($("#graphics-system-info-install-click"), data1, options );



        $("#graphics-system-info-install-click").bind("plothover", function (event, pos, item) {
            if (item) {
                if ((previousPoint != item.dataIndex) || (previousLabel != item.series.label)) {
                    previousPoint = item.dataIndex;
                    previousLabel = item.series.label;

                    $("#graph-tooltip").remove();

                    var x = makinaWelcome.GraphicsConvertToDate(item.datapoint[0]),
                        y = item.datapoint[1];
                    z = item.series.color;

                    makinaWelcome.GraphicsShowTooltip(item.pageX, item.pageY,
                        "<b>" + item.series.label + "</b> = " + y ,
                        z);
                }
            } else {
                $("#graph-tooltip").remove();
                previousPoint = null;
            }
        });



    }


    makinaWelcome.LoadWelcomePage = function(){
        var html="";
        var systemInfo=makinaWelcome.GetSystemInfo();


        if(systemInfo != null ){

            var orgCount= systemInfo.orgCount;
            var campCount= systemInfo.campCount;
            var userCount= systemInfo.userCount;
            var appCount= systemInfo.appCount;
            var avgInstallPerCampaign= systemInfo.avgInstallPerCampaign;
            var avgClickPerCampaign= systemInfo.avgClickPerCampaign;

            try{
                avgInstallPerCampaign = avgInstallPerCampaign / 10;
                avgClickPerCampaign = avgClickPerCampaign / 10;
            }catch(e){
                console.log(e);
            }

            var newDate = $.datepicker.parseDate("ddmmyy",systemInfo.infoDay.date);
            var today = $.datepicker.formatDate("dd-mm-yy", newDate);

            html+="<div><table style='width: 100%;' border='0' cellpadding='1' cellspacing='1' align='center' >" +
                "<tr><td>" +
                "<div class='widget-header'><div class='title'>"+today+"</div></div>"+
                      "<div class='widget-content'>" +
                        "<table border='0' cellpadding='1' cellspacing='1' align='center' >" +
                            "<tr>" +
                            "   <td><img class='img-welcome-total' src='../../Images/dashboard/total_organization.png' /></td>" +
                            "   <td><img class='img-welcome-total' src='../../Images/dashboard/total_company.png' /></td>" +
                            "   <td><img class='img-welcome-total' src='../../Images/dashboard/total_users.png' /></td>" +
                            "   <td><img class='img-welcome-total' src='../../Images/dashboard/total_app.png' /></td>" +
                            "</tr>" +
                            "<tr align='center' style='height: 50px;'>" +
                            "   <td><div class='dashboard-summary' >" +
                            "            <div class='item' style='width: 100%;' >" +
                            "               <div class='inner'>" +
                            "                   <div class='title'>Total Organizations</div>" +
                            "                   <div class='detail welcome-text-title'> "+orgCount+"</div>" +
                            "               </div>" +
                            "            </div>" +
                            "      </div>" +
                            "    </td>" +
                            "   <td><div class='dashboard-summary' >" +
                            "            <div class='item' style='width: 100%;' >" +
                            "               <div class='inner'>" +
                            "                   <div class='title'>Total Campaigns</div>" +
                            "                   <div class='detail welcome-text-title'> "+campCount+"</div>" +
                            "               </div>" +
                            "            </div>" +
                            "      </div>" +
                            "    </td>" +
                            "   <td><div class='dashboard-summary' >" +
                            "            <div class='item' style='width: 100%;' >" +
                            "               <div class='inner'>" +
                            "                   <div class='title'>Total Users</div>" +
                            "                   <div class='detail welcome-text-title'> "+userCount+"</div>" +
                            "               </div>" +
                            "            </div>" +
                            "      </div>" +
                            "    </td>" +
                            "   <td><div class='dashboard-summary' >" +
                            "            <div class='item' style='width: 100%;' >" +
                            "               <div class='inner'>" +
                            "                   <div class='title'>Total Applications</div>" +
                            "                   <div class='detail welcome-text-title'> "+appCount+"</div>" +
                            "               </div>" +
                            "            </div>" +
                            "      </div>" +
                            "    </td>" +
                            "</tr>" +
                        "</table>" +
                "</div>" +
                "</td><td>";

            html+="<div class='widget-header'><div  class='title' id='right-top-date-average'></div> </div>"+
                        "<div class='widget-content'>" +
                            "<table border='0' cellpadding='1' cellspacing='1' align='center' >" +
                            "<tr>" +
                            "   <td><img class='img-welcome-total' src='../../Images/dashboard/average_click.png' /></td>" +
                            "   <td><img class='img-welcome-total' src='../../Images/dashboard/average_install.png' /></td>" +
                            "</tr>" +
                            "<tr align='center' style='height: 50px;'>" +
                            "   <td><div class='dashboard-summary' >" +
                            "            <div class='item' style='width: 100%;' >" +
                            "               <div class='inner'>" +
                            "                   <div class='title'>Average Click</div>" +
                            "                   <div class='detail welcome-text-title'> "+avgClickPerCampaign+"</div>" +
                            "               </div>" +
                            "            </div>" +
                            "      </div>" +
                            "    </td>" +
                            "   <td><div class='dashboard-summary' >" +
                            "            <div class='item' style='width: 100%;' >" +
                            "               <div class='inner'>" +
                            "                   <div class='title'>Average Install</div>" +
                            "                   <div class='detail welcome-text-title'> "+avgInstallPerCampaign+"</div>" +
                            "               </div>" +
                            "            </div>" +
                            "      </div>" +
                            "    </td>" +
                            "</tr>" +
                            "</table>" +
                 "</div>" +
                "</td></tr></table>" +
                "</div>";

        }

        $("#content").html($("#template-welcome").html().replace("{{Welcome}}", html));
        makinaWelcome.DrawGraphics();

    }


} (window.makinaWelcome = window.makinaWelcome || {}, jQuery));