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
/*










   /// this.GetServiceDisco();

  ///  this.UserLogin();

    var arr_json =[];

/*
    for(var i=1;i<=100;i++){



      ///  var json ={"2012":{"c":1359,"3":{"c":28,"19":{"c":2,"7":{"c":2}},"22":{"c":5,"5":{"c":5}},"25":{"c":6,"3":{"c":6}},"28":{"c":7,"1":{"c":7}},"30":{"c":8,"23":{"c":8}}},"4":{"c":132,"2":{"c":9,"21":{"c":9}},"5":{"c":10,"19":{"c":10}},"8":{"c":11,"17":{"c":11}},"11":{"c":12,"15":{"c":12}},"14":{"c":13,"13":{"c":13}},"17":{"c":14,"11":{"c":14}},"20":{"c":15,"9":{"c":15}},"23":{"c":15,"7":{"c":15}},"26":{"c":16,"5":{"c":16}},"29":{"c":17,"3":{"c":17}}},"5":{"c":253,"2":{"c":18,"1":{"c":18}},"4":{"c":19,"23":{"c":19}},"7":{"c":20,"21":{"c":20}},"10":{"c":21,"19":{"c":21}},"13":{"c":22,"17":{"c":22}},"16":{"c":23,"15":{"c":23}},"19":{"c":24,"13":{"c":24}},"22":{"c":25,"11":{"c":25}},"25":{"c":26,"9":{"c":26}},"28":{"c":27,"7":{"c":27}},"31":{"c":28,"5":{"c":28}}},"6":{"c":328,"3":{"c":29,"3":{"c":29}},"6":{"c":30,"1":{"c":30}},"8":{"c":31,"23":{"c":31}},"11":{"c":31,"21":{"c":31}},"14":{"c":32,"19":{"c":32}},"17":{"c":33,"17":{"c":33}},"20":{"c":34,"15":{"c":34}},"23":{"c":35,"13":{"c":35}},"26":{"c":36,"11":{"c":36}},"29":{"c":37,"9":{"c":37}}},"7":{"c":471,"2":{"c":38,"7":{"c":38}},"5":{"c":39,"5":{"c":39}},"8":{"c":40,"3":{"c":40}},"11":{"c":41,"1":{"c":41}},"13":{"c":42,"23":{"c":42}},"16":{"c":43,"21":{"c":43}},"19":{"c":44,"19":{"c":44}},"22":{"c":45,"17":{"c":45}},"25":{"c":46,"15":{"c":46}},"28":{"c":46,"13":{"c":46}},"31":{"c":47,"11":{"c":47}}},"8":{"c":147,"3":{"c":48,"9":{"c":48}},"6":{"c":49,"7":{"c":49}},"9":{"c":50,"5":{"c":50}}}}};
        var json ={"2013":{"c":1359,"3":{"c":28,"19":{"c":2,"7":{"c":2}},"22":{"c":5,"5":{"c":5}},"25":{"c":6,"3":{"c":6}},"28":{"c":7,"1":{"c":7}},"30":{"c":8,"23":{"c":8}}},"4":{"c":132,"2":{"c":9,"21":{"c":9}},"5":{"c":10,"19":{"c":10}},"8":{"c":11,"17":{"c":11}},"11":{"c":12,"15":{"c":12}},"14":{"c":13,"13":{"c":13}},"17":{"c":14,"11":{"c":14}},"20":{"c":15,"9":{"c":15}},"23":{"c":15,"7":{"c":15}},"26":{"c":16,"5":{"c":16}},"29":{"c":17,"3":{"c":17}}},"5":{"c":253,"2":{"c":18,"1":{"c":18}},"4":{"c":19,"23":{"c":19}},"7":{"c":20,"21":{"c":20}},"10":{"c":21,"19":{"c":21}},"13":{"c":22,"17":{"c":22}},"16":{"c":23,"15":{"c":23}},"19":{"c":24,"13":{"c":24}},"22":{"c":25,"11":{"c":25}},"25":{"c":26,"9":{"c":26}},"28":{"c":27,"7":{"c":27}},"31":{"c":28,"5":{"c":28}}},"6":{"c":328,"3":{"c":29,"3":{"c":29}},"6":{"c":30,"1":{"c":30}},"8":{"c":31,"23":{"c":31}},"11":{"c":31,"21":{"c":31}},"14":{"c":32,"19":{"c":32}},"17":{"c":33,"17":{"c":33}},"20":{"c":34,"15":{"c":34}},"23":{"c":35,"13":{"c":35}},"26":{"c":36,"11":{"c":36}},"29":{"c":37,"9":{"c":37}}},"7":{"c":471,"2":{"c":38,"7":{"c":38}},"5":{"c":39,"5":{"c":39}},"8":{"c":40,"3":{"c":40}},"11":{"c":41,"1":{"c":41}},"13":{"c":42,"23":{"c":42}},"16":{"c":43,"21":{"c":43}},"19":{"c":44,"19":{"c":44}},"22":{"c":45,"17":{"c":45}},"25":{"c":46,"15":{"c":46}},"28":{"c":46,"13":{"c":46}},"31":{"c":47,"11":{"c":47}}},"8":{"c":147,"3":{"c":48,"9":{"c":48}},"6":{"c":49,"7":{"c":49}},"9":{"c":50,"5":{"c":50}}}}};

        arr_json.push(json);
    }

   // console.log(arr_json);

    var totalJson = this.SumTS(arr_json);
*/
    var that = this;


    makina.util.ajaxRequest('http://localhost/makina/ts.json','GET',
        {},
        function(data){

           that.RenderDataset(data);

        }
    );


}
/**
 *
 * @param data
 *
 */

