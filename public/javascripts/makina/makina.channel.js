var _channelRowId;

function GetChannelsSuccessCallBack(obj) {
	$.when(makinaChannel.SetChannels(obj.ListChannelResult.infoList)).then(makinaChannel.initialize());
}

function GetChannelsFailedCallBack(obj) {

	if (obj.ListAppsResult !=null && obj.ListAppsResult.visibleMessage != null) {
		alert(obj.ListAppsResult.visibleMessage);
	}

	if (obj.message != null) {
		alert(obj.message);
	}

	return;
}

function GetChannels() {
	var b = new ListChannelRequest('', 1, 1, '', 'GetChannelsSuccessCallBack', 'GetChannelsFailedCallBack');
	b.send();
}

function AddUpdateChannelSuccessCallBack(obj) {
	if(obj.AddUpdateChannelResult != null && obj.AddUpdateChannelResult.status == "ERROR") {
		AddUpdateChannelFailedCallBack(obj);
		return;
	}
	
	_channelRowId= null;
	GetChannels();
}

function AddUpdateChannelFailedCallBack(obj) {
	if (obj.AddUpdateChannelResult != null && obj.AddUpdateChannelResult.visibleMessage != null) {
		alert(obj.AddUpdateChannelResult.visibleMessage);
	}

	if (obj.message != null) {
		alert(obj.message);
	}
	return;
}

function DeleteChannelSuccessCallBack(obj) {
	if(obj.AddUpdateChannelResult != null && obj.AddUpdateChannelResult.status == "ERROR") {
		AddUpdateChannelFailedCallBack(obj);
		return;
	}
	
	_channelRowId = null;
	GetChannels();
}

function DeleteChannelFailedCallBack(obj) {
	if (obj.AddUpdateChannelResult != null && obj.AddUpdateChannelResult.visibleMessage != null) {
		alert(obj.AddUpdateChannelResult.visibleMessage);
	}

	if (obj.message != null) {
		alert(obj.message);
	}
	return;
}

function AddUpdateChannel() {
	var id = "";
	var channelKeyName = "";
	var description = "";
	var actionTrack = "";
	var clickTrack = "";
	var installTrack = "";
	var viewTrack = "";

	if (_channelRowId != null) {
		id = $("#tr-data-" + _channelRowId + " #channel-id").val();
		channelKeyName = $("#tr-data-" + _channelRowId + " #channel-key-name").val();
		description = $("#tr-data-" + _channelRowId + " #channel-description").val();
		actionTrack = $("#tr-data-" + _channelRowId + " #channel-action-track  option:selected").val();
		clickTrack = $("#tr-data-" + _channelRowId + " #channel-click-track  option:selected").val();
		installTrack = $("#tr-data-" + _channelRowId + " #channel-install-track  option:selected").val();
		viewTrack = $("#tr-data-" + _channelRowId + " #channel-view-track  option:selected").val();
	}
	else {
		channelKeyName = $("#tr-data-new-channel #channel-key-name").val();
		description = $("#tr-data-new-channel #channel-description").val();
		actionTrack = $("#tr-data-new-channel #channel-action-track  option:selected").val();
		clickTrack = $("#tr-data-new-channel #channel-click-track  option:selected").val();
		installTrack = $("#tr-data-new-channel #channel-install-track  option:selected").val();
		viewTrack = $("#tr-data-new-channel #channel-view-track  option:selected").val();
	}

	var b = new AddUpdateChannelRequest(id, channelKeyName, description, actionTrack, clickTrack, installTrack, viewTrack, false, 'AddUpdateChannelSuccessCallBack', 'AddUpdateChannelFailedCallBack');
	b.send();
};

