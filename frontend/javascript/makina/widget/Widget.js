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
 * @param wType
 * @param {String} containerDivId
 * @param {Object} options
 * @constructor
 */
makina.Widget = function(wType,containerDivId,options){


    var dataJson ={"2013":{"c":1359,"3":{"c":28,"19":{"c":2,"7":{"c":2}},"22":{"c":5,"5":{"c":5}},"25":{"c":6,"3":{"c":6}},"28":{"c":7,"1":{"c":7}},"30":{"c":8,"23":{"c":8}}},"4":{"c":132,"2":{"c":9,"21":{"c":9}},"5":{"c":10,"19":{"c":10}},"8":{"c":11,"17":{"c":11}},"11":{"c":12,"15":{"c":12}},"14":{"c":13,"13":{"c":13}},"17":{"c":14,"11":{"c":14}},"20":{"c":15,"9":{"c":15}},"23":{"c":15,"7":{"c":15}},"26":{"c":16,"5":{"c":16}},"29":{"c":17,"3":{"c":17}}},"5":{"c":253,"2":{"c":18,"1":{"c":18}},"4":{"c":19,"23":{"c":19}},"7":{"c":20,"21":{"c":20}},"10":{"c":21,"19":{"c":21}},"13":{"c":22,"17":{"c":22}},"16":{"c":23,"15":{"c":23}},"19":{"c":24,"13":{"c":24}},"22":{"c":25,"11":{"c":25}},"25":{"c":26,"9":{"c":26}},"28":{"c":27,"7":{"c":27}},"31":{"c":28,"5":{"c":28}}},"6":{"c":328,"3":{"c":29,"3":{"c":29}},"6":{"c":30,"1":{"c":30}},"8":{"c":31,"23":{"c":31}},"11":{"c":31,"21":{"c":31}},"14":{"c":32,"19":{"c":32}},"17":{"c":33,"17":{"c":33}},"20":{"c":34,"15":{"c":34}},"23":{"c":35,"13":{"c":35}},"26":{"c":36,"11":{"c":36}},"29":{"c":37,"9":{"c":37}}},"7":{"c":471,"2":{"c":38,"7":{"c":38}},"5":{"c":39,"5":{"c":39}},"8":{"c":40,"3":{"c":40}},"11":{"c":41,"1":{"c":41}},"13":{"c":42,"23":{"c":42}},"16":{"c":43,"21":{"c":43}},"19":{"c":44,"19":{"c":44}},"22":{"c":45,"17":{"c":45}},"25":{"c":46,"15":{"c":46}},"28":{"c":46,"13":{"c":46}},"31":{"c":47,"11":{"c":47}}},"8":{"c":147,"3":{"c":48,"9":{"c":48}},"6":{"c":49,"7":{"c":49}},"9":{"c":50,"5":{"c":50}}}}};


    var title =['Month', 'Click'];

    var arrNewData = [];

    arrNewData.push(title);

    for(var i=1;i<=12;i++){

        if(dataJson[2013][i] != undefined){
            var m =[];
            var mCount =dataJson[2013][i]["c"];
            var date =i;
            m.push(date);
            m.push(mCount);

            arrNewData.push(m);

        }else{

            var m =[];
            var mCount =0;
            var date =i;
            m.push(date);
            m.push(mCount);
            arrNewData.push(m);
        }

    }




    this.type = wType;
    this.containerId = containerDivId;

    this.options = options;

    if(this.type == makina.Widget.Type.AREA){

        this.chart = new vsz.AreaChart(document.getElementById(this.containerId));

    }else if(this.type == makina.Widget.Type.BAR){

        this.chart = new vsz.BarChart(document.getElementById(this.containerId));

    }else if(this.type == makina.Widget.Type.LINE){

        this.chart = new vsz.LineChart(document.getElementById(this.containerId));

    }else if(this.type == makina.Widget.Type.PIE){

        this.chart = new vsz.PieChart(document.getElementById(this.containerId));

    }


    this.dataTable = vsz.arrayToDataTable(arrNewData);




    this.Draw();


}


makina.Widget.prototype.Draw = function(){

    this.chart.draw(this.dataTable, this.options );
}



makina.Widget.Type= {

     AREA:'area',
     BAR:'bar',
     LINE:'line',
     PIE:'pie'

}






