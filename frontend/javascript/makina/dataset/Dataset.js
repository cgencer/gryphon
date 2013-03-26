/**
 * Created with JetBrains WebStorm.
 * User: NMD
 * Date: 20.03.2013
 * Time: 17:49
 * To change this template use File | Settings | File Templates.
 */

goog.provide('makina.Dataset');



/**
 * @param {!Array.<Object>} dataset
 * @constructor
 */
makina.Dataset = function(dataset){

    this.dataset = dataset;


}
/**
 *
 * @param {!Array.<Object>} dataset
 *
 */
makina.Dataset.prototype.SetDataset = function(dataset){
    this.dataset = dataset;
}


//date ddMMyyyy time HHmmss timezone +0200 fln zaten



/**
 *
 * @param {Array.<String>} columns
 *
 */
makina.Dataset.prototype.Sum = function(columns){

    var response = {
        "sum":0,
        "timeslot":{}
    };

    var s = goog.now();

    console.log("makina.Dataset.prototype.Sum");

    var sum =0;
    var TS ={"c":0};

    var that = this;

    goog.array.forEach(this.dataset,function(item){
        goog.object.forEach(item,function(v,k,o){

            goog.array.forEach(columns,function(col){

                if(goog.string.startsWith(col,"timeslot")){

                    TS[col] = that.SumTS([TS[col],o[col]]);


                }else{
                    if(!isNaN(o[col])){
                        sum+=o[col];
                    }
                }
            });

        });
    });

    goog.array.forEach(columns,function(col){
        TS["c"] += TS[col]["c"];
    })


    response["sum"]=sum;
    response["timeslot"] = TS;

    var t=goog.now() - s;

    var o={
        "response":response,
        "ms":t
    };

    return o;
}
/**
 *
 * @param {String}column
 *
 */
makina.Dataset.prototype.Min = function(column){
    var min = null;

    var response = {
        "min": null
    };

    goog.array.forEach(this.dataset,function(item){
        goog.object.forEach(item,function(v,k,o){
            if(k==column){
                if(min== null)  min = o[k];
                else if(min>o[k]) min =o[k];
            }
        });
    });

    response["min"] = min;

    return response;

}
/**
 *
 * @param {String}column
 *
 */
makina.Dataset.prototype.Max = function(column){
    var max = null;
    goog.array.forEach(this.dataset,function(item){
        goog.object.forEach(item,function(v,k,o){
            if(k==column){
                if(max== null)  max = o[k];
                else if(max<o[k]) max =o[k];
            }
        });
    });
    return max;

}

/**
 * @param {!String} byColumn
 * @param {Array.<String>}columns
 *
 */
makina.Dataset.prototype.GroupBy = function(byColumn, columns){

    var tmp_arr=[];


    var s= goog.now();

    var that = this;

    var sumGroupByItem=function(itm,items){

        goog.array.forEach(columns,function(k){

           var o=goog.object.get(itm,k);
           if(o==undefined){
                goog.object.set(itm,k,items[k]);
           }else{
               if(goog.string.startsWith(k,"timeslot"))
                   itm[k] = that.SumTS([itm[k],items[k]]);
               else
                itm[k]=itm[k] + items[k];
           }
        });

        return itm;
    }

    var addObject=function(obj,items){

        var isAdded = false;

        for(var i in tmp_arr){
            var item = tmp_arr[i];
            var getItemByColumn = byColumn.toString();
            var vl=goog.object.get(item,getItemByColumn);
            if(obj[byColumn]==vl){
                tmp_arr[i]=sumGroupByItem(item,items);
                isAdded = true;
            }
        }

        if(!isAdded){

            goog.array.forEach(columns,function(k){
                goog.object.set(obj,k,items[k]);
            });
            tmp_arr.push(obj);
        }
    }


    goog.array.forEach(this.dataset,function(item){
       var o={};
        var getItemByColumn = byColumn.toString();
        goog.object.set(o,getItemByColumn,item[byColumn]);

        addObject(o,item);

    });

    var t=goog.now() - s;

    var o={
        "response":tmp_arr,
        "ms":t
    };


   return o;

}