function DeleteChannel() {
	var id = "";
	var channelKeyName = "";
	var description = "";
	var actionTrack = "";
	var clickTrack = "";
	var installTrack = "";
	var viewTrack = "";

	if (_channelRowId != null) {
		id = $("#tr-data-" + _channelRowId + " #channel-id").val();
		channelKeyName = $("#tr-data-" + _channelRowId + " #channel-key-name").val();
		description = $("#tr-data-" + _channelRowId + " #channel-description").val();
		actionTrack = $("#tr-data-" + _channelRowId + " #channel-action-track  option:selected").val();
		clickTrack = $("#tr-data-" + _channelRowId + " #channel-click-track  option:selected").val();
		installTrack = $("#tr-data-" + _channelRowId + " #channel-install-track  option:selected").val();
		viewTrack = $("#tr-data-" + _channelRowId + " #channel-view-track  option:selected").val();

		var b = new AddUpdateChannelRequest(id, channelKeyName, description, actionTrack, clickTrack, installTrack, viewTrack, true, 'DeleteChannelSuccessCallBack', 'DeleteChannelFailedCallBack');
		b.send();
	}
};


function DisplayUpdateChannelRow(rowId) {

	$("tr[id*='tr-data-channel']").hide();

	$("#tr-" + rowId).addClass("active");
	$("#tr-data-" + rowId).addClass("active");

	makinaChannel.SetActiveChannel($("#tr-data-" + rowId + " #channel-id").val());

	var activeChannel = makinaChannel.GetActiveChannel();

	$("#tr-data-" + rowId + " #channel-view-track").val(activeChannel.viewTrack);
	$("#tr-data-" + rowId + " #channel-install-track").val(activeChannel.installTrack);
	$("#tr-data-" + rowId + " #channel-action-track").val(activeChannel.actionTrack);
	$("#tr-data-" + rowId + " #channel-click-track").val(activeChannel.clickTrack);

	$("#tr-data-" + rowId).show();

	_channelRowId = rowId;
}

function HideUpdateChannelRow(rowId) {

	if ($("#tr-" + rowId).hasClass("active")) { $("#tr-" + rowId).removeClass("active"); }
	if ($("#tr-data-" + rowId).hasClass("active")) { $("#tr-data-" + rowId).removeClass("active"); }

	$("#tr-data-" + rowId).hide();

	_channelRowId = null;
}

function DisplayCreateChannelRow() {

	$("tr[id*='tr-data-channel']").hide();
	$("#tr-data-new-channel").show();
}

function HideCreateChannelRow() {
	$("#tr-data-new-channel").hide();
}

function GetTrackName(platformId) {
	var result = "";

	switch (platformId) {
	case 0:
		result = "None";
		break;
	case 1:
		result = "via UI";
		break;
	case 2:
		result = "via Makilink";
		break;
	case 3:
		result = "via SDK";
		break;
	}
	return result;
}