makina.dashboard.Start.prototype.RenderDataset = function(data){


    for(var i in data){

        var item =data[i];

        goog.object.forEach(item,function(v,k,o){
           if(goog.string.startsWith(k,"timeslot"))
                data[i][k]= goog.json.parse(Base64.decode(data[i][k]));
        });

    }


    var ds=new makina.Dataset(data);

    var tmpData = data;



    goog.dom.getElement('data-grid-1').innerHTML = ds.GetDataTable(tmpData,"table-1");

    var component = new goog.ui.TableSorter();
    component.decorate(goog.dom.getElement('table-1'));
    var j=0;
    goog.object.forEach(tmpData[0],function(v,k,o){
        component.setSortFunction(j++, goog.ui.TableSorter.alphaSort);
    });






    console.log("ds.GroupBys(['Application','Platform'],['click','install']");
    var obj= ds.GroupBys(["Application","Platform"],['timeslotCLICK','timeslotINSTALL']);
    console.log(obj);

    goog.dom.getElement('data-grid-2').innerHTML = ds.GetDataTable(obj["response"],"table-2");



};



makina.dashboard.Start.prototype.SumTS = function(dataArrayBase64){

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

var x = function(){

}



makina.dashboard.Start.prototype.BindEvents = function(){

    var that = this;

    goog.events.listen(goog.dom.getElement('create-new-app'),goog.events.EventType.CLICK,function(){
       that.SaveWidgetForm();
    });
    goog.events.listen(goog.dom.getElement('save-loxo'),goog.events.EventType.CLICK,function(){
       that.SaveMovie();
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



}


makina.dashboard.Start.prototype.SaveMovie = function(){
/*
    var json={
            "_type":"SaveRequest",
            "session":"e6f6eeea-d56e-44a3-8ed0-10fbfb8bb683",
            "verb":"Save",
            "applicationToken":"ff8080813caa0458013caa0458f70000",
            "serializedObject":{
                "_type":"Movie",
                "movieName":"The Matrix Reloaded",
                "year":2003,
                "directors":["Andy Wachowski","Lana Wachowski"],
                "poster":""
            } ,
            "deviceId" : "0FE07CEE-00F8-4C37-8472-A77322BEF972"
    }
*/
    /*{
        "request" : {
            "verb" : "GetCategories",
                "_type" : "GetCategoriesRequest",
                "session" : "61382769-EA3B-40ED-8EFB-5DA5E81BAE33",
                "blogName" : "Erdem",
                "deviceId" : "eff4411f44f9749e7fb6f5ac1ffb50cd"
        }
    }*/

    var json ={
        "request":{
        "_type":"GetCategoriesRequest",
        "session":"e6f6eeea-d56e-44a3-8ed0-10fbfb8bb683",
        "verb":"GetCategories",
        "blogName" : "Erdem",
        "deviceId" : "0FE07CEE-00F8-4C37-8472-A77322BEF972"
        }
    }

    var that = this;


    makina.util.jsonpRequest(json,
        function(data){

            console.log(data);
        },
        function(data){
            console.log(data);
        }
    );


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

