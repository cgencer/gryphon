/**
 * Created with JetBrains WebStorm.
 * User: NMD
 * Date: 18.03.2013
 * Time: 18:08
 * To change this template use File | Settings | File Templates.
 */


goog.provide('makina.Widget');
goog.require('makina.Dataset');





/**
 *
 * @param {Object} options
 * @param {string|null} consoleWidget
 * @constructor
 */
makina.Widget = function(options,consoleWidget){


    this.options = options;

    this.elConsole;

    if(consoleWidget!=undefined){
        /**
         *
         * @type {string}
         */
        var el =consoleWidget;
        this.elConsole = goog.dom.getElement(el);
    }




    this._url = this.options["url"];
    this._refreshTime = this.options["refreshTime"] * 1000;

    this._responseSuccessCallBack = this.options["responseSuccessCallBack"];
    this._responseErrorCallBack = this.options["responseErrorCallBack"];


    /**
     *
     * @type {Array.<Object>}
     */
    this.responseData = [];
    this.data =[];
    this._timer;

    this._utcTime =Math.round( new goog.date.DateTime(1999,1,1,10,10,10).getTime() /1000.0 );


    this.ds = new makina.Dataset(this.data);

    this.Console("Start Widget","blue");

    this.RequestData();


}
/**
 *
 * @param {!string} messages
 * @param {string=} color
 *
 */
makina.Widget.prototype.Console = function(messages,color){

    var tm = new goog.date.DateTime();
    var timee =tm.toIsoString(true)+"."+tm.getMilliseconds();


    var msg = timee+" : "+messages;

    var clr ="black";
    if(color!= undefined)
        clr =color;


    console.log(msg);
    if(this.elConsole != undefined){
        this.elConsole.appendChild(makina.dom.createElement("<div style='color:"+clr+" ' >"+msg+"</div>"));
    }

}



makina.Widget.prototype._StartTimer = function(){



    var that = this;

    if(this._timer == null || this._timer == undefined){

        that.Console("Create Timer and Start Timer "+(that._refreshTime/1000) +" ms");

        that._timer = new goog.Timer(that._refreshTime);
        that._timer.start();
        goog.events.listen(that._timer, goog.Timer.TICK, function(){
           that.RequestData();
        });
    }else{
        that.Console("Start Timer...");
        this._timer.start();
    }
}




/**
 *
 * @param {Object!}item
 * @private
 */
makina.Widget.prototype._ProcessFetchItems =  function(item){



    var that =  this;



    if(item["type"]== "sum"){

        var obj= this.ds.Sum(item["columns"]);
        if(item["fetchCallBack"]!= null){
            item["fetchCallBack"](obj);
        }

    }else if(item["type"]=="groupby"){

        console.log(" call group bysss ");
        var obj= this.ds.GroupBys(item["byColumns"]  , item["columns"]);


        if(item["fetchCallBack"]!= null){
           item["fetchCallBack"](obj);
        }

    }else {

    }




}


/**
 *
 * @param {!Array.<Object>} response
 * @private
 */
makina.Widget.prototype._ResponseDataSuccessCallBack = function(response){


    var that = this;

    if(this._responseSuccessCallBack != null)
        (this._responseSuccessCallBack && this._responseSuccessCallBack(response));

    this.responseData = response;
    this.DecodeData();

    this.ds.SetDataset(this.data);


    //process request options filters...

    var t1 =goog.now();

    this.Console("Fetch Event Options Started","red");

    var retchOptions = this.options["fetchOptions"];

    goog.array.forEach(retchOptions,function(item){

        var s=goog.now();
        that.Console("Start "+item["name"]+" ProcessFetchItems","green");

        that._ProcessFetchItems(item);
        var ms = goog.now() - s;
        that.Console("End "+item["name"]+" ProcessFetchItems ms="+ms,"green");

    });

    var t2= goog.now() - t1;

    this.Console("End Of Event Options total ms="+t2,"red");


    if(goog.isNumber(this._refreshTime)){
        this._StartTimer();
    }


}
/**
 *
 * @param {Object!}response
 * @private
 */
makina.Widget.prototype._ResponseDataErrorCallBack = function(response){

    this._timer.start();
    if(this._responseErrorCallBack != null)
        (this._responseErrorCallBack && this._responseErrorCallBack(response));

}

makina.Widget.prototype._RequestDataBeforeSend = function(){

    if(!(this._timer == null || this._timer == undefined)){
        this._timer.stop();
        this.Console("Stop Timer");
    }

}

makina.Widget.prototype.RequestData = function(){

    var that = this;


    var url =this._url+"/"+this._utcTime;
    var jsonp = new goog.net.Jsonp(url);
    jsonp.setRequestTimeout(45*1000);//45 sn

    this.Console("Request Data With JSONP","blue");

    this._RequestDataBeforeSend();

    jsonp.send({},
        function(response){

            that.Console("Response JSONP Request");

            that._ResponseDataSuccessCallBack(response);

        },
        function(response){
           that._ResponseDataErrorCallBack(response);
        });
}




