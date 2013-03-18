/**
 * Created with IntelliJ IDEA.
 * User: NMD
 * Date: 30.01.2013
 * Time: 13:52
 * To change this template use File | Settings | File Templates.
 */

goog.provide('makina.dashboard.Start');
goog.require('goog.dom.query') ;
goog.require('goog.json');
goog.require('goog.crypt.base64');



/**
 *
 * @constructor
 */
makina.dashboard.Start = function(){

    this.appListContainerId = "ul-id-app-list"


    this.BindEvents();

    this.UserLogin();



}

makina.dashboard.Start.prototype.BindEvents = function(){

    var that = this;

    goog.events.listen(goog.dom.getElement('widget-1'),goog.events.EventType.CLICK,function(){
        that.DrawWidget(1);
    });



}


makina.dashboard.Start.prototype.DrawWidget = function(type){

    console.log("makina.dashboard.Start.prototype.DrawWidget");


    this.widgetContainer = "content-widget";


    var options = {
        width: 400, height: 240,
        legend: 'none',
        pointSize: 5,
        chartArea:{left:50,top:10}
    };


    this.cart =new makina.Widget(makina.Widget.Type.LINE, this.widgetContainer, options);



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

