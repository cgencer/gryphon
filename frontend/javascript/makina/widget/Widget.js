/**
 * Created with JetBrains WebStorm.
 * User: NMD
 * Date: 18.03.2013
 * Time: 18:08
 * To change this template use File | Settings | File Templates.
 */


goog.provide('makina.Widget');



var callBack=function(data){
     console.log("globalllllllllllllllll");
}

/**
 *
 * @param {Object} options
 * @constructor
 */
makina.Widget = function(options){

    options={
        "url":"http://192.168.10.17/Events/Report/MAKINA/CIRawReport",
        "refreshTime":30,
        "refreshCallBack":callBack,
        "responseSuccessCallBack":callBack,
        "responseErrorCallBack":callBack
    }




    this._url = options["url"];
    this._refreshTime = options["refreshTime"] * 1000;
    this._refreshCallBack = options["refreshCallBack"];
    this._responseSuccessCallBack = options["responseSuccessCallBack"];
    this._responseErrorCallBack = options["responseErrorCallBack"];

    this.responseData = {};
    this.data =[];
    this._timer = null;

    this._utcTime =Math.round( new goog.date.DateTime(1999,1,1,10,10,10).getTime() /1000.0 );





///makina.Widget = function(wType,containerDivId,options){

/*

    this.type = wType;

    this.chartOptions = graphicsOptions["options"];
    this.containerId  = graphicsOptions["options"]["containerDivId"];


    this.datasetOptions = datasetOptions["options"];
*/



/*




    var dataJson ={"2013":{"c":1359,"3":{"c":28,"19":{"c":2,"7":{"c":2}},"22":{"c":5,"5":{"c":5}},"25":{"c":6,"3":{"c":6}},"28":{"c":7,"1":{"c":7}},"30":{"c":8,"23":{"c":8}}},"4":{"c":132,"2":{"c":9,"21":{"c":9}},"5":{"c":10,"19":{"c":10}},"8":{"c":11,"17":{"c":11}},"11":{"c":12,"15":{"c":12}},"14":{"c":13,"13":{"c":13}},"17":{"c":14,"11":{"c":14}},"20":{"c":15,"9":{"c":15}},"23":{"c":15,"7":{"c":15}},"26":{"c":16,"5":{"c":16}},"29":{"c":17,"3":{"c":17}}},"5":{"c":253,"2":{"c":18,"1":{"c":18}},"4":{"c":19,"23":{"c":19}},"7":{"c":20,"21":{"c":20}},"10":{"c":21,"19":{"c":21}},"13":{"c":22,"17":{"c":22}},"16":{"c":23,"15":{"c":23}},"19":{"c":24,"13":{"c":24}},"22":{"c":25,"11":{"c":25}},"25":{"c":26,"9":{"c":26}},"28":{"c":27,"7":{"c":27}},"31":{"c":28,"5":{"c":28}}},"6":{"c":328,"3":{"c":29,"3":{"c":29}},"6":{"c":30,"1":{"c":30}},"8":{"c":31,"23":{"c":31}},"11":{"c":31,"21":{"c":31}},"14":{"c":32,"19":{"c":32}},"17":{"c":33,"17":{"c":33}},"20":{"c":34,"15":{"c":34}},"23":{"c":35,"13":{"c":35}},"26":{"c":36,"11":{"c":36}},"29":{"c":37,"9":{"c":37}}},"7":{"c":471,"2":{"c":38,"7":{"c":38}},"5":{"c":39,"5":{"c":39}},"8":{"c":40,"3":{"c":40}},"11":{"c":41,"1":{"c":41}},"13":{"c":42,"23":{"c":42}},"16":{"c":43,"21":{"c":43}},"19":{"c":44,"19":{"c":44}},"22":{"c":45,"17":{"c":45}},"25":{"c":46,"15":{"c":46}},"28":{"c":46,"13":{"c":46}},"31":{"c":47,"11":{"c":47}}},"8":{"c":147,"3":{"c":48,"9":{"c":48}},"6":{"c":49,"7":{"c":49}},"9":{"c":50,"5":{"c":50}}}}};

    var title =['Month', 'Click'];

    var arrNewData = [];
    var arrDataTable = [];

    arrNewData.push(title);

    for(var i=1;i<=12;i++){

        if(dataJson[2013][i] != undefined){
            var m =[];
            var mCount =dataJson[2013][i]["c"];
            var date = i;
            m.push(date);
            m.push(mCount);

            var mT=[];

            mT.push("2013."+i);
            mT.push(mCount);

            arrDataTable.push(mT);

            arrNewData.push(m);

        }else{

            var m =[];
            var mCount =0;
            var date = i;
            m.push(date);
            m.push(mCount);
            arrNewData.push(m);
        }

    }

*/



    this.RequestData();


}

