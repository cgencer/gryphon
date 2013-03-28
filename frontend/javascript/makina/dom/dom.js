/**
 * Created with IntelliJ IDEA.
 * User: NMD
 * Date: 30.01.2013
 * Time: 15:49
 * To change this template use File | Settings | File Templates.
 */


goog.provide('makina.dom');
goog.require('goog.dom');


makina.dom.click = function(idd,fnCallBack){

    var el = idd;
    if(typeof(idd) =='string'){
        el = document.getElementById(idd);
    }
    goog.events.listen(el, goog.events.EventType.CLICK, fnCallBack );
}


    var tempDiv = document.createElement('div');

    /**
     * Creates dom element from given string. Template string *must* include just one parent element.
     *
     * @param {!string} markup Markup as string.
     */
    makina.dom.createElement = function(markup) {
        tempDiv.innerHTML = markup;
        return tempDiv.removeChild(tempDiv.firstChild);
    };



/**
 *
 * @param {!string} elementIds Comma separated element ids like 'menu, logo, text'
 */
makina.dom.show = function(elementIds) {
    makina.dom.setDisplay_(elementIds, '');
};


makina.dom.toggle = function(elementId){


    var el = document.getElementById(elementId);
    var display =  el.style.display;

    if(display == 'none'){
        makina.dom.show(elementId);
    }else{
        makina.dom.hide(elementId);
    }
}

/**
 *
 * @param {!string} elementIds Comma separated element ids like 'menu, logo, text'
 */
makina.dom.hide = function(elementIds) {
    makina.dom.setDisplay_(elementIds, 'none');
};


/**
 * @param {!string} elementIds Comma separated element ids like 'menu, logo, text'
 * @param {!string} displayType Display flag of new element. Must be hide or block.
 */
makina.dom.setDisplay_ = function(elementIds, displayType) {
    var elements = elementIds.split(' ').join('').split(',');
    goog.array.forEach(elements, function(element) {
        var el = document.getElementById(element);
        return el ? el.style.display = displayType : false;
    });
};