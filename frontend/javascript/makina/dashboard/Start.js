/**
 * Created with IntelliJ IDEA.
 * User: NMD
 * Date: 30.01.2013
 * Time: 13:52
 * To change this template use File | Settings | File Templates.
 */

goog.provide('makina.dashboard.Start');

goog.require('goog.object');
goog.require('goog.dom.query') ;
goog.require('goog.json');
goog.require('goog.crypt.base64');
goog.require('goog.ui.TableSorter');



/**
 *
 * @constructor
 */
makina.dashboard.Start = function(){

    this.appListContainerId = "ul-id-app-list"


    this.BindEvents();



}
/**
 *
 * @param data
 *
 */

makina.dashboard.Start.prototype.RenderDataset = function(data){
/*

    for(var i in data){

        var item =data[i];

        goog.object.forEach(item,function(v,k,o){
           if(goog.string.startsWith(k,"timeslot"))
                data[i][k]= goog.json.parse(Base64.decode(data[i][k]));
        });

    }
    var mData=[];

    mData[0] =data[0];
    mData[1] =data[1];

    data = mData;



    var ds=new makina.Dataset(data);

    var tmpData = data;



    goog.dom.getElement('data-grid-1').innerHTML = ds.GetDataTable(tmpData,"table-1");

    var component = new goog.ui.TableSorter();
    component.decorate(goog.dom.getElement('table-1'));
    var j=0;
    goog.object.forEach(tmpData[0],function(v,k,o){
        component.setSortFunction(j++, goog.ui.TableSorter.alphaSort);
    });

*/


/*

    console.log("ds.GroupBys(['Application','Platform'],['click','install']");
    //var obj= ds.GroupBys(["Application","Platform"],['timeslotCLICK','timeslotINSTALL']);

    var obj = ds.Sum('timeslotCLICK');



    console.log(obj);*/

   /// goog.dom.getElement('data-grid-2').innerHTML = ds.GetDataTable(obj["response"],"table-2");



};



makina.dashboard.Start.prototype.SumTS = function(dataArrayBase64){

/*
    var TS={};

    console.log("Date="+Date.now());

    var tsArrayData=[];

    var sTime=Date.now();

    goog.array.forEach(dataArrayBase64,function(item){

        console.log(item);
       var json=goog.json.parse(Base64.decode(item.data));
        tsArrayData.push(json);
    });




   goog.array.forEach(tsArrayData,function(item,i){

       console.log(item);

        goog.object.forEach(item,function(v,yk,o){


            if(goog.object.containsKey(TS,yk)){
                TS[yk]["c"]+= v.c;
            }else{
                var c={c:v.c};
                goog.object.set(TS,yk, c);
            }

            goog.object.forEach(v,function(mts,mk,mo){
                if(mk!="c"){
                    if(goog.object.containsKey(TS[yk],mk) ){
                        TS[yk][mk]["c"]+=mts.c;
                    }else{
                        var cm={c:mts.c};
                        goog.object.set(TS[yk], mk, cm);
                    }
                }

                goog.object.forEach(mts,function(dts,dk,dObj){
                    if(dk!="c"){
                        if(goog.object.containsKey(TS[yk][mk],dk) ){
                            TS[yk][mk][dk]["c"]+=dts.c;
                        }else{
                            var cm={c:dts.c};
                            goog.object.set(TS[yk][mk], dk, cm);
                        }
                    }

                    goog.object.forEach(dts,function(hts,hk,hObj){
                        if(hk!="c"){
                            if(goog.object.containsKey(TS[yk][mk][dk],hk) ){
                                TS[yk][mk][dk][hk]["c"]+=dts.c;
                            }else{
                                var cm={c:dts.c};
                                goog.object.set(TS[yk][mk][dk], hk, cm);
                            }
                        }
                    });




                });


            });


        });
   });
    var totalMs =Date.now() -sTime;

    console.log("totalMs="+totalMs);
    console.log("end of loop");

    console.log(TS);
*/

/*
        goog.array.forEach(tsArrayData,function(itemTS){

        });
*/


}




makina.dashboard.Start.prototype.GetServiceDisco = function(){

    var that = this;

   makina.util.ajaxRequest('http://localhost/makina/servicedisco.json','GET',
       {},
       function(data){
           console.log(data);
           that.GenerateJSCode(data);
       }
   )
}

makina.dashboard.Start.prototype.GenerateJSCode= function(data){

    this.servicedisco = data;

    var that = this;

    goog.array.forEach(this.servicedisco["objects"],function(item,i){

        console.log(item);

        if(item["_type"] == "MObjectDef"){
            that.GenerateModelClass(item);
        }


    });
}


makina.dashboard.Start.prototype.GenerateModelClass = function(item){


    var cls = 'var '+item["name"]+''



}



