/*
A countly view is defined as a page corresponding to a url fragment such 
as #/manage/apps. This interface defines common functions or properties 
the view object has. A view may override any function or property.
*/
var makinaView = Backbone.View.extend({
	template: null, //handlebars template of the view
	templateData: {}, //data to be used while rendering the template
	el: $('#content'), //jquery element to render view into
	initialize: function () {	//compile view template
		this.template = Handlebars.compile($("#template-organizations").html());
	},
	render: function (eventName) {	//backbone.js view render function
		this.renderCommon();
		return this;
	},
	renderCommon: function (isRefresh) { }, //common render function of the view
	refresh: function () {	//resfresh function for the view called every 10 seconds by default
		return true;
	},
	close: function () {
		$(this.el).unbind();
		$(this.el).remove();
	}
});

var Template = function () {
	this.cached = {};
};
var T = new Template();

$.extend(Template.prototype, {
	render: function (name, callback) {
		if (T.isCached(name)) {
			callback(T.cached[name]);
		} else {
			$.get(T.urlFor(name), function (raw) {
				T.store(name, raw);
				T.render(name, callback);
			});
		}
	},
	renderSync: function (name, callback) {
		if (!T.isCached(name)) {
			T.fetch(name);
		}
		T.render(name, callback);
	},
	prefetch: function (name) {
		$.get(T.urlFor(name), function (raw) {
			T.store(name, raw);
		});
	},
	fetch: function (name) {
		// synchronous, for those times when you need it.
		if (!T.isCached(name)) {
			var raw = $.ajax({ 'url': T.urlFor(name), 'async': false }).responseText;
			T.store(name, raw);
		}
	},
	isCached: function (name) {
		return !!T.cached[name];
	},
	store: function (name, raw) {
		T.cached[name] = Handlebars.compile(raw);
	},
	urlFor: function (name) {
		//return "/resources/templates/"+ name + ".handlebars";
		return name + ".html";
	}
});

window.organizationsView = makinaView.extend({
	initialize: function () {
		this.template = Handlebars.compile($("#template-organizations").html());
	},
	pageScript: function () {
		var self = this;
	},
	renderCommon: function (isRefresh) {
		var organizationData = makinaOrganization.getOrganizationData();

		this.templateData = {
			//"page-title": organizationData.eventName.toUpperCase(),
			"logo-class": "organizations",
			"organizations": organizationData.getOrganizations
		};

		if (!isRefresh) {
			$(this.el).html(this.template(this.templateData));

			this.pageScript();
			$(".sortable").stickyTableHeaders();

			var self = this;
			$(".sortable").tablesorter({
				sortList: this.sortList,
				headers: {
					0: { sorter: 'customDate' }
				}

			}).bind("sortEnd", function (sorter) {
				self.sortList = sorter.target.config.sortList;
			});

		}
	},
	refresh: function (eventChanged, segmentationChanged) {
	}
});


var AppRouter = Backbone.Router.extend({
	routes: {
		"/": "dashboard",
		"/management/organizations": "organizations",
		"*path": "main"
	},
	readyToRender: false,
	activeView: null, //current view
	dateToSelected: null, //date to selected from the date picker
	dateFromSelected: null, //date from selected from the date picker
	activeAppName: '',
	activeAppKey: '',
	main: function () {
		this.navigate("/", true);
	},
	dashboard: function () {
		this.renderWhenReady(this.dashboardView);
	},
	organizations: function () {
		this.renderWhenReady(this.organizationsView);
	},
	refreshActiveView: function () { }, //refresh interval function
	renderWhenReady: function (viewName) { //all view renders end up here
		this.activeView = viewName;
		var self = this;
		if (this.readyToRender) {
			viewName.render();
		} else {
			$.when(makinaOrganization.initialize()).then(function () {
				self.readyToRender = true;
				self.activeView.render();
			});
		}
	},
	initialize: function () { //initialize the dashboard, register helpers etc.

		this.organizationsView = new organizationsView();

		var self = this;

		$(document).ready(function () {

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
			});

			$(".sidebar-submenu .item").click(function () {

				if ($(this).hasClass("disabled")) {
					return true;
				}

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
				$(this).addClass("active");
				$(this).parent().prev(".item").addClass("active");
			});

			$("#sidebar-app-select").click(function () {

				if ($(this).hasClass("disabled")) {
					return true;
				}

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
		});
	},
	localize: function () {
	},
	pageScript: function () { //scripts to be executed on each view change
	}
});

var app = new AppRouter();
Backbone.history.start();