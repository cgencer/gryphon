

google closure notes


Loxodonta project created by faust for frontend
 first i am not using, i am using google closure is best for big project,

 however,

 frontend/ directory is wrapper hole all frontend
 frontend/compiled/ under directory compiled javascript code is here
   we are using compiled.js

 frontend/loxodonta/ directory is contain all javascript code
  we are programing here



--- LOXODONTA MODULES ---
-------------------------
/dashboard/ controller dashboard manage project,code editor,
/unittest/ controller unit test modul
/codegen/ controller codgen modul
/datastorage/ controller data grid,
    you must add sorter, pager, dialog, reference object
/javadocs/ tutorial loxodonta only html or something like that

-- not module --
/project/ controller all project , Action, Model, Scripts,
 we must use collection goog.array for project








/** @enum {string} */
TrafficLight = {
  RED: '#ff0000',
  YELLOW: '#ffff00',
  GREEN: '#00ff00'
};
TrafficLight.values = function() {
  return [TrafficLight.RED, TrafficLight.GREEN, TrafficLight.BLUE];
};


goog.require('goog.array');

goog.scope(function() {
  var arr = goog.array;
}); // close goog.scope()


google.structs.Set // kullanılabilir

http://closure-library.googlecode.com/svn/docs/class_goog_structs_Set.html

Constructor
goog.structs.Set(opt_values)


var html = "<ul><li>a</li><li>b</li><li>c</li></ul>";
var el = goog.dom.$('id_of_element');
var fragment = goog.dom.htmlToDocumentFragment( html );
el.appendChild( fragment );