/**
 * @param {Array.<String>} byColumns
 * @param {Array.<String>} columns
 * @param {Array.<String>=} byValues
 *
 */
makina.Dataset.prototype.GroupBys = function(byColumns, columns, byValues){



    var responseColumns = byColumns;
    responseColumns=responseColumns.concat(columns);

    if(!goog.isDef(byValues))
        byValues = null;



    var tmp_arr=[];

    var s=goog.now();

    var that = this;

    var sumGroupByItem=function(itm,items){



        goog.array.forEach(columns,function(k){
            var o=goog.object.get(itm,k);

            if(o==undefined){
                goog.object.set(itm,k,items[k]);
            }else{
                if(goog.string.startsWith(k,"timeslot")){
                    itm[k] = that.SumTS([itm[k],items[k]]);
                } else{
                    itm[k]=itm[k] + items[k];
                }
            }
        });

        return itm;
    }

    var addObject=function(obj){

        var isAdded = false;

        for(var i in tmp_arr){
            var item = tmp_arr[i];
            if(item["val"]==obj["val"]){
                tmp_arr[i]["item"]=sumGroupByItem(item["item"],obj["item"]);
                isAdded = true;
            }
        }

        if(!isAdded){
            tmp_arr.push(obj);
        }
    }



    var isEquals = function(item){

        var bool = true;

        goog.array.forEach(byColumns,function(columnKey,i){

            if( byValues[i]!=null && item[columnKey] != byValues[i])
                bool = false;
        });

        return bool;
    }




    goog.array.forEach(this.dataset,function(item){

        var o={"groups":{"key":"","val":""},"item":{}};



       var arr_vl=[];
        goog.array.forEach(byColumns,function(columnKey){
            var vv=goog.object.getValueByKeys(item,columnKey);
            arr_vl.push(vv);
        });
        o["val"]=arr_vl.join("|");
        var newItem ={};
        goog.array.forEach(responseColumns,function(rCol){
           goog.object.set(newItem,rCol,item[rCol]);
        });

        o["item"]=newItem;

       //// console.log(newItem);

        if(byValues!=null){

            if(isEquals(newItem)){
                addObject(o);
            }

        }else{
            addObject(o);
        }


    });

    var tmp=[];
    for(var i in tmp_arr){
        tmp.push(tmp_arr[i]["item"]);
    }



       goog.array.stableSort(tmp,function(a,b){
            return goog.string.caseInsensitiveCompare(a[byColumns[0]], b[byColumns[0]]);
        });

    var t=goog.now() - s;



    var o={
        "response":tmp,
        "ms":t
    };


    return o;

}


/**
 *
 * @param {Array.<String>} columns
 *
 */
makina.Dataset.prototype.GetColumnValues = function(columns){



    columns = columns.sort();

    var colKeys ={};

    var t1 = goog.now();

    var addValuesToArray = function(column, val){

        var isAdded = false;

        goog.array.forEach(colKeys[column],function(itm){
            if(itm == val)
                isAdded = true;
        });

        if(!isAdded)
            colKeys[column].push(val);

    }




    goog.array.forEach(columns,function(itm){
        goog.object.set(colKeys,itm,[]);
    });

    console.log("makina.Dataset.prototype.GetColumnValues");

    console.log(colKeys);

    goog.array.forEach(this.dataset,function(item){

        goog.array.forEach(columns,function(col){
            addValuesToArray(col,item[col]);
        });
    });



    goog.array.forEach(columns,function(col){
        goog.array.stableSort(colKeys[col],function(a,b){
            return goog.string.caseInsensitiveCompare(a, b);
        });
    });




    var t = goog.now() - t1;


    var o={
        "response":colKeys,
        "ms":t
    };


    return o;
}


/**
 * @param {Array.<Object>} dataset
 * @param {String} tableId
 *
 */
