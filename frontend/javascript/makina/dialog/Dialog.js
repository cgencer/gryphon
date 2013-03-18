/**
 * Created with IntelliJ IDEA.
 * User: NMD
 * Date: 20.02.2013
 * Time: 12:44
 * To change this template use File | Settings | File Templates.
 */




goog.provide('makina.dialog.Dialog');
goog.require('goog.ui.Dialog');

goog.require('goog.ui.Popup');

/**
 * Opens a customized dialog modal.
 *
 * @constructor
 * @param {!string} content Content of the dialog box.
 * @param {!string} title Title of the dialog box.
 * @param {Function=} yesHandler The callback function that will be executed after user accepted the dialog.
 * @param {Function=} noHandler The callback function that will be executed after user rejected or closed the dialog.
 * @param {makina.dialog.ButtonSet=} buttonSet Alternative button sets.
 */
makina.dialog.Dialog = function(content, title, yesHandler, noHandler, buttonSet) {
    var dialog = this.dialog = new goog.ui.Dialog(undefined, false);
    dialog.setTitle(title);
    dialog.setContent(content);

    var buttons = buttonSet == makina.dialog.ButtonSet.YES_NO ? goog.ui.Dialog.ButtonSet.createYesNo() : goog.ui.Dialog.ButtonSet.createOk();
    dialog.setButtonSet(buttons);
    dialog.setVisible(true);
/*
    goog.events.listen(dialog, goog.ui.Dialog.EventType.SELECT, function(e) {
        if (e.key == 'yes' ||  e.key == 'ok') {
            yesHandler && yesHandler(e);
        }
        else {
            noHandler && noHandler(e);
        }
    });*/

    dialog.setDisposeOnHide(true);
    this.preventEnterKey();
    this.darken();
};


makina.dialog.Dialog.prototype.darken = function() {
    this.dialog.setBackgroundElementOpacity(0.86);
    this.dialog.getBackgroundElement().style.background = '#000';
};


makina.dialog.Dialog.prototype.removeButtons = function() {
    goog.dom.removeNode(this.dialog.getElement().lastChild);
};


makina.dialog.Dialog.prototype.preventEnterKey = function() {

   /* var elements = $(this.dialog.getElement()).find('input[type=text]');

    elements.keypress(function(e) {
        if (e.keyCode == 13) {
            e.preventDefault();
            e.stopPropagation();
            return false;
        }
    });  */
};


/**
 * @enum {string}
 */
makina.dialog.ButtonSet = {
    OK: 'ok',
    YES_NO: 'yesNo'
};