(function (makinaChannel, $, undefined) {
	var _channels = null;
	var _channel = null;
	
	makinaChannel.SetChannels = function(channels) {
		_channels = channels;
	};

	makinaChannel.GetChannels = function() {
		return _channels;
	};
	
	makinaChannel.SetActiveChannel = function(channelId) {
		var channels = makinaChannel.GetChannels();

		if(channels != null) {
			for(var i=0;i<channels.length;i++) {
				if(channels[i].channelId == channelId) {
					_channel = channels[i];
					break;
				}
			}
		}
	};

	makinaChannel.GetActiveChannel = function() {
		return _channel;
	};

	makinaChannel.initialize = function() {
		var html = "";
		
		for(var i = 0;i<_channels.length;i++) {
			var rowId = "channel-" + i.toString();
			var description = _channels[i].description;
			var channelId = _channels[i].channelId;
			var channelName = _channels[i].channelKeyName;
			var actionTrack = _channels[i].actionTrack;
			var installTrack = _channels[i].installTrack;
			var clickTrack = _channels[i].clickTrack;
			var viewTrack = _channels[i].viewTrack;
			html = html + "<tr  id='tr-" + rowId + "' style='opacity: 1;'>" +
				"	<td class='user-username'>" + channelName + "</td>" +
				"	<td class='user-username'>" + description + "</td>" +
				"	<td class='user-username'>" + GetTrackName(viewTrack) + "</td>" +
				"	<td class='user-username'>" + GetTrackName(clickTrack) + "</td>" +
				"	<td class='user-username'>" + GetTrackName(installTrack) + "</td>" +
				"	<td>" +
				"		<div>" +
				"			<span class='user-email'>" +  GetTrackName(actionTrack) + "</span>" +
				"			<div class='help-edit'><a id='channel-edit-link' href='javascript:DisplayUpdateChannelRow(\"" + rowId + "\");'>Click to edit</a></div>" +
				"			<div class='help-close'><a id='channel-close-link' href='javascript:HideUpdateChannelRow(\"" + rowId + "\");'>Click to close</a></div>" +
				"		</div>" +
				"	</td>" +
				"</tr>" +
				"<tr id='tr-data-" + rowId + "' style='display: none;' class='user-details'>" +
				"	<td colspan='6'>" +
				"		<div>" +
				"			<div class='row'>" +
				"				<div class='title'>Channel Id</div><div class='detail'><input id='channel-id' class='full-name-text' readonly='true' value='" + channelId + "' type='text'></div>" +
				"			</div>" +
 				"			<div class='row'>" +
				"				<div class='title'>Channel Key Name</div><div class='detail'><input id='channel-key-name' class='username-text' value='" + channelName + "' type='text'></div>" +
				"			</div>" +
				"			<div class='row'>" +
				"				<div class='title'>Description</div><div class='detail'><input id='channel-description' class='email-text' value='" + description + "' type='text'></div>" +
				"			</div>" +
				"			<div class='row'>" +
				"				<div class='title'>View Track</div><div class='detail'>" +
				"					<select id='channel-view-track'>" +
				"						<option value='0'>None</option>" +
				"						<option value='1'>via UI</option>" +
				"						<option value='2'>via Makilink</option>" +
				"						<option value='3'>via SDK</option>" +
				"					</select>" +
				"				</div>" +
				"			</div>" +
				"			<div class='row'>" +
				"				<div class='title'>Click Track</div><div class='detail'>" +
				"					<select id='channel-click-track'>" +
				"						<option value='0'>None</option>" +
				"						<option value='1'>via UI</option>" +
				"						<option value='2'>via Makilink</option>" +
				"						<option value='3'>via SDK</option>" +
				"					</select>" +
				"				</div>" +
				"				</div>" +
				"			<div class='row'>" +
				"				<div class='title'>Install Track</div><div class='detail'>" +
				"					<select id='channel-install-track'>" +
				"						<option value='0'>None</option>" +
				"						<option value='1'>via UI</option>" +
				"						<option value='2'>via Makilink</option>" +
				"						<option value='3'>via SDK</option>" +
				"					</select>" +
				"				</div>" +
				"			</div>" +
				"			<div class='row'>" +
				"				<div class='title'>Action Track</div><div class='detail'>" +
				"					<select id='channel-action-track'>" +
				"						<option value='0'>None</option>" +
				"						<option value='1'>via UI</option>" +
				"						<option value='2'>via Makilink</option>" +
				"						<option value='3'>via SDK</option>" +
				"					</select>" +
				"				</div>" +
				"			</div>" +
				"			<div class='button-container'><a class='icon-button light create-user' id='update-channel' href='javascript:AddUpdateChannel();'>Update</a><a id='cancel-update-channel' href='javascript:HideUpdateChannelRow(\"" + rowId + "\");' class='icon-button light cancel-user'>Cancel</a><a class='icon-button red delete-user' href='javascript:DeleteChannel();'>Delete channel</a></div>" +
				"		</div>" +
				"	</td>" +
				"</tr>";
		}

		$("#content").html($("#template-channels").html().replace("{{Channels}}", html));
	};
}(window.makinaChannel = window.makinaChannel || {}, jQuery));
