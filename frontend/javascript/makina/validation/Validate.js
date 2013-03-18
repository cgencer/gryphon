/**
 * Created with IntelliJ IDEA.
 * User: NMD
 * Date: 04.03.2013
 * Time: 12:19
 * To change this template use File | Settings | File Templates.
 */


goog.provide('makina.validation.Validate');


/**
 *
 * @param {Element} el
 * @param validateType
 * @constructor
 */
makina.validation.Validate = function(el, validateType ){

    this.el = el;
    this.validateType = validateType;

    this.ListenValidate();


}

makina.validation.Validate.prototype.ListenValidate = function(){


    if(this.validateType == makina.validation.Types.actionName){

    }else if(this.validateType == makina.validation.Types.attributeName){
        this.ValidateAttributeName();
    }else if(this.validateType == makina.validation.Types.modelName){
        this.ValidateProjectName();
    }else if(this.validateType == makina.validation.Types.projectName){
        this.ValidateProjectName();
    }else if(this.validateType == makina.validation.Types.serviceName){
        this.ValidateProjectName();
    }

}

makina.validation.Validate.prototype.ValidateAttributeName = function(){
    var that = this;
    goog.events.listen(this.el,goog.events.EventType.KEYUP,function(e){
        var vl= that.el.value;
        var val=  vl.replace(/[^A-Za-z]/gi,"");
        var pVal=val.substr(0,1).toLowerCase()+val.substr(1,val.length);
        that.el.value  = pVal;
    });
}

makina.validation.Validate.prototype.ValidateProjectName = function (){
    var that = this;
    goog.events.listen(this.el,goog.events.EventType.KEYUP,function(e){
        var vl= that.el.value;
        var val=  vl.replace(/[^A-Za-z]/gi,"");
        var pVal=val.substr(0,1).toUpperCase()+val.substr(1,val.length);
        that.el.value  = pVal;
    });
}

makina.validation.Validate.prototype.ValidateEnglishName = function(){

    var that = this;
    goog.events.listen(this.el,goog.events.EventType.KEYUP,function(e){
        var vl= that.el.value;
        var val=  vl.replace(/[^A-Za-z0-9]/gi,"") ;
        that.el.value  = val;
    });
}



makina.validation.Types = {

    projectName   : 'PROJECT_NAME',
    modelName     : 'MODEL_NAME',
    actionName    : 'ACTION_NAME',
    serviceName   : 'SERVICE_NAME',
    attributeName : 'ATTRIBUTE_NAME',
    englishName   : 'ENGLISH_NAME'

}