makina.Widget.prototype._StartTimer = function(){



    var that = this;

    if(that._timer == null){
        console.log("makina.Widget.prototype._StartTimer ");
        console.log("goog.Timer.TICK ");
        that._timer = new goog.Timer(that._refreshTime);
        that._timer.start();
        goog.events.listen(that._timer, goog.Timer.TICK, function(){
           that.RequestData();
        });
    }
}



makina.Widget.prototype.RequestData = function(){

    var that = this;




    var url =this._url+"/"+this._utcTime;
    var jsonp = new goog.net.Jsonp(url);
    jsonp.setRequestTimeout(45*1000);//45 sn

    that._timer.stop();

    jsonp.send({},
        function(response){
            if(that._responseSuccessCallBack != null)
                (that._responseSuccessCallBack && that._responseSuccessCallBack(response));
            that.LoadData(response);
        },
        function(response){
            that._timer.start();
            if(that._responseErrorCallBack != null)
                (that._responseErrorCallBack && that._responseErrorCallBack(response));
        });
}


makina.Widget.prototype.LoadData = function(responseData){

    var that = this;


    this.responseData = responseData;

    this.DecodeData();


    if(goog.isNumber(this._refreshTime)){
        that._StartTimer();
    }

}

makina.Widget.prototype.EndOfProcess = function(){

    this._timer.start();

}


makina.Widget.prototype.DecodeData = function(){

    var that = this;


    if(that.responseData.length == 0){

    }else{

        var dateTime = new goog.date.DateTime();
        console.log(dateTime.toString());
        this._utcTime =Math.round( dateTime.getTime() /1000.0 );
        console.log("this._utcTime ="+this._utcTime  );
    }



    var that = this;
    console.log("makina.Widget.prototype.UpdateData ");
   goog.array.forEach(that.responseData,function(rowItem,i){
       goog.object.forEach(rowItem,function(v,k,o){
           if(goog.string.startsWith(k,"timeslot"))
               that.responseData[i][k]= goog.json.parse(Base64.decode(that.responseData[i][k]));
       });

       that.UpdateDataRow(rowItem);

   });




    console.log(" that.responseData = "+ that.responseData.length);
    console.log(" that.data = "+ that.data.length);


}
/**
 *
 * @param {!Object} newRowItem
 *
 */
makina.Widget.prototype.UpdateDataRow = function(newRowItem){

    var isUpdated = false;
    var that =  this;

    var BreakException= {};

    try{
        goog.array.forEach(that.data,function(item,i){
           if(item["_rowKey"] == newRowItem["_rowKey"]){
              that.data[i] = newRowItem;
               isUpdated = true;
               throw BreakException;
           }
        });
    }catch(e){

    }

    if(isUpdated){
        console.log("Update Row = "+newRowItem["_rowKey"]);
    }else{
        console.log("Add Row = "+newRowItem["_rowKey"]);
        that.data.push(newRowItem);
    }


}





makina.Widget.prototype.Draw = function(){




    if(this.type == makina.Widget.Type.AREA){



    }else if(this.type == makina.Widget.Type.BAR){



    }else if(this.type == makina.Widget.Type.COLUMN){



    }else if(this.type == makina.Widget.Type.LINE){



    }else if(this.type == makina.Widget.Type.PIE){


        var data = [
            ['Task', 'Hours per Day'],
            ['Work',     11],
            ['Eat',      2],
            ['Commute',  2],
            ['Watch TV', 2],
            ['Sleep',    7]
        ];


    }else if(this.type == makina.Widget.Type.TABLE){




    }else if(this.type == makina.Widget.Type.GEO){




    }




}
/**
 *
 * @param containerId
 * @param data
 * @param options
 *
 */

