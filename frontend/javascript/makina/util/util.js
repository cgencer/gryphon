/**
 * Created with IntelliJ IDEA.
 * User: NMD
 * Date: 30.01.2013
 * Time: 12:07
 * To change this template use File | Settings | File Templates.
 */

goog.provide('makina.util');
goog.require('goog.net.Jsonp');
goog.require('makina.dialog.Dialog');




/**
 * Calculates the strength of a password by giving points to some rules.
 *
 * @param {!string} password Password as sting.
 * @param {Element=} field Optional element to show calculated result by adding a class name and width property.
 * @return {number} Total strength point of the password.
 */
makina.util.calculatePasswordStrength = function(password, field) {
    var score = 0;/*
    score += password.length;

    if (password.length > 0 && password.length <= 4) score += password.length;
    else if (password.length >= 5 && password.length <= 7) score += 6;
    else if (password.length >= 8 && password.length <= 15) score += 12;
    else if (password.length >= 16) score += 18;

    if (password.match(/[a-z]/)) score += 1;
    if (password.match(/[A-Z]/)) score += 5;
    if (password.match(/\d/)) score += 5;
    if (password.match(/.*\d.*\d.*\d/)) score += 5;

    if (password.match(/[!,@,#,$,%,^,&,*,?,_,~]/)) score += 5;
    if (password.match(/.*[!,@,#,$,%,^,&,*,?,_,~].*[!,@,#,$,%,^,&,*,?,_,~]/)) score += 5;

    if (password.match(/(?=.*[a-z])(?=.*[A-Z])/)) score += 2;
    if (password.match(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])/)) score += 2;
    if (password.match(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!,@,#,$,%,^,&,*,?,_,~])/)) score += 2;


    score = score * 2 > 100 ? 100 : score * 2;
    if (field) {
        var result = 'weak';
        if (score == 0) result = '';
        if (score >= 40 && score <= 60) result = 'good';
        if (score >= 60 && score <= 80) result = 'ideal';
        if (score >= 80) result = 'best';
        goog.dom.classes.remove(field, 'weak', 'good', 'ideal', 'best');
        goog.dom.classes.add(field, result);
        field.style.width = score + '%';
    } */
    return score;

};


/**
 *
 * @param {!string} _url  url as string
 * @param {!string} _type
 * @param {!(Object||string)} jsonObject
 * @param {Function=} fnSuccessCallBack
 * @param {Function=} fnErrorCallBack
 *
 */

makina.util.ajaxRequest = function(_url, _type, jsonObject, fnSuccessCallBack, fnErrorCallBack  ){


    var request = new goog.net.XhrIo();
    var jsonData = goog.json.serialize(jsonObject);

    goog.events.listen(request, 'complete', function(){
        if(request.isSuccess()){
            var data = {};
            try{
                data=request.getResponseJson();
            }catch (e){
            }
            (fnSuccessCallBack && fnSuccessCallBack(data)) || makina.util.handleRequestSuccess(data);
        } else {
            var data = {};
            try{
                data=request.getLastError();
            }catch (e){
            }

            (fnErrorCallBack && fnErrorCallBack(data)) || makina.util.handleRequestError(data);
        }
    });
    request.send(_url, _type , jsonData, {'content-type':'application/json'});

}


makina.util.jsonpRequest = function( jsonObject, fnSuccessCallBack, fnErrorCallBack ){

    /*var jsonp = new goog.net.Jsonp('http://friendfeed.com/api/feed/user/lahosken');
    var payload = { 'format': 'json' };

    */

/*
   var payload = {
        "callTag":"",
        "registerId":"",
        "verb":"",
        "session":"3a6c56c3-88f3-4590-b6a7-273c5174e852",
        "callbackTag":"YTFlMTgyMzctZTVjNy00OGViLTg4ZDctZjgwMzRiNWMyYjFm",
        "userName":"demo",
        "pass":"demo",
        "_type":"UserLoginRequest"
    };

   var payloadListApps ={"_type":"ListAppsRequest",
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
*/

    var serviceName = jsonObject["_type"].replace("Request","");

  ///  var _url= 'http://mkevt.nmdapps.com/makinaweb/UserLogin/?request='+goog.json.serialize(payload);
    var _url= 'http://mkevt.nmdapps.com/makinaweb/'+serviceName+'/?request='+goog.json.serialize(jsonObject);


    var jsonp = new goog.net.Jsonp(_url);







    jsonp.send({},

        function(response){

            var data = {};
            try{
                data = response;
            }catch (e){
            }
            (fnSuccessCallBack && fnSuccessCallBack(data)) || makina.util.handleRequestSuccess(data);
        },
        function(response){
            var data = {};
            try{
                data=response;
            }catch (e){
                console.log(e);
            }
            (fnErrorCallBack && fnErrorCallBack(data)) || makina.util.handleRequestSuccess(data);
        });


}

/**
 *
 * @param {!Object} data
 */
makina.util.handleRequestSuccess = function(data){

}
/**
 *
 * @param {!Object} data
 */
makina.util.handleRequestError = function(data){

}


makina.util.showAlertMessage = function(title,message){

    var html='<div >' +
        '<p><br/><h1>'+title+'</h1></p><br/><br/>' +
         message+
        '<div style="text-align:center;"><input style="clear:both;" type="button" value="OK" id="btn-dialog-ok" /></div> '+
        '</div>';


    var dialog=new makina.dialog.Dialog(html,'Makina',function(){
        //
    });

    var el=goog.dom.getElement('btn-dialog-ok');


    goog.events.listen(el,goog.events.EventType.CLICK,function(){
        dialog.dialog.dispose();
    });

    dialog.removeButtons();

}

makina.util.showLoadingFullScreen = function(){


    var html='' +
        '<div id="loading-full-screen">' +
        '   <div class="loading-full-screen-bg"></div>' +
        '   <div class="loading-full-screen-bg-message-container"><h3><img style="width:50px;height:50px;" src="../frontend/images/loading_128.gif">Please Wait...</h3></div>' +
        '</div>';

    var h_dom=makina.dom.createElement(html);

    goog.dom.removeNode(goog.dom.getElement('loading-full-screen'));
    goog.dom.getElement('view-footer').appendChild(h_dom);

}

makina.util.hideLoadingFullScreen = function(){

    goog.dom.removeNode(goog.dom.getElement('loading-full-screen'));
}




















