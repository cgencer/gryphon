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
	var whichId = '';
	var whichApp = '';
	var theModal = '';
	var userDidSelect = false;
	var selectOrgFlag = false;
	var newOrgFlag = false;
	var flags = {'addedApp':false, 'addedOrg': false, 'itCameFromTheManagementMakilinks': false};
	var _ts = this;
	var _role = {};
	var cache = {'orgs':{},'apps':{},'camps':{},'channels':{}};
	var orgs = [];
	var apps = [];
	var camps = [];
	XDate.parsers.push(parseDMY);
	platformNames = ['None', 'IOS', 'Android', 'Windows', 'Symbian', 'Tizen']; 
	trackNames = ['None', 'via UI', 'via Makilink', 'via SDK']; 
	orglevels = ['None', 'Agency', 'Client', 'App Dev', 'Network', 'Publisher'];
	roleNames = [];

	$(document).ready(function() {

		objectSets = amplify.store('objectset');
		tableSets = amplify.store('tableset');
/*
		$.clipboardReady( function () {
			$('a.copyTokenButton').click( function () {
				console.log('clicked');
				$.clipboard( "You clicked on a link and copied this text!" );
				return false;
			});
		}, { swfpath: './swf/jquery.clipboard.swf', debug: true } );
*/
		$('a.copyTokenButton').zclip({
			'path': 	'./swf/ZeroClipboard.swf',
			'copy': 	'text', //$(this).attr('title'),
//			afterCopy: 	function () {
//				console.log('clicked');
//			}
		});
	
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
		// copy to pastebuffer
		if(whichTable === 'managementApps') {

				
		}
		// =====================================================================================================
		// copy of the form elements to the virtual elements
		$(document).on('click', 'button.buttonToSelect' , function () {
			$('input[name="' + $(this).attr('title') + '"]').val($(this).attr('alt'));
		});
		$(document).on('change keypress', '.formCopy' , function () {
			$('#' + $(this).attr('alt') + ' input[name="' + $(this).attr('name') + '"]').val( $(this).val() );
			$('#' + $(this).attr('alt') + ' input[name="command"]').val( 2 );
		});
		// both of these are needed for the multiple copying of apps rows into their appforms 
		$(document).on('change keypress', '.formCopyMultiple' , function () {
			$('form#appForm_' + $(this).parents('tr').attr('alt') + ' input[name="marketUrl"]').val( $(this).val() );
		});
		$(document).on('click', 'button.buttonToSelectMultiple' , function () {
			$('form#appForm_' + $(this).parents('tr').attr('alt') + ' input[name="' + $(this).attr('title') + '"]').val( $(this).attr('alt') );
		});
		$(document).on('change keypress', '#description' , function () {
			$('.clonedRow form input[name="description"]').val( $(this).val() );
		});
		// =====================================================================================================
		$(document).on('change keypress blur', '#searchApp' , function () {
			searchFor = $(this).val().toLowerCase();
			$('div.accordion-group.appNames').each( function (i, v) {
				if($(this).attr('alt').indexOf(searchFor) > -1) {
					$(this).css('display', 'block');
				}else{
					$(this).css('display', 'none');
				}
			})
		});

		$(document).on('click', '.subLinks.appLinks' , function () {
			$('div#collapseApps.accordion-body').collapse('hide');

			whichApp = $(this).attr('id');
			$('#appId').val(whichApp);

			if(whichApp != '') {
				cuteNSexy.runChainedEvents([
					{'cmd': 'ListCampaign', 'payload': {'applicationId': whichApp}, 'success': nfillinCampaigns},
				]);
			}

			if(flags['itCameFromTheManagementMakilinks']) {
				$('div#collapseFive.accordion-body').collapse('show');
				$('div#collapseApps.accordion-body').collapse('hide');
				createTableset('managementMakilinks', '#manager', {});
				flags['itCameFromTheManagementMakilinks'] = false;
			}
		});
		$(document).on('click', '.subLinks.managementLinks' , function () {
			$('#rightSide').html('<table id="manager"></table><div id="thePager"></div>');
			whichTable = $(this).attr('id');
			$('#whichTable').val(whichTable);

			whichId = $(this).attr('alt');
			$('#whichId').val(whichId);
			if(whichTable == 'managementMakilinks' && whichApp == '') {
				flags['itCameFromTheManagementMakilinks'] = true;
				$('div#collapseFive.accordion-body').collapse('hide');
				$('div#collapseApps.accordion-body').collapse('show');

				$('#rightSide').append( $("#alertSelectApp").clone() );
				$('#alertSelectApp').show();
			}else{
				createTableset(whichTable, '#manager', {});
			}
		});
		$(document).on('change', '#orgPulldown' , function () {
			console.log('changed orga...');
			$('#orgId').val( $(this).val() );
			cuteNSexy.runChainedEvents([{'cmd': 'ListUsers', 'payload': {'orgId': $("#orgPulldown").val()}, 'success': fillinUsersofOrga}]);
		});
		$(document).on('change keypress', '#campPulldown' , function () {
			console.log('changed campaign... >'+$("#campPulldown").val());
			cuteNSexy.runChainedEvents([{'cmd': 'ListMakilinks', 'payload': {'campaignId': $("#campPulldown").val(), 'routerEnable': false}, 'success': fillinMakilinks}]);
		});
		$(document).on('click', '.showTokens' , function () {
			var appid = $(this).attr('title');
			var row = '<tr><td>#####</td><td>%%%%%</td><td>+++++</td><td><a class="btn btn-primary copyTokenButton" title="+++++" alt="+++++" type="button">Copy Token</button></td></tr>';
			$('#tokenRows').empty();
			for (var a in cache['apps']) {
				if(cache['apps'][a].appId == appid) {
					for(var i in cache['apps'][a].userTokens) {
						var rc = row;
						rc = rc.replace(/[#]{5}/g, cache['apps'][a].userTokens[i].name);
						rc = rc.replace(/[%]{5}/g, cache['apps'][a].userTokens[i].description);
						rc = rc.replace(/[+]{5}/g, cache['apps'][a].userTokens[i].token);
						$('#tokenRows').append(rc);
					}
					tset = "";
				}
			}
			$('#TokensModal').modal('show');
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
		$(document).on('click', '.ui-jqgrid-sortable' , function (e) {
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
/*
	TODO on management of makilinks: put makilinkName into the tags object
*/
			formpointer = '#' + $(this).parents('div.modal').attr('id') + ' form#' + $(this).attr('alt');
			elementspointer = '#' + $(this).parents('div.modal').attr('id');
			console.log(formpointer);
			ui = $.toJSON(_.values(getDataObject( $('form#' + $(this).attr('alt')).children('input[name="object"]').val() ) )[0]);

			$('div#' + $(this).parents('div.modal').attr('id') + ' input.formCopy').each( function (i, v) {
				$(formpointer + ' input[name="' + $(v).attr('name') + '"]').val( $(v).val() );
			});

			$(formpointer + ' input.toSave').each( function (i, v) {
				rexp = new RegExp(',["]{1}([' + $(v).attr('name') + ']+)["]{1}:["]{2}', 'g');
				ui = ui.replace(rexp, ',"$1":"' + $(v).val() + '"');
			});

			for (var r in cache['roles']) {
				if(cache['roles'][r].roleId == $('input[name="roleId"]').val()) {
					theRole = cache['roles'][r];
				}
			}
			switch ($(this).attr('alt')) {				// overwrite with specific values
				case 'userForm':
					var infoObj = {
						'username': $(elementspointer + ' input[name="name"]').val().latinise().replace(/\s/g, ''),
					}
					break;
			}
			infoObj = $.extend({}, infoObj, theRole);
			for(var io in infoObj) {
				ui = ui.replace(new RegExp(',"([' + io + ']+)":["]{2}', 'g'), ',"$1":"' + infoObj[io] + '"');
			}

			ui = ui.replace('"orgId":""', '"orgId":"' + $('#orgId').val() + '"');
			ui = ui.replace('"userId":""', '"userId":"' + $('#userId').val() + '"');

			if(whichTable === 'managementApps') {
				flags['addedApp'] = true;
				theCmd = 'AddUpdateApp';
			}else if(whichTable === 'managementOrganizations') {
				flags['addedOrg'] = true;
				theCmd = 'AddUpdateOrganization';
			}else {
				theCmd = 'AddUpdate' + $(formpointer + ' input[name="type"]').val();
			}

			cuteNSexy.runChainedEvents([{'cmd': theCmd, isReal: true, 'success': weSavedOurSouls, 'payload': {
					'command': 1, 'info': $.evalJSON(ui)
				}
			}]);
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
		$(document).on('click', '.editButton' , function (e) {

			elementspointer = $('#' + $(this).attr('alt') + 'Modal');
			if($(this).attr('alt') === 'managementOrganizations') {formpointer = $('#' + $(this).attr('alt') + 'Modal form#orgForm');}
			if($(this).attr('alt') === 'managementUsers') {formpointer = $('#' + $(this).attr('alt') + 'Modal form#userForm');}
			if($(this).attr('alt') === 'managementApps') {formpointer = $('#' + $(this).attr('alt') + 'Modal form#appForm');}
			if($(this).attr('alt') === 'managementMakilinks') {makilinkForm = $('#' + $(this).attr('alt') + 'Modal form#makilinkForm');}

			// copy all
			$('div#' + $(this).parents('div.modal').attr('id') + ' input.formCopy').each( function (i, v) {
				$(formpointer + ' input[name="' + $(v).attr('name') + '"]').val( $(v).val() );
			});

			selObj = _.omit($("#manager").jqGrid('getRowData', $('#manager').jqGrid('getGridParam','selrow')), 'editButton');
//			theId = selObj[whichId];
			if(type(selObj.orgId) != 'undefined') { $('#orgId').val(selObj.orgId); }
			if(type(selObj.userId) != 'undefined') { $('#userId').val(selObj.userId); }
			if(type(selObj.appId) != 'undefined') { $('#appId').val(selObj.appId); }
			if(type(selObj.makilinkId) != 'undefined') { $('#makilinkId').val(selObj.makilinkId); }

			if($(this).attr('alt') === 'managementUsers') {
				for(var r in cache['roles']) {
					if(cache['roles'][r].visibleName == selObj.primaryRole_visibleName) {
						selObj.roleId = cache['roles'][r].roleId;
						selObj.roleNo = r;
						$('input[name="roleId"]').val(selObj.roleId);
					}
				}
			}
			console.dir(selObj);

			populate( $(this).attr('title'), $(this).attr('alt'), selObj );

			$('#'+$(this).attr('alt')+'Modal').modal('show');
		});
	});

	function weSavedOurSouls (p, c) {
		if(whichTable === 'managementApps') {
			cuteNSexy.runChainedEvents([{'cmd': 'ListApps', 'payload': {}, 'success': fillinApps}]);
		}else if(whichTable === 'managementOrganizations') {
			cuteNSexy.runChainedEvents([{'cmd': 'ListOrganizations', 'payload': {}, 'success': nfillinOrganizations}]);
		}else {
			theCmd = 'AddUpdate' + $(formpointer + ' input[name="type"]').val();
		}

		console.dir(p);
		$('.modal').modal('hide'); 
		createTableset($('#whichTable').val(), '#manager', {});
	}

	function populate(frmH, frmM, data) {
		$.each(data, function(key, value){
			$('input[name="' + key + '"]', '#'+frmH).val( value );
			$('input.'+frmM+'[name="' + key + '"]').val( value );
		});
		// select the radio button
		bgname = $('div.btn-group').attr('alt');
		var selectors = {
			'platform': platformNames,
			'trackNames': trackNames,
			'orgLevel': orglevels,
		}
		$('div.btn-group button').removeClass('active');
		for(var s in selectors) {
			if(_.indexOf(_.keys(data), s) > -1) {
				if(_.isNaN(Number(data[s]))) {
					idx = _.indexOf(selectors[s], data[s]);
//					platformNames = ['None', 'IOS', 'Android', 'Windows', 'Symbian', 'Tizen']; 

console.info('index is '+idx);
					$('button[title="' + s + '"]').eq( idx ).addClass('active');
				}else{
					$('button[title="' + s + '"]').eq( Number(data[s])-1 ).addClass('active');
				}
			}
		}
		if(type(data.primaryRole_visibleName) != 'undefined') {
			$('button[title="roleId"]').eq( _.indexOf(roleNames, data.primaryRole_visibleName)-1 ).addClass('active');
		}
	};

	function dblClickRow (rowid, iRow, iCol, e) {
		if(whichTable === 'managementMakilinks') {
			console.log('double clicked');
			selObj = _.omit($("#manager").jqGrid('getRowData', rowid, 'editButton'));
			for(var i in cache['apps']) {
				if(cache['apps'][i].appId == selObj.appId) {
					if(cache['apps'][i].userTokens.length == 1) {
						console.info(cache['apps'][i].userTokens[0].token);
					}
				}
			}
		}
	};

	function onSort () {
		$('[aria-describedby="manager_editButton"]').each( function (i, v) {
			var gtb = '';
			rowObj = _.omit($("#manager").jqGrid('getRowData', i), 'editButton');
			if(whichTable == 'managementApps') {
				for(var i in cache['apps']) {
					if(cache['apps'][i].appId == rowObj.appId) {
//						console.log(rowObj.appId);
						if(cache['apps'][i].userTokens.length == 1) {
							gtb = '&nbsp;&nbsp;<a class="btn btn-primary copyTokenButton" title="' + cache['apps'][i].userTokens[0].token + 
								'" alt="' + $('#whichTable').val() + '">Copy Token</a>';
						}else if(cache['apps'][i].userTokens.length > 1) {
							gtb = '&nbsp;&nbsp;<a class="btn btn-primary showTokens" title="' + rowObj.appId + '" alt="' + $('#whichTable').val() + '" type="button">Show Tokens</a>'
						}
					}
				}
			}
			$(this).html('<button class="btn btn-primary editButton" title="' + $('#whichId').val() + '" alt="' + $('#whichTable').val() + '" type="button">Edit</button>' + gtb);
		});
		if($('#whichTable').val() == 'managementApps') {
			$('[aria-describedby="manager_tokens"]').each( function (i, v) {
			//
				selObj = _.omit($("#manager").jqGrid('getRowData', i), 'editButton');
				for(var i in cache['apps']) {
					if(cache['apps'][i].appId == selObj.appId) {
						if(cache['apps'][i].userTokens.length == 1) {
							$(this).html( '<div class="userAppToken" alt="' + cache['apps'][i].userTokens[0].token + '">' + cache['apps'][i].userTokens[0].name + '</div>' );
						}else if(cache['apps'][i].userTokens.length > 1) {
							$(this).html('<small>[ multiple ]</small>');
						}
					}
				}
			});
		}
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
	function saveToForm (st, obj, arr) {
		for(i in arr) {
			$('form#' + st + ' input#' + arr[i]).val( obj[ arr[i] ] )		// does $("form#formname input#username").val( obj.username );
		}
	};
	function nfillinOrganizations (rp) {
		cache['orgs'] = rp;
		flags['addedOrg'] = false;
		createAutoCompletes (cache['orgs'], 'managementApps', 'organization', 'userForm', 'addOrgPopup', true, {'cmd': 'ListUsers', 'by': 'orgId', 'fn': nfillinUsers});
	};
	function nfillinUsers (rp) {
		createAutoCompletes (rp, 'managementApps', 'userName', 'userForm', 'addUserPopup', true, null);
	};
	function nfillinRoles (rp) {
		cache['roles'] = rp;
		for(var i in cache['roles']) {
//			roleNames.push(cache['roles'][i].visibleName);
			$('<button type="button" alt="' + cache['roles'][i].roleId + '" title="roleId" ' +
			'class="btn btn-small buttonToSelect btn-primary">' + cache['roles'][i].visibleName + 
			'</button>').appendTo( $('#userTypeButtons') );
		}

		if(type(rp) == 'object') {
			_role = rp;
		}else if(type(rp) == 'array') {
			for(var ri in rp) {
				if(rp[ri].roleName.toLowerCase().indexOf('developer') > -1){
					_role = rp[ri];
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
		cache['apps'] = appSet;
		flags['addedApp'] = false;
		$('#sideBarApps').empty();
		$('#sideBarApps').append(	'<div class="accordion-group sources">' +
									'<div class="accordion-heading">' +
									'<input type="text" id="searchApp" placeholder="[ filter ]" value="" /></div></div>');

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
			an = (an.length > 20) ? an.substr(0, 15) + '...' : an;
			$('#sideBarApps').append(	'<div class="accordion-group sources appNames" alt="' + an.toLowerCase() + '">' +
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
			console.dir(cleanResponse(set[i]));
			
			$('#manager').jqGrid('addRowData', i, cleanResponse(set[i]));
			onSort();
		}
	};
	function fillinUsersofOrga (set) {
		$('#manager').jqGrid('clearGridData');
		for(var i in set) {
			$('#manager').jqGrid('addRowData', i, cleanResponse(set[i]));
			onSort();
		}
	};

	function createAutoCompletes (recSet, frm, fld, saveTo, popUp, noTest, bindToNext) {
		flags['selected_'+fld] = false;
		flags['dialog_'+fld] = false;
		theField = 'input.' + frm + '[name="' + fld + '"]';

		switch (fld) {
			case 'organization':
				itemsToSave = ['orgId'];
				useFormItem = 'orgName';
				break;
			case 'userName':
				itemsToSave = ['username', 'userId', 'password', 'email', 'primaryRole'];
				useFormItem = 'name';
				break;
			case 'campaign':
				itemsToSave = ['campId'];
				useFormItem = 'name';
				break;
			case 'channel':
				itemsToSave = ['channelId'];
				useFormItem = 'channelKeyName';
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
			if(_.indexOf(_.pluck(recSet, useFormItem), $(theField).val()) == -1) {
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
				'autoOpen': true,	'draggable': false,		'title': '',
				'dialogClass': 'no-close',	'modal': true,	'width': $(theField).width(),
				'position': { 
					'my': 'left top', 	'at': 'left bottom', 'of': $(theField) 
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

			$(theField).val( ui.item[useFormItem] );
			saveToForm (saveTo, ui.item, itemsToSave);

			if(bindToNext != null) {
				pl = {};
				pl[bindToNext.by] = $('#'+bindToNext.by).val();
				cuteNSexy.runChainedEvents([{'cmd': bindToNext.cmd, 'payload': pl, 'success': bindToNext.fn}]);
			}
			return false;
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

		$(document).on('xlur', theField, function (e) {
			// was: input.managementApps[name="userName"]
			fn = $(this).attr('alt');
			
			flags[fld] = false;
			obj = _.values(getDataObject( $('form#' + fn).children('input[name="object"]').val() ))[0];
			theCmd = $('form#' + fn).children('input[name="cmd"]').val() + $('form#' + fn).children('input[name="type"]').val();
			theKey = $('form#' + fn).children('input[name="key"]').val();

			switch (fld) {
				case 'organization': 									// create a new organization upon filling + blur
					var infoObj = {
						'orgName': 		$(this).val(),
						'description': 	$(this).val(),
					}
					break;
				case 'userName':
					var infoObj = {
						'name': 		$(this).val(),
						'username': 	$(this).val().latinise().replace(/\s/, ''),
						'description': 	$(this).val(),
						'password': 	'123456',
						'primaryRole': 	_role,
						'email': 		$('#email').val(),
					}
					break;
				case 'campaign':
					var infoObj = {
					}
					theCmd 				= '';
					theLoad 			= '';
					break;
				case 'channel':
					var infoObj = {
					}
					theCmd 				= '';
					theLoad 			= '';
					break;
				case 'makilink':
					var infoObj = {
					}
					break;
			}
			for(var i in infoObj) {
				obj[i] = infoObj[i];
			}
//			obj[theKey] = 

			if(!flags['selected_'+fld] && $(this).val() != '') {

				cuteNSexy.runChainedEvents([{
					'cmd': theCmd, 'isReal': true, 'payload': 
					{'countlyHostId': 'mkui1.nmdapps.com', 'command': 1, 'info': fillInData (obj, fn)},
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
			cm.push({'width':145, 'name': 'editButton'});
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
			'onHeaderClick': onSort, 
			'onSortCol': onSort,
			'ondblClickRow': dblClickRow,
		});
		f = '';
		switch (menuPath) {
			case 'managementOrganizations':
				f = 'orgId';
				break;
			case 'managementUsers':
				f = 'userId';
				break;
			case 'managementApps':
				f = 'appId';
				break;
			case 'managementMakilinks':
				f = 'makilinkId';
				break;
		}
		$(into).hideCol([f]);

		// FILTER / SEARCH
		if(menuPath === 'managementMakilinks' || menuPath === 'managementApps') {
			$(into).filterToolbar({
				'afterSearch': onSort,
				'searchOnEnter': false,
			});
			$('input#gs_editButton, input#gs_appToken, input#gs_marketUrl').remove();
		}

		$('button.addNew').remove();		// remove the buttons first (on edit, it duplicates)
		$('.ui-jqgrid-titlebar').append('<button class="btn btn-small btn-primary pull-right addNew" type="button">Add New</button>');

		// EXTRA PULLDOWNA FOR NARROWING DOWN
		if(menuPath === 'managementUsers') {
			$('#orgPulldown').remove();
			$('#manager').jqGrid('clearGridData');
			if($('#orgId').val() != ''){pl.orgId = $('#orgId').val();}
			$('.ui-jqgrid-title').append('<select name="orgPulldown" id="orgPulldown" class=""><option value="">[ select org ]</option></select>');
		}
		if(menuPath === 'managementMakilinks') {
			$('#campPulldown').remove();
			$('#manager').jqGrid('clearGridData');
			if($('#campId').val() != ''){pl.campId = $('#campId').val();}
			$('.ui-jqgrid-title').append('<select name="campPulldown" id="campPulldown" class=""><option value="">[ select campaign ]</option></select>');
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
		// preselect the dropdown, if previously selected
		if($('#orgId').val() != ''){$('#orgPulldown').val($('#orgId').val());}
		if($('#campId').val() != ''){$('#campPulldown').val($('#campId').val());}

		userTypeNames = _.pluck(cache['roles'], 'description');

		if(type(ts.command) === 'string') {

			if(whichTable === 'managementApps' && !flags['addedApp']) {
				if(cache['apps'].length > 0) {
					for(var i in cache['apps']) {
						$(into).jqGrid('addRowData', i, cleanResponse(cache['apps'][i]));
					}
					onSort();
				}
			}else if(whichTable === 'managementOrganizations' && !flags['addedOrg']) {
				if(cache['apps'].length > 0) {
					for(var i in cache['apps']) {
						$(into).jqGrid('addRowData', i, cleanResponse(cache['apps'][i]));
					}
					onSort();
				}
			}else{

				cuteNSexy.runChainedEvents([ 
					{'cmd': ts.command, 'payload': pl, 'success': function (set) {
					for(var i in set) {

						$(into).jqGrid('addRowData', i, cleanResponse(set[i]));
					}
					onSort();
				
				} } ]);

			}
			
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

	function cleanResponse (obj) {
		obj = flatten(obj);

		if(type(obj.orgLevel) != 'undefined') { 		obj.orgLevel 		= orglevels[ Number(obj.orgLevel) ]; }
		if(type(obj.platform) != 'undefined') { 		obj.platform 		= platformNames[ Number(obj.platform) ]; }
		if(type(obj.viewTrack) != 'undefined') { 		obj.viewTrack 		= trackNames[ Number(obj.viewTrack) ]; }
		if(type(obj.clickTrack) != 'undefined') { 		obj.clickTrack 		= trackNames[ Number(obj.clickTrack) ]; }
		if(type(obj.installTrack) != 'undefined') { 	obj.installTrack 	= trackNames[ Number(obj.installTrack) ]; }
		if(type(obj.actionTrack) != 'undefined') { 		obj.viewTrack 		= trackNames[ Number(obj.actionTrack) ]; }
		if(type(obj.start) != 'undefined') { 			obj.start 			= new XDate(parseDMY(obj.start)).toString('d MMM yyyy'); }
		if(type(obj.end) != 'undefined') { 				obj.end 			= new XDate(parseDMY(obj.end)).toString('d MMM yyyy'); }

		if(whichTable === 'managementMakilinks') {
			if(type(obj.tags) == 'array') {
				for(var i in obj.tags) {
					if(i === 'makilinkName') {
						obj['makilinkName'] = obj.tags[i];
					}
				}
			}
		}
		return obj;
	}
	
	function flatten(obj, includePrototype, into, prefix) {
	    into = into || {};
	    prefix = prefix || "";

	    for (var k in obj) {
	        if (includePrototype || obj.hasOwnProperty(k)) {
	            var prop = obj[k];
	            if (prop && typeof prop === "object" &&
	                !(prop instanceof Date || prop instanceof RegExp)) {
	                flatten(prop, includePrototype, into, prefix + k + "_");
	            }
	            else {
	                into[prefix + k] = prop;
	            }
	        }
	    }

	    return into;
	}
	
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