makina.Widget.prototype.EndOfProcess = function(){

    this._timer.start();

}


makina.Widget.prototype.DecodeData = function(){

    var that = this;


    if(that.responseData.length == 0){

    }else{

        var dateTime = new goog.date.DateTime();

        this._utcTime =Math.round( dateTime.getTime() /1000.0 );

    }



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
       /// console.log("Update Row = "+newRowItem["_rowKey"]);
    }else{
       /// console.log("Add Row = "+newRowItem["_rowKey"]);
        that.data.push(newRowItem);
    }


}





makina.Widget.prototype.Draw = function(){


/*

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


*/

}


/*

*/
/**
 *
 * @param containerId
 * @param data
 * @param options
 *
 *//*


makina.Widget.prototype.DrawChartArea = function(containerId, data, options){

    this.containerId = containerId;
    this.options = options;
    this.data = data;

    this.chart = new google.visualization.AreaChart(document.getElementById(this.containerId));
    this.dataTable = google.visualization.arrayToDataTable(this.data);
    this.chart.draw(this.dataTable, this.options);
}

*/
/**
 *
 * @param containerId
 * @param data
 * @param options
 *
 *//*

makina.Widget.prototype.DrawChartBar = function(containerId, data, options){

    this.containerId = containerId;
    this.options = options;
    this.data = data;

    this.chart = new google.visualization.BarChart(document.getElementById(this.containerId));
    this.dataTable = google.visualization.arrayToDataTable(this.data);
    this.chart.draw(this.dataTable, this.options);
}

*/
/**
 *
 * @param containerId
 * @param data
 * @param options
 *
 *//*

makina.Widget.prototype.DrawChartColumn = function(containerId, data, options){

    this.containerId = containerId;
    this.options = options;
    this.data = data;

    this.chart = new google.visualization.ColumnChart(document.getElementById(this.containerId));
    this.dataTable = google.visualization.arrayToDataTable(this.data);
    this.chart.draw(this.dataTable, this.options);
}

*/
/**
 *
 * @param containerId
 * @param data
 * @param options
 *
 *//*

makina.Widget.prototype.DrawChartLine = function(containerId, data, options){

    this.containerId = containerId;
    this.options = options;
    this.data = data;

    this.chart = new google.visualization.LineChart(document.getElementById(this.containerId));
    this.dataTable = google.visualization.arrayToDataTable(this.data);
    this.chart.draw(this.dataTable, this.options);

}

*/
/**
 *
 * @param containerId
 * @param data
 * @param options
 *
 *//*

makina.Widget.prototype.DrawChartPie = function(containerId, data, options){

    this.containerId = containerId;
    this.options = options;
    this.data = data;

    this.chart = new google.visualization.PieChart(document.getElementById(this.containerId));
    this.dataTable = google.visualization.arrayToDataTable(this.data);
    this.chart.draw(this.dataTable, this.options);

}

*/
/**
 *
 * @param containerId
 * @param data
 * @param options
 *
 *//*

makina.Widget.prototype.DrawChartTable = function(containerId, data, options){

    this.containerId = containerId;
    this.options = options;
    this.data = data;
*/
/*
    this.chart = new google.visualization.PieChart(document.getElementById(this.containerId));
    this.dataTable = google.visualization.arrayToDataTable(this.data);
    this.chart.draw(this.dataTable, this.options);

    var data = new google.visualization.DataTable();
    data.addColumn('string', 'Date');
    data.addColumn('number', 'Click');
    data.addRows([
     ['Mike',  {v: 10000, f: '$10,000'}, true],
     ['Jim',   {v:8000,   f: '$8,000'},  false],
     ['Alice', {v: 12500, f: '$12,500'}, true],
     ['Bob',   {v: 7000,  f: '$7,000'},  true]
     ]);

    console.log(arrDataTable);
    data.addRows(arrDataTable);

    var table = new google.visualization.Table(document.getElementById(this.containerId));
    table.draw(data, {showRowNumber: false});
   *//*


}
*/
/**
 *
 * @param containerId
 * @param data
 * @param options
 * @constructor
 *//*

makina.Widget.prototype.DrawChartGeo = function(containerId, data, options){



    this.containerId = containerId;
    this.options = options;
    this.data = data;
*/
/*

    this.chart = new google.visualization.GeoChart(document.getElementById(this.containerId));

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

    this.dataTable = google.visualization.arrayToDataTable(this.data);
    this.chart.draw(this.dataTable, this.options);
    *//*

}

*/



/*
makina.Widget.Type= {

     AREA:'area',
     BAR:'bar',
     COLUMN:'column',
     LINE:'line',
     PIE:'pie',
     TABLE:'table',
     GEO:'geo'

}
*/






