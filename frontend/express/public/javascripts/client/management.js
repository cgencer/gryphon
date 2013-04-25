var GryphonManagement = (function(GryphonManagement, $, undefined){

	if (amplify.store('uid') === '') {
		window.location.href = 'login';
	};

	function globalFail(err) {
		console.log('error received:\n'+err);
	};
	function initModel () {
		cuteNSexy.switchToLoxo();
		if(Object.keys(amplify.store('paths')).length>0){cuteNSexy.setPaths(amplify.store('paths'));}else{
			console.log('Login / Paths object not found!!!');
		}
		if(Object.keys(amplify.store('tableset')).length>0){cuteNSexy.setPaths(amplify.store('tableset'));}else{
			console.log('Table settings object not found!!!');
		}
		if(Object.keys(amplify.store('objectset')).length>0){cuteNSexy.setPaths(amplify.store('objectset'));}else{
			console.log('Object sets not found!!!');
		}
		if(Object.keys(amplify.store('dictionary')).length>0){cuteNSexy.setDictionary(amplify.store('dictionary'));}else{
			console.log('Login / Dictionary object not found!!!');
		}
		console.dir(amplify.store('dictionary'));
		console.log('User ID is: '+amplify.store('uid'));
		console.log('Sess ID is: '+amplify.store('sid'));

		if(amplify.store('sid')!=''){cuteNSexy.setSessionID(amplify.store('sid'));}
		else{amplify.store('sid',cuteNSexy.getSessionID());}

		cuteNSexy.runChainedEvents([ {'cmd': 'GetMenuItems', 'success': sMenuReceived,
										'payload': {'userId':amplify.store('uid')} } ], globalFail);

		cuteNSexy.switchToHandsome();
		function sMenuReceived(package) {
			console.dir(package);
		}
	};initModel();

	var tableSets = [];
	var tsIndex = 0;
	var theLoad = {};
	var whichTable = '';
	var whichApp = '';
	var theModal = '';
	var userDidSelect = false;
	var _ts = this;
	var _role = {};
	var orgs = [];
	var apps = [];
	var camps = [];
	XDate.parsers.push(parseDMY);

	$(document).ready(function() {

		objectSets = amplify.store('objectset');
		tableSets = amplify.store('tableset');

		cuteNSexy.runChainedEvents([
			{'cmd': 'ListOrganizations', 'payload': {}, 'success': fillinOrganizations},
			{'cmd': 'ListApps', 'payload': {}, 'success': fillinApps},
			{'cmd': 'ListChannel', 'payload': {}, 'success': fillinChannels},
			{'cmd': 'ListRoles', 'payload': {}, 'success': function (r) {
				if(type(r) == 'object') {
					_role = r;
				}else if(type(r) == 'array') {
					for(var ri in r) {
						if(r[ri].roleId === '0.00000C@ROLE'){
							_role = r[ri];
						}
					}
				}
			}}
		], globalFail);

		$('div.subLinks').each( function () {
//			$('#managementModal').clone().appendTo('body').attr('id', $(this).attr('id')+'Modal');
		});
		$(document).on('click', '.subLinks.appLinks' , function () {
//			$('div#sideBarApps.accordion').collapse('toggle');
			whichApp = $(this).attr('id');
			if(whichApp != '') {
				cuteNSexy.runChainedEvents([
					{'cmd': 'ListCampaign', 'payload': {'applicationId': whichApp}, 'success': fillinCampaigns},
				], globalFail);
			}
			$('#sideBarApps').collapse('toggle');
			$('#sideBarManagement').collapse('show');
		});
		$(document).on('click', '.subLinks.managementLinks' , function () {
			$('#rightSide').html('<table id="manager"></table><div id="thePager"></div>');
			whichTable = $(this).attr('id');
			$('#whichTable').val(whichTable);
			console.log('whattafuck! '+whichTable);
			if(whichTable === 'managementMakilinks' && whichApp === '') {
				$('.selector').accordion( "option", "active", 2 );
			}
			createTableset(whichTable, '#manager', {});
		});
		$(document).on('change', '#orgPulldown' , function () {
			console.log('changed orga...');
			cuteNSexy.runChainedEvents([{'cmd': 'ListUsers', 'payload': {'orgId': $("#orgPulldown").val()}, 'success': fillinUsersofOrga}], globalFail);
		});
		$(document).on('change', '#campPulldown' , function () {
			console.log('changed campaign... >'+$("#campPulldown").val());
			cuteNSexy.runChainedEvents([{'cmd': 'ListMakilinks', 'payload': {'campaignId': $("#campPulldown").val(), 'routerEnable': false}, 'success': fillinMakilinks}], globalFail);
		});
		$(document).on('click', '.addRow' , function () {
			$('#cloneMe').before( $('#cloneMe').clone() );
			$('button.addRow:not(:last)').each( function (i, v) {
				$(this).replaceWith('<button type="button" class="removeRow">-</button>');
			})
		});
		$(document).on('click', '.removeRow' , function () {
			$(this).parents('tr').remove();
		});
		$(document).on('blur', '#email' , function (e) {
			ui = _.values(getDataObject('UserInfo'))[0];
			ui.name = $('#name').val();
			ui.username = $('#name').val().latinise().replace(/\s/, '');
			ui.email = $('#email').val();
			ui.password = '123456';
			ui.primaryRole = _role;
			ui.orgId = $("#orgId").val();
			if(!_ts.userDidSelect) {
				_ts.userDidSelect = false;
				cuteNSexy.runChainedEvents([{
					'cmd': 'AddUpdateUser', 'payload': {'command':1, 'info': ui}, 'success': createdUser}], globalFail);
			}
		});
		$(document).on('click', 'button.addNew' , function (e) {
			$('#'+whichTable+'Modal').modal('show');
		});
		$(document).on('click', '.ui-th-column' , function (e) {
			console.log('sorted...');
			onSort();
		});
		$(document).on('click', '#addChannel' , function () {
			$('#channelAdding').css('display', 'block');
		});
		$(document).on('click', '#addCampaign' , function () {
			$('#campaignAdding').css('display', 'block');
		});
			
/*
_type					"AppInfo"
appId					"0.00004L@APP"
appToken				"AD90E34RT6HU12DHR56@0E3E"
appType					0
appname					"asfghasfhasfhasfha"
countlyApiKey			""
countlyAppId			null
countlyAppKey			""
countlyUrl				""
description				"asdgasdgas"
googleAnalyticsKey		"asfgasfgasf"
iconUrl					""
marketUrl				"asdgasdga"
platform				5
registerActionId		"0"
*/
		$(document).on('click', '.editButton' , function () {
/*MultipleSelectMode
			selectedIds = $("#manager").jqGrid('getGridParam','selarrrow');
			if(selectedIds.length > 1) {
			}else if(selectedIds.length == 1) {
			}
*/

			selObj = _.omit($("#manager").jqGrid('getRowData', $('#manager').jqGrid('getGridParam','selrow')), 'editButton');
			console.dir(selObj);
			populate('#'+$(this).attr('alt')+'Modal form', selObj);
			$('#'+$(this).attr('alt')+'Modal').modal('show');

		});
	});

	function onSort () {
		w = $('#whichTable').val();
		$('[aria-describedby="manager_editButton"]').each( function (i, v) {
			$(this).html('<button class="btn btn-primary editButton" alt="' + w + '" type="button">Edit</button>');
		});
	};
	function getDataObject (w) {
		r = {}
		for (var i in objectSets) {
			if(_.keys(objectSets[i])[0] === w) {
				r = objectSets[i];
			};
		}
		return r;
	};
	function populate(frm, data) {
		$.each(data, function(key, value){
			$('#'+key, frm).val(value);
		});
		if(type(data.platform) != 'undefined') {
			var plNo;
			switch (data.platform) {
				case 'Unknown':
					plNo = 0;
					break;
				case 'IOS':
					plNo = 1;
					break;
				case 'Android':
					plNo = 2;
					break;
				case 'Windows':
					plNo = 3;
					break;
				case 'Symbian':
					plNo = 4;
					break;
				case 'Tizen':
					plNo = 5;
					break;
			}
			$('select#platform', frm).val(plNo);
		}
	};
	function fillinOrganizations (orgSet) {
		orgs = orgSet;
		$('#organization').autocomplete({
			minLength: 0,
			source: orgSet,
			select: function( event, ui ) {
				$("#organization").val( ui.item.description );
				$("#orgId").val( ui.item.orgId );
				cuteNSexy.runChainedEvents([{'cmd': 'ListUsers', 'payload': {'orgId': $("#orgId").val()}, 'success': fillinUsers}], globalFail);
				return false;
			}
		})
		.data("ui-autocomplete")._renderItem = function( ul, item ) {
			return $( "<li>" )
			.append( "<a>" + item.orgName + "<br><small>" + item.description + "</small></a>" )
			.appendTo( ul );
		};
	}
	function fillinApps (appSet) {
		apps = appSet;
		console.dir(appSet);
		$('#sideBarApps').empty();
		for(var a in appSet) {
			an = appSet[a].appname;
			cn = '';
/*
			if(an.match(/android/i)){
				cn = 'mobile_android';
			}else if(an.match(/ios/i).length>0){
				cn = 'mobile_ios';
			}
*/
			an = an.replace(/\s*[android|ios]/i, '');
			an = (an.length > 16) ? an.substr(0, 16) + '...' : an;
			$('#sideBarApps').append(	'<div class="accordion-group sources">' +
										'<div class="accordion-heading subLinks appLinks ' + cn + '" id="' + appSet[a].appId + '">' +
										'<a href="#App" alt="' + appSet[a].appId + '">' + an + '</a></div></div>');
		}
	};
	function createdUser (response) {
		console.dir(response);
		console.info('created the user with the id '+response.userId+'...');
	};
	function fillinCampaigns (set) {
		camps = set;
		console.info('campaigns are here:');
		console.dir(set);
		$("#campaign").autocomplete({
			minLength: 0,
			source: set,
			select: function( event, ui ) {
				$("#campaign").val( ui.item.name );
				$("#campId").val( ui.item.campId );
				_ts.userDidSelect = true;
				return false;
			},
			change: function( event, ui ) {

			}
		})
		.data( "ui-autocomplete" )._renderItem = function( ul, item ) {
			return $( "<li>" )
			.append( "<a>" + item.name + "<br>" + new XDate(item.start.date).toString('d MMM yyyy') + ' - ' + new XDate(item.end.date).toString('d MMM yyyy') + "</a>" )
			.appendTo( ul );
		};
	};
	function fillinMakilinks (set) {
		$('#manager').jqGrid('clearGridData');
		for(var i in set) {
			$('#manager').jqGrid('addRowData', i, set[i]);
			onSort();
		}
	};
	function fillinUsersofOrga (set) {
		$('#manager').jqGrid('clearGridData');
		for(var i in set) {
			$('#manager').jqGrid('addRowData', i, set[i]);
			onSort();
		}
	};
	function fillinChannels (chn) {
		_ts.userDidSelect = false;
		$("#channel").autocomplete({
			minLength: 0,
			source: chn,
			select: function( event, ui ) {
				$("#channel").val( ui.item.channelKeyName );
				$("#channelId").val( ui.item.channelId );
				_ts.userDidSelect = true;
				return false;
			},
			change: function( event, ui ) {

			}
		})
		.data( "ui-autocomplete" )._renderItem = function( ul, item ) {
			return $( "<li>" )
			.append( "<a>" + item.channelKeyName + "<br><small>" + item.description + "</small></a>" )
			.appendTo( ul );
		};
	};
	function fillinUsers (userSet) {
		_ts.userDidSelect = false;
		$("#userName").autocomplete({
			minLength: 0,
			source: userSet,
			select: function( event, ui ) {
				$("#name").val( ui.item.name );
				$("#username").val( ui.item.username );
				$("#userId").val( ui.item.userId );
				$("#password").val( ui.item.password );
				$("#primaryRole").val( ui.item.primaryRole );	// JSON or not?
				$("#email").val( ui.item.email );
				_ts.userDidSelect = true;
				return false;
			},
			change: function( event, ui ) {
				if(ui.item == null) {
					$('.hiddenFields').css('display', 'block');
				}
				$('#email').focus();
			}
		})
		.data( "ui-autocomplete" )._renderItem = function( ul, item ) {
			return $( "<li>" )
			.append( "<a>" + item.name + "<br>" + item.email + "</a>" )
			.appendTo( ul );
		};
	};
	function fillInData (theObj) {
		stred = $.toJSON(theObj);
		console.log(stred);

		allKeys = getMatches(stred, new RegExp(',"([a-zA-Z]+)":"', 'g'), 1);
		for(var i in allKeys) {
			stred = stred.replace(',"['+allKeys[i]+']+":(["]{2})', ',"'+allKeys[i]+'":"'+$('#'+allKeys[i]).val()+'"');
		}
		console.log(stred);
		return $.evalJSON(stred);
	};
	function getMatches(string, regex, index) {
	    index || (index = 1);
	    var matches = [];
	    var match;
	    while (match = regex.exec(string)) {
	        matches.push(match[index]);
	    }
	    return matches;
	};
	function createTableset (menuPath, into, pl) {
		var ts;
		for(var i in tableSets) {
			if(tableSets[i].path === menuPath){
				ts = tableSets[i];
			}
		}
		if(ts.colModel[ts.colModel.length-1].name != 'editButton') { 
			cn = ts.colNames;
			cn.push('');
			cm = ts.colModel;
			cm.push({'width':50, 'name': 'editButton'});
		}else{
			cn = ts.colNames;
			cm = ts.colModel;
		}
		$.extend($.jgrid.defaults, {
			'ignoreCase': true, 'shrinkToFit': false, 'altRows': true, 'hoverrows': false, 'sortorder': 'asc',
			'height':'auto', 'hidegrid': false, 'sortname': 'appname', 'autoencode': true, 'viewrecords': true,
			'recordtext': 'View {0} - {1} of {2}', 'pgtext': 'Page {0} of {1}', 'sortable': true,
			'emptyrecords': 'No records to view', 'loadtext': 'Loading...',	'toppager': true	
		});

		$(into).jqGrid({
			'datatype': 'local', 'colNames': cn, 'colModel': cm, 'caption': ts.caption,
			'pager': '#thePager', 'altclass': 'tesla', 'rowNum': 20, 
			'onHeaderClick': function (gstate) { 
				onSort(); 
			}, 
			'onSortCol': function (i, c, or) { 
				onSort(); 
			},
		});

		// FILTER / SEARCH
		if(menuPath === 'managementMakilinks' || menuPath === 'managementApps') {
			$(into).filterToolbar({
				'afterSearch': onSort,
				'searchOnEnter': false,
			});
			$('input#gs_editButton, input#gs_appToken, input#gs_marketUrl').remove();
		}

		$('.ui-jqgrid-titlebar').append('<button class="btn btn-small btn-primary pull-right addNew" type="button">Add New</button>');

		// EXTRA PULLDOWNA FOR NARROWING DOWN
		if(menuPath === 'managementUsers') {
			$('.ui-jqgrid-title').append(' for <select name="orgPulldown" id="orgPulldown" class=""><option value="">[ select org ]</option></select>');
		}
		if(menuPath === 'managementMakilinks') {
			$('.ui-jqgrid-title').append(' for <select name="campPulldown" id="campPulldown" class=""><option value="">[ select campaign ]</option></select>');
		}
		if(orgs.length > 0) {
			for(var o in orgs) {
				$('#orgPulldown').append('<option value="' + orgs[o].orgId + '">' + orgs[o].description + '</option>');
			}
		}
		if(camps.length > 0) {
			for(var o in camps) {
				$('#campPulldown').append('<option value="' + camps[o].campId + '">' + camps[o].name + '</option>');
			}
		}




		if(type(ts.command) === 'string') {

			cuteNSexy.runChainedEvents([ 
				{'cmd': ts.command, 'payload': pl, 'success': function (set) {
				for(var i in set) {
					if(type(set[i].platform) != 'undefined') {
						switch (set[i].platform) {
							case 0:
								plName = 'Unknown';
								break;
							case 1:
								plName = 'IOS';
								break;
							case 2:
								plName = 'Android';
								break;
							case 3:
								plName = 'Windows';
								break;
							case 4:
								plName = 'Symbian';
								break;
							case 5:
								plName = 'Tizen';
								break;
						}
						set[i].platform = plName;
					}
					$(into).jqGrid('addRowData', i, set[i]);
				}
				$(into).jqGrid();
				onSort();
				
			} } ]);
			
		}else if(type(ts.command) === 'array') {

			retVal = {};
			tsIndex = 0;
			
			$(document).one(ts.command[tsIndex].cmd + 'ReceivedAndProccessedChainedSet', function () {
				console.log('here i come...');
				console.log('NEXT CMD: '+ts.command[tsIndex].cmd);
				console.log(tsIndex +'<->'+ ts.command.length);
				if(tsIndex < ts.command.length-1) {
					callee ( ts.command[tsIndex], tsIndex );
					tsIndex++;
				} else {
					tsIndex = 0;
				}
			});
			// trigger the first one manually to start the chain...
			tsIndex++;
		}
	};
	function type (o) {
		var types = {
		    'undefined'        : 'undefined',
		    'number'           : 'number',
		    'boolean'          : 'boolean',
		    'string'           : 'string',
		    '[object Function]': 'function',
		    '[object RegExp]'  : 'regexp',
		    '[object Array]'   : 'array',
		    '[object Date]'    : 'date',
		    '[object Error]'   : 'error'
		},
		tostring = Object.prototype.toString;
	    return types[typeof o] || types[tostring.call(o)] || (o ? 'object' : 'null');
	};
	function parseDMY(str) {
		return new XDate(str.replace(/([0-9]{2})([0-9]{2})([0-9]{4})/, '$3-$2-$1'));
	};

	return {
		'createdUser': createdUser,
	}

}(window.GryphonManagement = window.GryphonManagement || {}, jQuery));