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



    goog.array.forEach(this.dataset,function(item){
       var o={};
        goog.object.set(o,byColumn,item[byColumn]);

        goog.array.forEach(tmp_arr,function(itm){

            var addObj=goog.object.get(itm,byColumn,item[byColumn]);
            console.log(addObj);

        });

    });

}


