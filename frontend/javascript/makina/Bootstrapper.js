/**
 * Created with IntelliJ IDEA.
 * User: NMD
 * Date: 25.01.2013
 * Time: 13:00
 * To change this template use File | Settings | File Templates.
 */


goog.provide('makina.Bootstrapper');
goog.require('goog.array');
goog.require('goog.events');
goog.require('goog.events.EventTarget');
goog.require('goog.events.EventHandler');
goog.require('goog.debug.ErrorHandler');
goog.require('goog.date');
goog.require('goog.Uri');
goog.require('goog.storage.mechanism.HTML5LocalStorage');
goog.require('goog.json');
goog.require('goog.net.XhrIo');
goog.require('goog.net.cookies');



goog.require('makina.Registry');
goog.require('makina.dom');
goog.require('makina.util');
goog.require('makina.Widget');



goog.require('makina.dashboard.Start');






/**
 *
 * @constructor
 */
makina.Bootstrapper = function(){



    makina.timestamp = new Date().getTime() / 1000;
    makina.registry = new makina.Registry();
    makina.uri = new goog.Uri(window.location);

    var ul=makina.uri.getScheme()+"://"+makina.uri.getDomain();
    if(makina.uri.getPort()!= null)ul+=":"+makina.uri.getPort();

    makina.sURL =ul;

    makina.storage = new goog.storage.mechanism.HTML5LocalStorage();
    makina._app = {};
    makina._app.user = null;



    var start= new makina.dashboard.Start();

    //goog.exportSymbol("makina",makina);
    goog.exportSymbol("HandsomeWidget",makina.Widget);
    console.log("goog.exportSymbol");


};

makina.Bootstrapper.prototype.initModules = function(){
    this.modul = "";


};






window.onload = makina.Bootstrapper;