makina.dashboard.Start.prototype.BindEvents = function(){

    var that = this;
    this.widget = {};

/*


     goog.events.listen(goog.dom.getElement('create-new-app'),goog.events.EventType.CLICK,function(){
       that.SaveWidgetForm();
    });




    goog.events.listen(goog.dom.getElement('widget-1'),goog.events.EventType.CLICK,function(){
        that.DrawWidget(1);
    });
    goog.events.listen(goog.dom.getElement('widget-2'),goog.events.EventType.CLICK,function(){
        that.DrawWidget(2);
    });

    goog.events.listen(goog.dom.getElement('widget-3'),goog.events.EventType.CLICK,function(){
        that.DrawWidget(3);
    });

    goog.events.listen(goog.dom.getElement('widget-4'),goog.events.EventType.CLICK,function(){
        that.DrawWidget(4);
    });

    goog.events.listen(goog.dom.getElement('widget-5'),goog.events.EventType.CLICK,function(){
        that.DrawWidget(5);
    });

    goog.events.listen(goog.dom.getElement('widget-6'),goog.events.EventType.CLICK,function(){
        that.DrawWidget(6);
    });
    goog.events.listen(goog.dom.getElement('widget-7'),goog.events.EventType.CLICK,function(){
        that.DrawWidget(7);
    });
*/



}




makina.dashboard.Start.prototype.SaveWidgetForm = function(){

    var obj={};

    var id = "";
    var applicationName = "";
    var marketUrl = "";
    var googleAnalyticsKey = "";
    var platform = "";
    var description = "";
    var registerActionId = "";


    applicationName = goog.dom.getElement("application-name").value;
    marketUrl = goog.dom.getElement("application-market-url").value;
    googleAnalyticsKey = goog.dom.getElement("application-analytics-key").value;
    description = goog.dom.getElement("application-description").value;
    platform = goog.dom.getElement("application-platform").value;
    registerActionId = goog.dom.getElement("application-default-register-action").value;


    obj._type = 'AddUpdateAppRequest';
    obj.callTag="";
    obj.callbackTag="";
    obj.registerId="";
    obj.session=makina._app.user["session"];
    obj.verb="";
    obj.command =  1;
    obj.countlyHostId="mkui2.nmdapps.com";//added by nomad
    obj.orgId="0.000022@ORG";
    obj.info = {
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
        "googleAnalyticsKey": googleAnalyticsKey,
        "platform": platform,
        "registerActionId": registerActionId
    };

   var x= {
       "_type":"AddUpdateAppRequest",
       "callTag":"",
       "callbackTag":"",
       "registerId":"",
       "session":"",
       "verb":"",
       "command":0,
       "countlyHostId":"",
       "info":{
           "_type":"AppInfo",
           "appId":"",
           "appToken":"",
           "appType":0,
           "appname":"",
           "countlyApiKey":"",
           "countlyAppId":"",
           "countlyAppKey":"",
           "countlyUrl":"",
           "description":"",
           "googleAnalyticsKey":"",
           "iconUrl":"",
           "marketUrl":"","platform":0,"registerActionId":""},"orgId":""}

    console.log(obj);

    makina.util.jsonpRequest(obj,
        function(data){
            console.log(data);

        },
        function(data){
            console.log(data);
        }
    );


}


makina.dashboard.Start.prototype.DrawWidget = function(type){

    console.log("makina.dashboard.Start.prototype.DrawWidget");


    this.widgetContainer = "content-widget";

/*

    var options = {
        width: 600,
        height: 300,
        legend: 'none',
        pointSize: 5,
        chartArea:{"left":"2","right":"5%","top":"2%","bottom":"3%","width":"94%","height":"94%"},
        backgroundColor:{stroke:'#FFCCCC'},
        vAxis: {textPosition: 'in'}
    };

    if(type == 1){
        this.cart =new makina.Widget(makina.Widget.Type.LINE, this.widgetContainer, options);
    }else if(type == 2){
        this.cart = new makina.Widget(makina.Widget.Type.AREA, this.widgetContainer, options );
    }else if(type == 3){

        this.cart = new makina.Widget(makina.Widget.Type.BAR, this.widgetContainer, options);
    }else if(type == 4){
        this.cart = new makina.Widget(makina.Widget.Type.PIE, this.widgetContainer, options);
    }else if(type == 5){
        options["is3D"]=true;
        this.cart = new makina.Widget(makina.Widget.Type.PIE, this.widgetContainer, options);
    }else if(type == 6){
        this.cart = new makina.Widget(makina.Widget.Type.TABLE, this.widgetContainer, options);
    }else if(type == 7){
        this.cart = new makina.Widget(makina.Widget.Type.GEO  , this.widgetContainer, options);
    }
*/



}


