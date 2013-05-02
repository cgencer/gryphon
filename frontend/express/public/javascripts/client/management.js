var GryphonManagement = (function(GryphonManagement, $, undefined){

	if (amplify.store('uid') === '') {
		window.location.href = 'login';
	}
	$(document).on('click', 'div.dashboard' , function () {
		window.location.href = 'dash';
	});

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
		console.log('User ID is: '+amplify.store('uid'));
		console.log('Sess ID is: '+amplify.store('sid'));

		if(amplify.store('sid')!=''){cuteNSexy.setSessionID(amplify.store('sid'));}
		else{amplify.store('sid',cuteNSexy.getSessionID());}

		cuteNSexy.runChainedEvents([ {'cmd': 'GetMenuItems', 'success': sMenuReceived,
										'payload': {'userId':amplify.store('uid')} } ]);

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
	var selectOrgFlag = false;
	var newOrgFlag = false;
	var flags = [];
	var _ts = this;
	var _role = {};
	var cache = {'orgs':{},'apps':{},'camps':{},'channels':{}};
	var orgs = [];
	var apps = [];
	var camps = [];
	XDate.parsers.push(parseDMY);

	$(document).ready(function() {

		objectSets = amplify.store('objectset');
		tableSets = amplify.store('tableset');

		cuteNSexy.runChainedEvents([
			{'cmd': 'ListOrganizations', 'payload': {}, 'success': nfillinOrganizations},
			{'cmd': 'ListApps', 'payload': {}, 'success': fillinApps},
			{'cmd': 'ListChannel', 'payload': {}, 'success': nfillinChannels},
			{'cmd': 'ListRoles', 'payload': {}, 'success': nfillinRoles},
		]);

		$('div.subLinks').each( function () {
//			$('#managementModal').clone().appendTo('body').attr('id', $(this).attr('id')+'Modal');
		});

		// =====================================================================================================
		// copy of the form elements to the virtual elements
		$(document).on('click', 'button.buttonToSelect' , function () {
			$('input[name="' + $(this).attr('title') + '"]').val($(this).attr('alt'));
		});
		$(document).on('change', '.formCopy' , function () {
			$('#' + $(this).attr('alt') + ' input[name="' + $(this).attr('name') + '"]').val( $(this).val() );
			$('#' + $(this).attr('alt') + ' input[name="command"]').val( 2 );
		});
		// both of these are needed for the multiple copying of apps rows into their appforms 
		$(document).on('change', '.formCopyMultiple' , function () {
			$('form#appForm_' + $(this).parents('tr').attr('alt') + ' input[name="marketUrl"]').val( $(this).val() );
		});
		$(document).on('click', 'button.buttonToSelectMultiple' , function () {
			$('form#appForm_' + $(this).parents('tr').attr('alt') + ' input[name="' + $(this).attr('title') + '"]').val( $(this).attr('alt') );
		});
		$(document).on('change', '#description' , function () {
			$('.clonedRow form input[name="description"]').val( $(this).val() );
		});
		// =====================================================================================================

		$(document).on('click', '.subLinks.appLinks' , function () {
//			$('div#sideBarApps.accordion').collapse('toggle');
			whichApp = $(this).attr('id');
			console.info(whichApp+' selected');
			if(whichApp != '') {
				cuteNSexy.runChainedEvents([
					{'cmd': 'ListCampaign', 'payload': {'applicationId': whichApp}, 'success': nfillinCampaigns},
				]);
			}
//			$('#sideBarApps').collapse('toggle');
//			$('#sideBarManagement').collapse('show');
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
			cuteNSexy.runChainedEvents([{'cmd': 'ListUsers', 'payload': {'orgId': $("#orgPulldown").val()}, 'success': fillinUsersofOrga}]);
		});
		$(document).on('change', '#campPulldown' , function () {
			console.log('changed campaign... >'+$("#campPulldown").val());
			cuteNSexy.runChainedEvents([{'cmd': 'ListMakilinks', 'payload': {'campaignId': $("#campPulldown").val(), 'routerEnable': false}, 'success': fillinMakilinks}]);
		});
		$(document).on('click', '.addRow' , function () {

			// clone the tr before itself and rename it
			$('#cloneMe').before( 
				$('#cloneMe').clone()
					.attr('id', 'cloneMe_' + $('#numApps').val() )
					.attr('alt', $('#numApps').val() )
					.addClass('clonedRow') 
			);

			// clone the form inside the tr
			$('#cloneMe_' + $('#numApps').val() + ' .injectForm').append( 
				$('form#appForm').clone().attr('id', $('form#appForm').clone().attr('id') + '_' + $('#numApps').val()) 
			);

			$('button.addRow:not(:last)').each( function (i, v) {
				$(this).replaceWith('<button type="button" class="removeRow">-</button>');
			})
			$('#numApps').val(Number($('#numApps').val())+1);
		});
		$(document).on('click', '.removeRow' , function () {
			$(this).parents('tr').remove();
			$('form#appForm_'+$('#numApps').val()).remove();
			if(Number($('#numApps').val()) > 1) {
				$('#numApps').val(Number($('#numApps').val())-1);
			}
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
					'cmd': 'AddUpdateUser', 'payload': {'command':1, 'info': ui}, 'success': createdUser}]);
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
			$('.channelAdding').css('display', 'block');
		});
		$(document).on('click', '#addCampaign' , function () {
			$('.campaignAdding').css('display', 'block');
		});

		$(document).on('click', '.saveButton' , function (e) {
			e.preventDefault();

			ui = $.toJSON(_.values(getDataObject( $('form#' + $(this).attr('alt')).children('input[name="object"]').val() ) )[0]);
			mn = $('form#' + $(this).attr('alt')).children('input[name="modal"]').val();

			$('input.formCopy').each( function (i, v) {
				$('form#' + $(this).attr('alt') + ' input[name="' + $(this).attr('name') + '"]').val( $(this).val() );
			});

			$('form#' + $(this).attr('alt')).children('input').each( function (ii, vv) {
				console.log( $(this).attr('name') + ' = '+ $(this).val() );

				rexp = new RegExp(',["]{1}([' + $(this).attr('name') + ']*)["]{1}:["]{2}', 'g');
				ui = ui.replace(rexp, ',"$1":"' + $(this).val() + '"');

			});

			theCmd = $('form#' + $(this).attr('alt')).children('input[name="cmd"]').val() + 
			$('form#' + $(this).attr('alt')).children('input[name="type"]').val();

			cuteNSexy.runChainedEvents([{'cmd': theCmd, 'payload': {'info': $.evalJSON(ui)}, 'success': function () { $('#'+mn).modal('hide'); }}]);
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
			selObj = _.omit($("#manager").jqGrid('getRowData', $('#manager').jqGrid('getGridParam','selrow')), 'editButton');

			console.dir(selObj);
			populate($(this).attr('title'), $(this).attr('alt'), selObj);
			$('#'+$(this).attr('alt')+'Modal').modal('show');
		});
	});

	function onSort () {
		w = $('#whichTable').val();
		f = '';
		switch (w) {
			case 'managementOrganizations':
				f = 'orgForm';
				break;
			case 'managementUsers':
				f = 'userForm';
				break;
			case 'managementApps':
				f = 'appForm';
				break;
			case 'managementMakilinks':
				f = 'makilinkForm';
				break;
		}
		$('[aria-describedby="manager_editButton"]').each( function (i, v) {
			$(this).html('<button class="btn btn-primary editButton" title="' + f + '" alt="' + w + '" type="button">Edit</button>');
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
	function populate(frmH, frmM, data) {

		$.each(data, function(key, value){
			$('input[name="' + key + '"]', '#'+frmH).val( value );
			$('input.'+frmM+'[name="' + key + '"]').val( value );
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
			$('select#platform', frmH).val(plNo);
		}

	};
	function saveToForm (st, obj, arr) {
		for(i in arr) {
			$('form#' + st + ' input#' + arr[i]).val( obj[ arr[i] ] )		// does $("form#formname input#username").val( obj.username );
		}
	};
	function nfillinOrganizations (rp) {
		cache['orgs'] = rp;
		createAutoCompletes (cache['orgs'], 'managementApps', 'organization', 'userForm', 'addOrgPopup', true, {'cmd': 'ListUsers', 'by': 'orgId', 'fn': nfillinUsers});
	};
	function nfillinUsers (rp) {
		createAutoCompletes (rp, 'managementApps', 'userName', 'userForm', 'addUserPopup', true, null);
	};
	function nfillinRoles (rp) {
		cache['roles'] = rp;
		toIns = $('#userTypeButtons');
		for(var i in cache['roles']) {
			$('<button type="button" alt="' + cache['roles'][i].roleId + '" title="roleId" ' +
			'class="btn btn-small buttonToSelect btn-primary">' + cache['roles'][i].description + '</button>').insertAfter( toIns );
			toIns = $('button.buttonToSelect[alt="' + cache['roles'][i].roleId + '"]');
		}

		if(type(r) == 'object') {
			_role = r;
		}else if(type(r) == 'array') {
			for(var ri in r) {
				if(r[ri].roleId === '0.00000C@ROLE'){
					_role = r[ri];
				}
			}
		}
	};
	function nfillinCampaigns (rp) {
		cache['camps'] = rp;
		$('#campPulldown').empty().append('<option value="">[ select campaign ]</option>');
		if(cache['camps'].length > 0) {
			for(var o in cache['camps']) {
				$('#campPulldown').append('<option value="' + cache['camps'][o]['campId'] + '">' + cache['camps'][o]['name'] + '</option>');
			}
		}
		createAutoCompletes (cache['camps'], 'managementMakilinks', 'campaign', 'campaignForm', 'addCampaignPopup', true, null);
	};
	function nfillinChannels (rp) {
		cache['channels'] = rp;
		createAutoCompletes (cache['channels'], 'managementMakilinks', 'channel', 'channelForm', 'addChannelPopup', true, null);
	};

	function fillinChannels (chn) {
		_ts.userDidSelect = false;
		$('input.managementApps[name="channel"]').autocomplete({
			minLength: 0,
			source: chn,
			select: function( event, ui ) {
				$('input.managementApps[name="channel"]').val( ui.item.channelKeyName );
				$('#channelId').val( ui.item.channelId );
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



	function fillinApps (appSet) {
		apps = appSet;
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
//			an = an.replace(/\s*[android|ios]/i, '');
			an = (an.length > 20) ? an.substr(0, 20) + '...' : an;
			$('#sideBarApps').append(	'<div class="accordion-group sources">' +
										'<div class="accordion-heading subLinks appLinks ' + cn + '" id="' + appSet[a].appId + '">' +
										'<a href="#App" alt="' + appSet[a].appId + '">' + an + '</a></div></div>');
		}
	};
	function createdUser (response) {
		console.dir(response);
		console.info('created the user with the id '+response.userId+'...');
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

	function createAutoCompletes (recSet, frm, fld, saveTo, popUp, noTest, bindToNext) {
		flags['selected_'+fld] = false;
		flags['dialog_'+fld] = false;
		theField = 'input.' + frm + '[name="' + fld + '"]';
		lookFor = '';

		switch (fld) {
			case 'organization':
				lookFor = 'orgName';
				break;
			case 'userName':
				lookFor = 'name';
				break;
			case 'campaign':
				lookFor = 'name';
				break;
			case 'channel':
				lookFor = 'channelKeyName';
				break;
		}


		$(document).on('keypress', theField, function (e) {
			changes();
		});

		function onChangeACContent ( event, ui ) {
			changes();
		};
		
		function changes () {
			flags['selected_'+fld] = false;

/*
			if(_.indexOf(_.pluck(recSet, lookFor), $(theField).val()) == -1) {
				if(!flags['selected_'+fld]) {
					openPopup();
				}
			}else{
				if($('#dialog').dialog('isOpen')) {
					$('#dialog').dialog('close');
					$('#dialog').empty();
				};				
			}
*/
			if( $(theField).val() == '') {
				if(flags['dialog_'+fld]) {
					$('#dialog').dialog('close');
					$('#dialog').empty();
				};
			}
		};

		function onOpenACList ( event, ui ) {
			if(flags['dialog_'+fld]) {
				$('#dialog').dialog('close');
				$('#dialog').empty();
				flags['dialog_'+fld] = false;
			};
		};

		function openPopup () {
			$('#dialog').html( $(popUp).html() );
			$('#dialog').dialog({
				'autoOpen': true,
				'draggable': false,
				'title': '',
				'dialogClass': 'no-close',
				'modal': true,
				'width': $(theField).width(),
				'position': { 
					'my': 'left top', 
					'at': 'left bottom', 
					'of': $(theField) 
				},
				'buttons': [{
					'text': 'OK',
					'click': function() {
						$(this).dialog('close');
					}
				}]
			});
			flags['dialog_'+fld] = true;
			$(theField).focus();
			$('.ui-dialog-titlebar').css('display', 'none');
			$('#dialog, .ui-dialog').css('z-index', $('.modal-backdrop').css('z-index') + 1000);
		};

		function onCloseACList ( event, ui ) {
			if(!flags['selected_'+fld]) {
console.log('from closelist '+flags['selected_'+fld]);
				openPopup();
			};
		};

		function onSelectACItem ( event, ui ) {
			flags['selected_'+fld] = true;
			flags['dialog_'+fld] = false;
			if(bindToNext != null) {
				$('#'+bindToNext['by']).val( ui.item[bindToNext['by']] );
			}
			switch (fld) {
				case 'organization':
					$(theField).val( ui.item.orgName );
					saveToForm (saveTo, ui.item, ['orgId']);
					break;
				case 'userName':
					$(theField).val( ui.item.name );
					// these are the form items to save the real results to
					saveToForm (saveTo, ui.item, ['username', 'userId', 'password', 'email', 'primaryRole']);
					break;
				case 'campaign':
					$(theField).val( ui.item.name );
					saveToForm (saveTo, ui.item, ['campId']);
					break;
				case 'channel':
					$(theField).val( ui.item.channelKeyName );
					saveToForm (saveTo, ui.item, ['channelId']);
					break;
			}

			if(bindToNext != null) {
				pl = {};
				pl[bindToNext.by] = $('#'+bindToNext.by).val();
				cuteNSexy.runChainedEvents([{'cmd': bindToNext.cmd, 'payload': pl, 'success': bindToNext.fn}]);
			}
console.log('just inited '+flags['selected_'+fld]);

			return false;
		};

		$(document).on('blur', theField, function (e) {
			// was: input.managementApps[name="userName"]
			fn = $(this).attr('alt');
			
			flags[fld] = false;
			switch (fld) {
				case 'organization': 									// create a new organization upon filling + blur
					obj = _.values(getDataObject('OrgInfo'))[0];
					obj['orgName'] = $(this).val();
					obj['description'] = $(this).val();

					theCmd = 'AddUpdateOrganization';
					theForm = 'orgForm';
					theLoad = {'countlyHostId': 'mkui1.nmdapps.com', 'command': 1, 'info': fillinData(obj, theForm)};
					break;

				case 'userName':
					obj = _.values(getDataObject('UserInfo'))[0];
					obj.name = $(this).val();
					obj.username = $(this).val().latinise().replace(/\s/, '');
					obj.description = $(this).val();
					obj.password = '123456';
					obj.primaryRole = _role;
					obj.email = $('#email').val();

					theCmd = 'AddUpdateUser';
					theLoad = {'countlyHostId': 'mkui1.nmdapps.com', 'command': 1, 'info': fillinData(obj, theForm)};
					break;

				case 'campaign':
					obj = _.values(getDataObject('CampaignInfo'))[0];

					theCmd = 'AddUpdateCampaign';
					theLoad = {'countlyHostId': 'mkui1.nmdapps.com', 'command': 1, 'info': fillinData(obj, theForm)};
					theCmd = '';
					theLoad = '';
					break;

				case 'channel':
					obj = _.values(getDataObject('ChannelInfo'))[0];

					theCmd = 'AddUpdateChannel';
					theLoad = {'countlyHostId': 'mkui1.nmdapps.com', 'command': 1, 'info': fillinData(obj, theForm)};
					theCmd = '';
					theLoad = '';
					break;
			}
			if(!flags['selected_'+fld] && $(this).val() != '') {
				cuteNSexy.runChainedEvents([{'cmd': theCmd, 'payload': 	theLoad,
					'success': 	function () {

					} 
				}]);
//				flags['selected_'+fld] = false;
			}
		});

		yesCall = false;
		if(noTest) {	// true bypasses the flag&content check
			// call
			yesCall = true;
		}else {
			if(!flags['selected_'+fld] && $(this).val() != '') {		// the flag contains false and the inputfield has content
				// call
				yesCall = true;
			}else{
				yesCall = false;
			}
		}

		if(yesCall) {								// ensure its an old added company, new ones dont need autocompleted
			console.log('>>>input.' + frm + '[name="' + fld + '"]');
			$(theField).autocomplete({
				'minLength': 	0,
				'source': 		recSet,
				'select': 		onSelectACItem,
				'change': 		onChangeACContent,
				'open': 		onOpenACList,
				'close': 		onCloseACList,
			})
			.data('ui-autocomplete')._renderItem = function( ul, item ) {
				var detail = '';
				switch (fld) {
					case 'organization':
						detail = '<a>' + item.orgName + '</a>';
						break;
					case 'userName':
						detail = '<a>' + item.name + '<br>' + item.email + '</a>';
						break;
					case 'campaign':
						detail = '<a>' + item.name + '<br>' + new XDate(item.start.date).toString('d MMM yyyy') + ' - ' + new XDate(item.end.date).toString('d MMM yyyy') + '</a>';
						break;
					case 'channel':
						detail = '<a>' + item.channelKeyName + '<br><small>' + item.description + '<small></a>'; 
						break;
				}
				return $('<li>').append(detail).appendTo(ul);
			};

		}

	};



	function normalize(arr, max) {
	    // find the max value
		var max = arr[0];
		var min = arr[0];
		for(var x=0; x<arr.length; x++) 
			max = Math.max(m, arr[x]);
		for(var x=0; x<arr.length; x++) 
			min = Math.min(m, arr[x]);

		// normalize the array
		for(var x=0; x<arr.length; x++) 
			arr[x] = (arr[x] - min) / (max - min);

		return arr;
	};

	function fillInData (theObj, frm) {
		stred = $.toJSON(theObj);
		console.log(stred);

		allKeys = getMatches(stred, new RegExp(',"([a-zA-Z]+)":"', 'g'), 1);

		$(frm).children('input').each( function (i, v) {
			k = $(this).attr('name');
			m = $(this).attr('value');
			stred = stred.replace(',"['+k+']+":(["]{2})', ',"'+k+'":"'+m+'"');
		});

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
		if(cache['orgs'].length > 0) {
			for(var o in cache['orgs']) {
				$('#orgPulldown').append('<option value="' + cache['orgs'][o]['orgId'] + '">' + cache['orgs'][o]['orgName'] + '</option>');
			}
		}
		if(cache['camps'].length > 0) {
			for(var o in cache['camps']) {
				$('#campPulldown').append('<option value="' + cache['camps'][o]['campId'] + '">' + cache['camps'][o]['name'] + '</option>');
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
		'addedOrga': addedOrga
	}

}(window.GryphonManagement = window.GryphonManagement || {}, jQuery));