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
 * @param {string|null} consoleWidgetName
 * @constructor
 */
makina.Widget = function(options,consoleWidgetName){


    this.options = options;

    this.isRunning = true;

    this.fetchEvents = options["fetchOptions"];

    this.elConsole;

    this.consoleWidget = "";
    if(consoleWidgetName != undefined)
        this.consoleWidget = consoleWidgetName;

    if(this.consoleWidget != ""){
        this.elConsole = goog.dom.getElement(this.consoleWidget);
    }




    this._url = this.options["url"];
    this._refreshTime = this.options["refreshTime"] * 1000;

    this._requestJsonData = this.options["requestJsonData"];

    this._responseSuccessCallBack = this.options["responseSuccessCallBack"];
    this._responseErrorCallBack = this.options["responseErrorCallBack"];
    this._responseColumnsCallBack = this.options["responseColumnsCallBack"];



    /**
     *
     * @type {Array.<Object>}
     */
    this.responseData = [];
    this.dataRows =[];
    this.dataColumns = [];

    this._timer;

    this._utcTime =Math.round( new goog.date.DateTime(1999,1,1,10,10,10).getTime() /1000.0 );


    this.ds = new makina.Dataset(this.dataRows);

    this.Console("Start Widget","blue");

    this.RequestData();


}
/**
 *
 * @param {!Object} eventItem
 * @param {Function=} fnCallBack
 *
 */
makina.Widget.prototype.AddEvent = function(eventItem,fnCallBack){

    var isAdded = false;

    goog.array.forEach(this.fetchEvents,function(item){
        if(item["id"]==eventItem["id"])
            isAdded = true;
    });

    if(!isAdded){
        if(goog.isFunction(fnCallBack))
            eventItem["fetchCallBack"] = fnCallBack;
        this.fetchEvents.push(eventItem);
    }

    return !isAdded;

}
/**
 *
 * @param eventId
 *
 */
makina.Widget.prototype.RemoveEvent = function(eventId){

    var isAdded = false;
    var tmp =[];

    goog.array.forEach(this.fetchEvents,function(item){
        if(item["id"]==eventId)
            isAdded = true;
        else tmp.push(item);
    });

    if(isAdded){
        this.fetchEvents =tmp;
    }

    return isAdded;
}

/**
 *
 * @return {Object}
 *
 */
makina.Widget.prototype.GetRowColumns = function(){

    var response ={
        "columns":this.dataColumns
    }
    return response;
}

makina.Widget.prototype.GetResponseData = function(){

    var rsData={};
    rsData["columns"]= this.dataColumns;
    rsData["rows"]= this.dataRows;
    return rsData;

}

makina.Widget.prototype.StopListener = function(){
    this.isRunning = false;
    return true;
}

makina.Widget.prototype.StartListener = function(){
    this.isRunning = true;
    return true;
}


makina.Widget.prototype.GetColumnsObjects = function(columns){

    var response=[];
    var that = this;

    goog.array.forEach(columns,function(col){
        goog.array.forEach(that.dataColumns,function(colObj){
            if(colObj["cname"] == col)
                response.push(colObj);
        });
    });

    return response;


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
    try{
        if(this.consoleWidget !="" )
        if(this.elConsole != undefined){
            this.elConsole.appendChild(makina.dom.createElement("<div style='color:"+clr+" ' >"+msg+"</div>"));
        }
    }catch(e){

    }

}

makina.Widget.prototype._StartTimer = function(){

    var that = this;

    if(!goog.isNumber(this._refreshTime)){
        this._refreshTime = 0;
    }

    if(this._refreshTime>0){
        if(this._timer == null || this._timer == undefined){

            that.Console("Create Timer and Start Timer "+(that._refreshTime/1000) +" ms");

            that._timer = new goog.Timer(that._refreshTime);
            that._timer.start();
            goog.events.listen(that._timer, goog.Timer.TICK, function(){
               if(that.isRunning)
                    that.RequestData();
            });
        }else{
            that.Console("Start Timer...");
            this._timer.start();
        }
    }
}

