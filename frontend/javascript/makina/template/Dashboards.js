/**
 * Created with IntelliJ IDEA.
 * User: NMD
 * Date: 21.02.2013
 * Time: 15:35
 * To change this template use File | Settings | File Templates.
 */

goog.provide('makina.template.Dashboards');



makina.template.Dashboards.GetContentWrapper = function(){

    var html='' +
        '<table border="0" style="width: 99%;height: 100%;">' +
            '<tr><td class="project-main-container">' +
        '       <div id="project-main-container">' +
                '<div id="project-main-container-header">' +
        '  <div id="iconbuttons"></div> ' +
                    '<input id="project-btn-models" class="button" type="button" value="Models" /> ' +
                    '<input id="project-btn-actions" class="button" type="button" value="Actions" /> ' +
                    '<input id="project-btn-scripts" class="button" type="button" value="Scripts" /> ' +
                '</div>' +
        '       <div id="project-main-container-body"></div>' +
        '       </td>' +
        '       <td class="editor-main-container">' +
                ''  +
            '</div>'+
            '<div id="editor-main-container"></div>' +
        '</td></tr>' +
        '</table> ';
    return html;

}


makina.template.Dashboards.GetProjectListMenu = function(data){

    var html ="";

    if(data.length>0){
        goog.array.forEach(data,function(item,i){
            html+='<li id="'+item.id+'"><a href="#"><span>' + item.name + '</span></a></li>';
        });
    }

    html+='<li class="divider"><a href="#"><span></span></a></li>';
    html+='<li><a href="#"><span>Add Project</span></a></li>';

    return html;

}
