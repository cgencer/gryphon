/**
 * Created with JetBrains WebStorm.
 * User: NMD
 * Date: 18.01.2013
 * Time: 11:57
 * To change this template use File | Settings | File Templates.
 */
 var _wizardCursor = 0;
 var _wizardStatus = false;

(function(makinaWizard, $, undefined){

    var stepsLinkItemId = ["mOrganizations", "mUsers", "mApplications", "mUserRolesForApps", "mUserTokenForApps"];

    makinaWizard.Start = function(){

        if(!_wizardStatus){

            var pointer=$("#management-menu").offset();
            var l=pointer.left+50;
            var t=pointer.top+20;
            $("#wizard-steps-content").show(500);

            $("#icon-hand-finder").animate({
                "top": t+"px",
                "left": l+"px"
            },900);

            if(!$("#management-submenu").is(":visible") )
                $("#management-menu").trigger("click");

            setTimeout(makinaWizard.NextStep,1300);
            _wizardStatus = true;
        }else{
            makinaWizard.Stop();
        }
    }

    makinaWizard.Stop = function(){
        if(_wizardStatus){
            $("#wizard-steps-content").hide(500);
            $("#icon-hand-finder").removeAttr("style");
            $("#icon-hand-finder").attr("style","position: fixed;z-index: 60;right: 10px;bottom: 10px;cursor: pointer;");
            $(".wizard-steps .step").each(function(){
               $(this).removeClass('completed-step');
               $(this).removeClass('active-step');
            });
            _wizardStatus = false;
            _wizardCursor = 0;
        }
    }


    makinaWizard.NextStep = function(){

        _wizardCursor++;

        if(_wizardCursor>stepsLinkItemId.length){
            makinaWizard.Stop();
        }else{
            makinaWizard.CallStepWithNumber(_wizardCursor);
        }
    }

    makinaWizard.PrevStep = function(){

        _wizardCursor--;
        makinaWizard.CallStepWithNumber(_wizardCursor);
    }

    makinaWizard.CallStepWithNumber = function(step){

        var prevEl = null;
        var activeEl = null;
        var nextEl = null;
        var maxStep = stepsLinkItemId.length;
        var cursor = step-1;

        if(cursor >0)
            prevEl = $("#wizard-steps > .step")[(cursor-1)];
        if(cursor < maxStep)
            activeEl = $("#wizard-steps > .step")[(cursor)];
        if(cursor < maxStep)
            nextEl = $("#wizard-steps > .step")[(cursor+1)];

        if(activeEl != null)
            $(activeEl).addClass('active-step');

        if(prevEl != null)
            $(prevEl).removeClass('active-step').addClass('completed-step');

        if(nextEl != null)
            $(nextEl).removeClass('active-step').removeClass('completed-step');

        var pointer=$("#"+stepsLinkItemId[cursor]).offset();

        var l=pointer.left+50;
        var t=pointer.top+10;

        $("#icon-hand-finder").animate({
            "top": t+"px",
            "left": l+"px",
            "bottom": "auto",
            "right": "auto"
        },1000,function(){
            $("#"+stepsLinkItemId[cursor]).trigger("click");
            $("#icon-hand-finder").hide(1000,function(){
                $("#icon-hand-finder").removeAttr("style");
                $("#icon-hand-finder").attr("style","position: fixed;z-index: 60;right: 10px;bottom: 10px;cursor: pointer;");
            });

        });




    }







}(window.makinaWizard = window.makinaWizard || {}, jQuery));