/**
 *
 * @param {Object!}item
 * @private
 */
makina.Widget.prototype._ProcessFetchItems =  function(item){



    var that =  this;

    var s=goog.now();
    that.Console("Start "+item["name"]+" ProcessFetchItems","green");


    if(item["type"]== "sum"){

        var obj= this.ds.Sum(item["columns"]);
        obj["columns"] = this.GetColumnsObjects(obj["columns"]);
        if(item["fetchCallBack"]!= null){
            item["fetchCallBack"](obj);
        }

    }else if(item["type"]=="groupby"){


        var obj= this.ds.GroupBys(item["byColumns"]  , item["columns"], item["byValues"]);
        obj["columns"] = this.GetColumnsObjects(obj["columns"]);

        if(item["fetchCallBack"]!= null){
           item["fetchCallBack"](obj);
        }

    }else if(item["type"] == "keyvalues"){

        console.log("Call get key Values Array");
        var obj = this.ds.GetColumnValues(item['byColumns']);
        obj["columns"] = this.GetColumnsObjects(obj["columns"]);

        if(item["fetchCallBack"]!= null){
            item["fetchCallBack"](obj);
        }

    }else{

    }


    var ms = goog.now() - s;
    that.Console("End "+item["name"]+" ProcessFetchItems ms="+ms,"green");




}


/**
 *
 * @param {!Array.<Object>} response
 * @private
 */
makina.Widget.prototype._ResponseDataSuccessCallBack = function(response){


    var that = this;

    this.responseData = response;

    this.dataColumns = response["columns"];

    this.DecodeData(response["rows"]);

    var rsData={};
    rsData["columns"]= this.dataColumns;
    rsData["rows"]= this.dataRows;

    if(this._responseSuccessCallBack != null)
        (this._responseSuccessCallBack && this._responseSuccessCallBack(rsData));

    if(this._responseColumnsCallBack != null)
        (this._responseColumnsCallBack && this._responseColumnsCallBack(rsData));


    this.ds.SetDataset(this.dataRows);


    var t1 =goog.now();

    this.Console("Fetch Event Options Started","red");

    var i = 0, limit = 0, busy = false;

    if(this.fetchEvents != null)
      limit = this.fetchEvents.length;
    if(!goog.isNumber(limit))
        limit =0;

    if(limit>0){

        var processor = setInterval(function()
        {
            if(!busy){

                busy = true;
                var item = that.fetchEvents[i];
                that._ProcessFetchItems(item);
                if(++i == limit)
                {

                    that._StartTimer();

                    clearInterval(processor);
                }
                busy = false;
            }

        }, 200);

    }else{
        this._StartTimer();
    }


    this.Console("Fetch Event Options Endddddddddd","red");



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


    this._requestJsonData["utcTime"] = this._utcTime;

    //var url =this._url+"?request="+JSON.stringify(this._requestJsonData);
    var url =this._url+"?request="+ goog.json.serialize(this._requestJsonData);// JSON.stringify(this._requestJsonData);
    var jsonp = new goog.net.Jsonp(url);
    jsonp.setRequestTimeout(45*1000);//45 sn

   try{
       if(this.consoleWidget != "")
           this.elConsole.innerHTML ="";
   }catch (e){

   }


    this.Console("Request Data With JSONP","blue");

    this._RequestDataBeforeSend();

    var t1 = goog.now();

    jsonp.send({},
        function(response){

            var t2=goog.now() - t1;

            that.Console("Response JSONP Request ms="+t2);

            that._ResponseDataSuccessCallBack(response);

        },
        function(response){
           that._ResponseDataErrorCallBack(response);
        });
}


makina.Widget.prototype.EndOfProcess = function(){

    this._timer.start();

}


