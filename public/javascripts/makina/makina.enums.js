/**
 * Created with JetBrains WebStorm.
 * User: NMD
 * Date: 20.01.2013
 * Time: 20:15
 * To change this template use File | Settings | File Templates.
 */


function GetListOfEnumsForMakinaEnumsSuccessCallBack(obj){

    makinaEnums.SetEnums(obj.ListAppEnumsResult.appEnums.enumName);

}

function GetListOfEnumsForMakinaEnumsFailedCallBack(obj){
    if (obj.ListAppEnumsResult !=null && obj.ListAppEnumsResult.visibleMessage != null) {
        alert(obj.ListAppEnumsResult.visibleMessage);
    }

    if (obj.message != null) {
        alert(obj.message);
    }

    return;
}

function GetListOfEnumsForMakinaEnums(){
    var b= new ListAppEnums('GetListOfEnumsForMakinaEnumsSuccessCallBack', 'GetListOfEnumsForMakinaEnumsFailedCallBack');
    b.send();
}



(function (makinaEnums, $, undefined) {

    var _enums = null;

    makinaEnums.SetEnums = function(enums){
        _enums = enums;
    }
    makinaEnums.GetEnums = function(){
        return _enums;
    }
    makinaEnums.GetEnumObject = function(name){

        var allEnums= makinaEnums.GetEnums();
        var _enum = null;
        var sizeOfEnums=allEnums.length;
        if(sizeOfEnums>0){
            for(var i=0; i < sizeOfEnums; i++){
                if(allEnums[i].Key == name){
                    _enum = allEnums[i].Value;
                    break;
                }
            }
        }
        return _enum;
    }


    makinaEnums.GetItemFromEnumObject = function(enumName,selectedValue){

        var _enum = null;
        var _selectedValue = null;

        if(typeof(selectedValue) == "number" || typeof(selectedValue) == "string" || typeof(selectedValue) == "boolean"){
            _selectedValue=selectedValue;
        }
        _enum = makinaEnums.GetEnumObject(enumName);

        if(_enum != null){

            if(_selectedValue != null){

                var tmp = _enum;
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




} (window.makinaEnums = window.makinaEnums || {}, jQuery));