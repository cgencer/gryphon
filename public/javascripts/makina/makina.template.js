$(document).ready(function () {

    GetListOfEnumsForMakinaEnums();
    GetWelcomeGetSystemInfo();

/*
    $.ajaxSetup({
        global:true,
        timeout:45000,// 45 sn
        beforeSend: function(){
//            $("#icon-wait-gif").show();
        },
        complete: function(){
//            $("#icon-wait-gif").hide();
        }
    });
*/

/*
	$("#sidebar-menu>.item").click(function () {
		var elNext = $(this).next(),
			elNextSubmenuItems = elNext.find(".item"),
			isElActive = $(this).hasClass("active");

		if (!isElActive) {
			$(".sidebar-submenu").not(elNext).slideUp();
		}

		if (elNext.hasClass("sidebar-submenu") && !(isElActive)) {
			elNext.slideToggle();
		} else {
			$("#sidebar-menu>.item").removeClass("active");
			$(this).addClass("active");
		}

		if ($(this).attr("href")) {
			$("#sidebar-app-select").removeClass("disabled");
		}
        switch(this.id){
            case "mDashboards":
                GetDashBoardsList();
                break;
            case "mWelcome":
                GetWelcomeGetSystemInfo();
                break;
        }

	});

	$(".sidebar-submenu .item").click(function () {

		if ($(this).attr("href") == "#/manage/apps") {
			$("#sidebar-app-select").addClass("disabled");
			$("#sidebar-app-select").removeClass("active");
		} else {
			$("#sidebar-app-select").removeClass("disabled");
		}

		if ($("#app-nav").offset().left == 201) {
			$("#app-nav").animate({ left: '31px' }, { duration: 500, easing: 'easeInBack' });
			$("#sidebar-app-select").removeClass("active");
		}

		$(".sidebar-submenu .item").removeClass("active");

		$("#sidebar-menu .item").removeClass("active");
		$(this).parent().prev(".item").addClass("active");
        $(this).addClass("active");

		switch (this.id) {
			case "mOrganizations":
				GetListOfOrganizations();
				break;
			case "mUsers":
				GetUserRolesForUsers();
				GetListOfOrganizationsForUserNavigationPanel();
				break;
			case "mRoles":
				GetUserRoles();
				break;
			case "mApplications":
				GetApplications();
				break;
			case "mChannels":
				GetChannels();
				break;
			case "mUserRolesForApps":
				GetOrganizationsForUserRolesForApplication();
				GetUserRolesForUserRolesForApplication();
				GetListOfApplicationsForUserNavigationPanel();
				break;
			case "mActions":
				GetListOfApplicationsForActionsNavigationPanel();
				break;
            case "mUserTokenForApps":
                //copied code
                GetOrganizationsForUserTokensForApplication();
                GetListOfApplicationsForUserTokenNavigationPanel();
                break;
            case "mCampaigns":
                GetListOfApplicationsForCampaignNavigationPanel();
                break;
            case "mMakilinks":

                GetListOfApplicationsForMakilinksNavigationPanel();

                break;
			default:
				break;
		}
	});

	$("#sidebar-app-select").click(function () {

		if ($(this).hasClass("active")) {
			$(this).removeClass("active");
		} else {
			$(this).addClass("active");
		}

		$("#app-nav").show();
		var left = $("#app-nav").offset().left;

		if (left == 201) {
			$("#app-nav").animate({ left: '31px' }, { duration: 500, easing: 'easeInBack' });
		} else {
			$("#app-nav").animate({ left: '201px' }, { duration: 500, easing: 'easeOutBack' });
		}

	});

    $("#reveal-menu").click(function(){
        if($("#sidebar-bottom-container .menu").is(":visible"))
            $("#sidebar-bottom-container .menu").hide();
        else
            $("#sidebar-bottom-container .menu").show();
    });
*/
});

