/**
 * Created with JetBrains WebStorm.
 * User: NMD
 * Date: 18.03.2013
 * Time: 18:08
 * To change this template use File | Settings | File Templates.
 */


goog.provide('makina.Widget');

/**
 *
 * @constructor
 */
makina.Widget = function(wType,containerDivId){

    this.type = wType;
    this.containerId = containerDivId;

    this.chart = new google.visualization.AreaChart(document.getElementById('chart_div'));

    this.Draw();


}


makina.Widget.prototype.Draw = function(){

}



makina.Widget.Type= {

     AREA:'area',
     BAR:'bar',
     LINE:'line',
     PIE:'pie'

}