makina.Dataset.prototype.GetDataTable = function(dataset,tableId){

    var html ='';

    var firstRow = dataset[0];

    html+='<table border="1" id="'+tableId+'"  >' +
        '   <thead>' +
        '    <tr>';
            goog.object.forEach(firstRow,function(v,k,o){
               html+='<th>'+k+'</th>';
            });
    html+='</tr>   ' +
        '</thead>' +
        '<tbody>';

        goog.array.forEach(dataset,function(item,i){
           html+='<tr>';
            goog.object.forEach(firstRow,function(v,k,o){

                var val ="";

                if(goog.string.startsWith(k,"timeslot")){
                    if(item[k]["c"]>0)
                        val= item[k]["c"];
                    var totalYears =0;

                    goog.object.forEach(item[k],function(vv,kk,oo){
                       if(item[k][kk]["c"]>0) totalYears+= item[k][kk]["c"];
                    });

                    val =val+" = "+totalYears;

                } else val =item[k];

                html+='<td>'+val+'</td>';
            });
            html+='</tr>'
        });

    html+='</tbody>' +
        '</table>';

    return html;



}


/**
 *
 * @param {Object} data
 * @param {!Object} mDateStart
 * @param {Object=} mDateEnd
 *
 */
makina.Dataset.prototype.FilterTimeSlot = function(data, mDateStart, mDateEnd){

    var sYear  = null;
    var sMonth = null;
    var sDay   = null;
    var sHour  = null;

    var eYear  = null;
    var eMonth = null;
    var eDay   = null;
    var eHour  = null;

    if(mDateEnd == undefined){
        mDateEnd = mDateStart;
    }



        sYear  = mDateStart.getYear();
        sMonth = mDateStart.getMonth();
        sDay   = mDateStart.getDay();
        sHour  = mDateStart.getHours();



        eYear  = mDateEnd.getYear();
        eMonth = mDateEnd.getMonth();
        eDay   = mDateEnd.getDay();
        eHour  = mDateEnd.getHours();


    var TS = {};
    TS["c"]=0;



   for(var y=sYear; y<=eYear; y++){
       TS[y]=data[y];
       for(var m=sMonth; m<=eMonth; m++){
           TS[y][m]=data[y][m];
           for(var d=sDay; d<=eDay; d++){
               TS[y][m][d] = data[y][m][d];
               for(var h=sHour; h<=eHour; h++){
                   TS[y][m][d][h] = data[y][m][d][h];
               }
           }
       }
   }


   return TS;
}


/**
 *
 * @param {Array.<Object>}tsArrayData
 *
 */
makina.Dataset.prototype.SumTS = function(tsArrayData){

    var TS={};

    TS["c"]=0;



    goog.array.forEach(tsArrayData,function(item,i){

        //loop for years
        goog.object.forEach(item,function(v,yk,o){


            var totalC =0;
            if(v["c"]>0)
                totalC = v["c"];



            if(goog.object.containsKey(TS,yk)){
                TS[yk]["c"]+= totalC;
                TS["c"]+= totalC;
            }else{

                var c={"c":totalC};
                goog.object.set(TS,yk, c);
                TS["c"]+= totalC;
            }

            //loop for months
            goog.object.forEach(v,function(mts,mk,mo){
                if(mk!="c"){
                    if(goog.object.containsKey(TS[yk],mk) ){
                        TS[yk][mk]["c"]+=mts["c"];
                    }else{
                        var cm={"c":mts["c"]};
                        goog.object.set(TS[yk], mk, cm);
                    }
                }
                //loop of days
                goog.object.forEach(mts,function(dts,dk,dObj){
                    if(dk!="c"){
                        if(goog.object.containsKey(TS[yk][mk],dk) ){
                            TS[yk][mk][dk]["c"]+=dts["c"];
                        }else{
                            var cm={"c":dts["c"]};
                            goog.object.set(TS[yk][mk], dk, cm);
                        }
                    }
                    //loop of hours
                    goog.object.forEach(dts,function(hts,hk,hObj){
                        if(hk!="c"){
                            if(goog.object.containsKey(TS[yk][mk][dk],hk) ){
                                TS[yk][mk][dk][hk]["c"]+=dts["c"];
                            }else{
                                var cm={"c":dts["c"]};
                                goog.object.set(TS[yk][mk][dk], hk, cm);
                            }
                        }
                    });//end of loop hours
                });// end of loop days
            });//end of loop months
        });//end of loop years

    });



    return TS;


}



