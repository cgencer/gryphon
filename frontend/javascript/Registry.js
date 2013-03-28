/**
 * Created with IntelliJ IDEA.
 * User: NMD
 * Date: 07.12.2012
 * Time: 18:00
 * To change this template use File | Settings | File Templates.
 */

goog.provide("makina.Registry");
goog.require('goog.structs.Map');

/**
 *
 * @constructor
 * @extends {goog.structs.Map}
 */
makina.Registry = function(){
    goog.base(this);
}
goog.inherits(makina.Registry,goog.structs.Map);