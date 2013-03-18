$(document).ready(function(){

    $(".menu-item").click(function(){

        if($(this).next(".sub-menu").hasClass('sub-menu')){

            $(".sub-menu").hide();
            $(".menu-item").removeClass("active");

            if($(this).next(".sub-menu").is(':visible')){
                $(this).removeClass("active");
                $(this).next(".sub-menu").hide();
            }else {
                $(this).next(".sub-menu").show();
                $(this).addClass("active");
            }
        }
    });

    $(".makina-menu").each(function(){
        var idd = this.id;
        $("#"+idd+" .makina-select-box-options> li a").click(function(){
            var val=$(this).attr("rel");
            var txt=$(this).text();
            $("#"+idd).find('.makina-selected').text(txt);
            $("#"+idd).find('.makina-menu-hidden').text(val);
        });
    });

    $("#date-start").datepicker();
});
