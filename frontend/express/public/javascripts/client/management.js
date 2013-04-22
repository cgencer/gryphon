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
	var theModal = '';
	var userDidSelect = false;
	var _ts = this;
	var _role = {};
	var orgs = [];

	$(document).ready(function() {

		objectSets = amplify.store('objectset');
		tableSets = amplify.store('tableset');

		cuteNSexy.runChainedEvents([
			{'cmd': 'ListOrganizations', 'payload': {}, 'success': fillinOrganizations},
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
			$('#managementModal').clone().appendTo('body').attr('id', $(this).attr('id')+'Modal');
		});
		$(document).on('click', 'div.subLinks' , function () {
			$('#rightSide').html('<table id="manager"></table><div id="thePager"></div>');
			whichTable = $(this).attr('id');
			console.log('whattafuck! '+whichTable);
			createTableset(whichTable, '#manager', {});
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
		console.info('called me? who?');
		$('[aria-describedby="manager_editButton"]').each( function () {
			$(this).html('<button class="btn btn-primary editButton" alt="' +whichTable+ '" type="button">Edit</button>');
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
			$('[id='+key+']', frm).val(value);
		});
	};
	function fillinOrganizations (orgSet) {
		orgs = orgSet;
		$("#organization").autocomplete({
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
	function createdUser (response) {
		console.dir(response);
		console.info('created the user with the id '+response.userId+'...');
	};
	function fillinUsers (userSet) {
		_ts.userDidSelect = false;
		$("#name").autocomplete({
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
		$(into).jqGrid({
			'datatype': 'local', 'colNames': cn, 'colModel': cm, 'caption': ts.caption, 'autoencode': true,
			'altRows': true, 'altclass': 'tesla', 'hoverrows': false, //'multiselect': true,
			'height':'auto', 'hidegrid': false, 'ignoreCase': true, 'shrinkToFit': true, 'pager': '#thePager',

			'recordtext': 'View {0} - {1} of {2}', 'pgtext': 'Page {0} of {1}',
			'emptyrecords': 'No records to view', 'loadtext': 'Loading...',
			'rowNum': 20, 'onSortCol': onSort,
		});

		if(type(ts.command) === 'string') {

			cuteNSexy.runChainedEvents([ 
				{'cmd': ts.command, 'payload': pl, 'success': function (set) {
				for(var i in set) {
					if(type(set[i].platform) != 'undefined') {
						switch (set[i].platform) {
							case 0:
								plName = 'Unknown'
								break;
							case 1:
								plName = 'IOS'
								break;
							case 2:
								plName = 'Android'
								break;
							case 3:
								plName = 'Windows'
								break;
							case 4:
								plName = 'Symbian'
								break;
							case 5:
								plName = 'Tizen'
								break;
						}
						set[i].platform = plName;
					}
					$(into).jqGrid('addRowData', i, set[i]);
				}
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

	return {
		'createdUser': createdUser,
	}

}(window.GryphonManagement = window.GryphonManagement || {}, jQuery));