makina.Widget.prototype.DrawChartArea = function(containerId, data, options){

    this.containerId = containerId;
    this.options = options;
    this.data = data;

    this.chart = new vsz.AreaChart(document.getElementById(this.containerId));
    this.dataTable = vsz.arrayToDataTable(this.data);
    this.chart.draw(this.dataTable, this.options);
}

/**
 *
 * @param containerId
 * @param data
 * @param options
 *
 */
makina.Widget.prototype.DrawChartBar = function(containerId, data, options){

    this.containerId = containerId;
    this.options = options;
    this.data = data;

    this.chart = new vsz.BarChart(document.getElementById(this.containerId));
    this.dataTable = vsz.arrayToDataTable(this.data);
    this.chart.draw(this.dataTable, this.options);
}

/**
 *
 * @param containerId
 * @param data
 * @param options
 *
 */
makina.Widget.prototype.DrawChartColumn = function(containerId, data, options){

    this.containerId = containerId;
    this.options = options;
    this.data = data;

    this.chart = new vsz.ColumnChart(document.getElementById(this.containerId));
    this.dataTable = vsz.arrayToDataTable(this.data);
    this.chart.draw(this.dataTable, this.options);
}

/**
 *
 * @param containerId
 * @param data
 * @param options
 *
 */
makina.Widget.prototype.DrawChartLine = function(containerId, data, options){

    this.containerId = containerId;
    this.options = options;
    this.data = data;

    this.chart = new vsz.LineChart(document.getElementById(this.containerId));
    this.dataTable = vsz.arrayToDataTable(this.data);
    this.chart.draw(this.dataTable, this.options);

}

/**
 *
 * @param containerId
 * @param data
 * @param options
 *
 */
makina.Widget.prototype.DrawChartPie = function(containerId, data, options){

    this.containerId = containerId;
    this.options = options;
    this.data = data;

    this.chart = new vsz.PieChart(document.getElementById(this.containerId));
    this.dataTable = vsz.arrayToDataTable(this.data);
    this.chart.draw(this.dataTable, this.options);

}

/**
 *
 * @param containerId
 * @param data
 * @param options
 *
 */
makina.Widget.prototype.DrawChartTable = function(containerId, data, options){

    this.containerId = containerId;
    this.options = options;
    this.data = data;
/*
    this.chart = new vsz.PieChart(document.getElementById(this.containerId));
    this.dataTable = vsz.arrayToDataTable(this.data);
    this.chart.draw(this.dataTable, this.options);*/

    var data = new vsz.DataTable();
    data.addColumn('string', 'Date');
    data.addColumn('number', 'Click');
    /* data.addRows([
     ['Mike',  {v: 10000, f: '$10,000'}, true],
     ['Jim',   {v:8000,   f: '$8,000'},  false],
     ['Alice', {v: 12500, f: '$12,500'}, true],
     ['Bob',   {v: 7000,  f: '$7,000'},  true]
     ]);*/

    console.log(arrDataTable);
    data.addRows(arrDataTable);

    var table = new vsz.Table(document.getElementById(this.containerId));
    table.draw(data, {showRowNumber: false});

}
/**
 *
 * @param containerId
 * @param data
 * @param options
 * @constructor
 */
makina.Widget.prototype.DrawChartGeo = function(containerId, data, options){



    this.containerId = containerId;
    this.options = options;
    this.data = data;


    this.chart = new vsz.GeoChart(document.getElementById(this.containerId));

    var data =[
        ['Country', 'Popularity'],
        ['Adana', 2000],
        ['Ankara', 3000],
        ['Aydin', 40000],
        ['Istanbul', 50000],
        ['Izmir', 6000],
        ['Malatya', 7000]
    ];

    this.options = {
        region: 'TR',
        displayMode: 'markers',
        colorAxis: {colors: ['green', 'blue']}
    };

    this.dataTable = vsz.arrayToDataTable(this.data);
    this.chart.draw(this.dataTable, this.options);
}





makina.Widget.Type= {

     AREA:'area',
     BAR:'bar',
     COLUMN:'column',
     LINE:'line',
     PIE:'pie',
     TABLE:'table',
     GEO:'geo'

}






