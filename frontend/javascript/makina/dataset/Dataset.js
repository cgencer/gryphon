/**
 * Created with JetBrains WebStorm.
 * User: NMD
 * Date: 20.03.2013
 * Time: 17:49
 * To change this template use File | Settings | File Templates.
 */

goog.provide('makina.Dataset');



/**
 * @param {Array<Object>} dataset
 * @constructor
 */
makina.Dataset = function(dataset){

    this.dataset = dataset;
/*
    console.log("-------------------------------");
    console.log({"dataset":dataset});
    console.log("-------------------------------");

    goog.array.sort(dataset,function(a,b){
        return goog.string.numerateCompare(a['city'],b['city']);
    });

    console.log({"datasetsort":dataset});
    console.log("-------------------------------");

*/
}

/**
 *
 * @param {String} column
 *
 */
makina.Dataset.prototype.Sum = function(column){
    var sum = 0;
    goog.array.forEach(this.dataset,function(item){
        goog.object.forEach(item,function(v,k,o){
            if(k==column){
            if(!isNaN(o[k])){
                sum+=o[k];
            }
            }
        });
    });

    return sum;
}
/**
 *
 * @param {String}column
 *
 */
makina.Dataset.prototype.Min = function(column){
    var min = null;
    goog.array.forEach(this.dataset,function(item){
        goog.object.forEach(item,function(v,k,o){
            if(k==column){
                if(min== null)  min = o[k];
                else if(min>o[k]) min =o[k];
            }
        });
    });

    return min;

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
 * @param {String} byColumn
 * @param {Array<String>}columns
 *
 */
makina.Dataset.prototype.GroupBy = function(byColumn, columns){

    var tmp_arr=[];

    var s=new Date().getTime();

    var that = this;

    var sumGroupByItem=function(itm,items){

        goog.array.forEach(columns,function(k){

           var o=goog.object.get(itm,k);
           if(o==undefined){
                goog.object.set(itm,k,items[k]);
           }else{
               if(k=="timeslot")
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
            var vl=goog.object.get(item,byColumn);
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
        goog.object.set(o,byColumn,item[byColumn]);

        addObject(o,item);
        ///console.log("o="+JSON.stringify(o)+" -- "+JSON.stringify(item));

    });
    var t=new Date().getTime() - s;

    var o={
        "response":tmp_arr,
        "ms":t
    };


   return o;

}




/**
 * @param {Array<String>} byColumns
 * @param {Array<String>} columns
 *
 */
makina.Dataset.prototype.GroupBys = function(byColumns, columns){

    console.log("makina.Dataset.prototype.GroupBys");

    var firstRow = this.dataset[0];



    var responseColumns = byColumns;
    responseColumns=responseColumns.concat(columns);



    var tmp_arr=[];

    var s=new Date().getTime();

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

        addObject(o);

    });

    var tmp=[];
    for(var i in tmp_arr){
        tmp.push(tmp_arr[i]["item"]);
    }


/*
        goog.array.sort(tmp,function(a,b){
            return goog.string.caseInsensitiveCompare(a[byColumns[0]], b[byColumns[0]]);
        });
    */
       goog.array.stableSort(tmp,function(a,b){
            return goog.string.caseInsensitiveCompare(a[byColumns[0]], b[byColumns[0]]);
        });




    var t=new Date().getTime() - s;



    var o={
        "response":tmp,
        "ms":t
    };


    return o;

}



/**
 * @param {Array<Object>} dataset
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
 * @param {Array<Object>}tsArrayData
 *
 */
makina.Dataset.prototype.SumTS = function(tsArrayData){

    var TS={};

    TS["c"]=0;


    goog.array.forEach(tsArrayData,function(item,i){

        goog.object.forEach(item,function(v,yk,o){

            var totalC =0;
            if(v.c>0)
                totalC = v.c;



            if(goog.object.containsKey(TS,yk)){
                TS[yk]["c"]+= totalC;
                TS["c"]+= totalC;
            }else{

                var c={"c":totalC};
                goog.object.set(TS,yk, c);
                TS["c"]+= totalC;
            }
            goog.object.forEach(v,function(mts,mk,mo){
                if(mk!="c"){
                    if(goog.object.containsKey(TS[yk],mk) ){
                        TS[yk][mk]["c"]+=mts.c;
                    }else{
                        var cm={c:mts.c};
                        goog.object.set(TS[yk], mk, cm);
                    }
                }

                goog.object.forEach(mts,function(dts,dk,dObj){
                    if(dk!="c"){
                        if(goog.object.containsKey(TS[yk][mk],dk) ){
                            TS[yk][mk][dk]["c"]+=dts.c;
                        }else{
                            var cm={c:dts.c};
                            goog.object.set(TS[yk][mk], dk, cm);
                        }
                    }

                    goog.object.forEach(dts,function(hts,hk,hObj){
                        if(hk!="c"){
                            if(goog.object.containsKey(TS[yk][mk][dk],hk) ){
                                TS[yk][mk][dk][hk]["c"]+=dts.c;
                            }else{
                                var cm={c:dts.c};
                                goog.object.set(TS[yk][mk][dk], hk, cm);
                            }
                        }
                    });




                });


            });
        });
    });



    return TS;


}