makina.Widget.prototype.DecodeData = function(responseDataRows){

    var that = this;



    if(responseDataRows.length == 0){

    }else{

        var dateTime = new goog.date.DateTime();
        this._utcTime =Math.round( dateTime.getTime() /1000.0 );
    }

   this.Console("Start decode code ","yellow");
    var t1 = goog.now();

   goog.array.forEach(responseDataRows,function(rowItem,i){
           goog.object.forEach(rowItem,function(v,k,o){
               if(goog.string.startsWith(k,"timeslot"))
                   responseDataRows[i][k]= goog.json.parse(Base64.decode(responseDataRows[i][k]));
           });
           that.UpdateDataRow(rowItem);
   });

    var t2 = goog.now() - t1;

    this.Console("End of decode code ms="+t2,"yellow");



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
        goog.array.forEach(that.dataRows,function(item,i){
           if(item["_rowKey"] == newRowItem["_rowKey"]){
              that.dataRows[i] = newRowItem;
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
        that.dataRows.push(newRowItem);
    }



}





makina.Widget.prototype.Draw = function(){


/*

    if(this.type == makina.Widget.Type.AREA){



    }else if(this.type == makina.Widget.Type.BAR){



    }else if(this.type == makina.Widget.Type.COLUMN){



    }else if(this.type == makina.Widget.Type.LINE){



    }else if(this.type == makina.Widget.Type.PIE){


        var dataRows = [
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
 * @param dataRows
 * @param options
 *
 *//*


makina.Widget.prototype.DrawChartArea = function(containerId, dataRows, options){

    this.containerId = containerId;
    this.options = options;
    this.dataRows = dataRows;

    this.chart = new google.visualization.AreaChart(document.getElementById(this.containerId));
    this.dataTable = google.visualization.arrayToDataTable(this.dataRows);
    this.chart.draw(this.dataTable, this.options);
}

*/
/**
 *
 * @param containerId
 * @param dataRows
 * @param options
 *
 *//*

makina.Widget.prototype.DrawChartBar = function(containerId, dataRows, options){

    this.containerId = containerId;
    this.options = options;
    this.dataRows = dataRows;

    this.chart = new google.visualization.BarChart(document.getElementById(this.containerId));
    this.dataTable = google.visualization.arrayToDataTable(this.dataRows);
    this.chart.draw(this.dataTable, this.options);
}

*/
/**
 *
 * @param containerId
 * @param dataRows
 * @param options
 *
 *//*

makina.Widget.prototype.DrawChartColumn = function(containerId, dataRows, options){

    this.containerId = containerId;
    this.options = options;
    this.dataRows = dataRows;

    this.chart = new google.visualization.ColumnChart(document.getElementById(this.containerId));
    this.dataTable = google.visualization.arrayToDataTable(this.dataRows);
    this.chart.draw(this.dataTable, this.options);
}

*/
/**
 *
 * @param containerId
 * @param dataRows
 * @param options
 *
 *//*

makina.Widget.prototype.DrawChartLine = function(containerId, dataRows, options){

    this.containerId = containerId;
    this.options = options;
    this.dataRows = dataRows;

    this.chart = new google.visualization.LineChart(document.getElementById(this.containerId));
    this.dataTable = google.visualization.arrayToDataTable(this.dataRows);
    this.chart.draw(this.dataTable, this.options);

}

*/
/**
 *
 * @param containerId
 * @param dataRows
 * @param options
 *
 *//*

makina.Widget.prototype.DrawChartPie = function(containerId, dataRows, options){

    this.containerId = containerId;
    this.options = options;
    this.dataRows = dataRows;

    this.chart = new google.visualization.PieChart(document.getElementById(this.containerId));
    this.dataTable = google.visualization.arrayToDataTable(this.dataRows);
    this.chart.draw(this.dataTable, this.options);

}

*/
/**
 *
 * @param containerId
 * @param dataRows
 * @param options
 *
 *//*

makina.Widget.prototype.DrawChartTable = function(containerId, dataRows, options){

    this.containerId = containerId;
    this.options = options;
    this.dataRows = dataRows;
*/
/*
    this.chart = new google.visualization.PieChart(document.getElementById(this.containerId));
    this.dataTable = google.visualization.arrayToDataTable(this.dataRows);
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