makina.dashboard.Start.prototype.UserLogin = function(){

    var json = {
        "callTag":"",
        "registerId":"",
        "verb":"",
        "session":"3a6c56c3-88f3-4590-b6a7-273c5174e852",
        "callbackTag":"",
        "userName":"demo",
        "pass":"demo",
        "_type":"UserLoginRequest"
    };

    var that = this;


    makina.util.jsonpRequest(json,
        function(data){
            makina._app.user = data;
            makina._app.user["session"]="3a6c56c3-88f3-4590-b6a7-273c5174e852";

            console.log(makina._app.user);

            that.GetAppList();
        },
        function(data){
            console.log(data);
        }
    );


}


makina.dashboard.Start.prototype.GetAppList = function(){

    var json ={
        "_type":"ListAppsRequest",
        "callTag":"",
        "callbackTag":"",
        "registerId":"",
        "session":"3a6c56c3-88f3-4590-b6a7-273c5174e852",
        "verb":"",
        "pager":{
            "_type":"Pager",
            "orderBy":"",
            "pageNum":1,
            "pageSize":1,
            "sort":""
        }
    };
    var  that = this;


    makina.util.jsonpRequest(json,
        function(data){
            makina._app.appList = data;

            console.log(data);

            that.LoadAppList();

        },
        function(data){
            console.log(data);
        }
    );
}

makina.dashboard.Start.prototype.LoadAppList = function(){

    var appList = makina._app.appList["infoList"];

    var html ="";

    goog.array.forEach(appList,function(item,i){
        html += '<li class="menu-item"><span class="text">'+ item["appname"] +'</span></li>';
    });


    goog.dom.getElement(this.appListContainerId).innerHTML = html;

}



var Base64 = {

    // private property
    _keyStr : "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",

    // public method for encoding
    encode : function (input) {
        var output = "";
        var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
        var i = 0;

        input = Base64._utf8_encode(input);

        while (i < input.length) {

            chr1 = input.charCodeAt(i++);
            chr2 = input.charCodeAt(i++);
            chr3 = input.charCodeAt(i++);

            enc1 = chr1 >> 2;
            enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
            enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
            enc4 = chr3 & 63;

            if (isNaN(chr2)) {
                enc3 = enc4 = 64;
            } else if (isNaN(chr3)) {
                enc4 = 64;
            }

            output = output +
                Base64._keyStr.charAt(enc1) + Base64._keyStr.charAt(enc2) +
                Base64._keyStr.charAt(enc3) + Base64._keyStr.charAt(enc4);

        }

        return output;
    },

    // public method for decoding
    decode : function (input) {
        var output = "";
        var chr1, chr2, chr3;
        var enc1, enc2, enc3, enc4;
        var i = 0;

        input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

        while (i < input.length) {

            enc1 = Base64._keyStr.indexOf(input.charAt(i++));
            enc2 = Base64._keyStr.indexOf(input.charAt(i++));
            enc3 = Base64._keyStr.indexOf(input.charAt(i++));
            enc4 = Base64._keyStr.indexOf(input.charAt(i++));

            chr1 = (enc1 << 2) | (enc2 >> 4);
            chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
            chr3 = ((enc3 & 3) << 6) | enc4;

            output = output + String.fromCharCode(chr1);

            if (enc3 != 64) {
                output = output + String.fromCharCode(chr2);
            }
            if (enc4 != 64) {
                output = output + String.fromCharCode(chr3);
            }

        }

        output = Base64._utf8_decode(output);

        return output;

    },

    // private method for UTF-8 encoding
    _utf8_encode : function (string) {
        string = string.replace(/\r\n/g,"\n");
        var utftext = "";

        for (var n = 0; n < string.length; n++) {

            var c = string.charCodeAt(n);

            if (c < 128) {
                utftext += String.fromCharCode(c);
            }
            else if((c > 127) && (c < 2048)) {
                utftext += String.fromCharCode((c >> 6) | 192);
                utftext += String.fromCharCode((c & 63) | 128);
            }
            else {
                utftext += String.fromCharCode((c >> 12) | 224);
                utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                utftext += String.fromCharCode((c & 63) | 128);
            }

        }

        return utftext;
    },

    // private method for UTF-8 decoding
    _utf8_decode : function (utftext) {
        var string = "";
        var i  = 0;
        var c  = 0;
        var c1 = 0;
        var c2 = 0;
        var c3 = 0;


        while ( i < utftext.length ) {

            c = utftext.charCodeAt(i);

            if (c < 128) {
                string += String.fromCharCode(c);
                i++;
            }
            else if((c > 191) && (c < 224)) {
                c2 = utftext.charCodeAt(i+1);
                string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
                i += 2;
            }
            else {
                c2 = utftext.charCodeAt(i+1);
                c3 = utftext.charCodeAt(i+2);
                string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
                i += 3;
            }

        }

        return string;
    }

}

