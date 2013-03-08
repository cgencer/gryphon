(function(){

	_this = this;
/*
	$.fn.parseTemplate = function(data)
	{
	    var str = (this).html();
	    var _tmplCache = {}
	    var err = "";
	    try
	    {
	        var func = _tmplCache[str];
	        if (!func)
	        {
	            var strFunc =
	            "var p=[],print=function(){p.push.apply(p,arguments);};" +
	                        "with(obj){p.push('" +
	            str.replace(/[\r\t\n]/g, " ")
	               .replace(/'(?=[^#]*#>)/g, "\t")
	               .split("'").join("\\'")
	               .split("\t").join("'")
	               .replace(/<#=(.+?)#>/g, "',$1,'")
	               .split("<#").join("');")
	               .split("#>").join("p.push('")
	               + "');}return p.join('');";

	            //alert(strFunc);
	            func = new Function("obj", strFunc);
	            _tmplCache[str] = func;
	        }
	        return func(data);
	    } catch (e) { err = e.message; }
	    return "< # ERROR: " + err.toString() + " # >";
	}
*/	
	var preroll = $('accpack').html();

	var sexy = Object.create(cuteNSexy);
	sexy.init();

	$('a#sdk-menu').click(function(){
		$('#accpack').html( preroll );
		$('#tokens').html('');
		$('#apps').html('');
		$('#devices').html('');
	});

	$(document).ready(function() {
		$("#accordion").accordion({heightStyle: 'content', autoHeight:false, clearStyle: true});
		$("#accordion").accordion({ active: 0 });
		$("#accordion").accordion( "refresh" );
		$("#progressbar").progressbar({value: 20});
		$('#username').html(amplify.store('name'));
		$('#unick').html( amplify.store( "name" ));
//		sexy.run('AppWizListUserTokens', {'userId': amplify.store( "uid" )}, receivedTokens, fail);
	});

	fail = function(err){
		console.error(err);
	}

	$('a[href="#/sdk/android"]').click(function(){
		$('#sdkdocs').html( $('div#android').html() );
		this.preroll = $('accpack').html();
		$('#accpack').show();
		$('#conpack').hide();
	});

	$('a[href="#/sdk/ios"]').click(function(){
		$('#sdkdocs').html( $('div#ios').html() );
		this.preroll = $('accpack').html();
		$('#accpack').show();
		$('#conpack').hide();
	});

	function receivedTokens(){

		var r = '';
		for (idx in sexy.buffer.tokens) {

			r += '' + 
			'<tr id="' + sexy.buffer.tokens[idx].token + '" class="tokenselect">' + 
			'<td id="token">' + sexy.buffer.tokens[idx].token+ '</td>' + 
			'<td id="description">'+sexy.buffer.tokens[idx].desc+'</td>' + 
			'</tr>';
		}
		$('#tokens').html(r);
		$( "#accordion" ).accordion( "refresh" );

		$('.tokenselect').click(function(){
			$( "#progressbar" ).progressbar({value: 40});
			sexy.tokenDetails($(this).attr('id'), amplify.store( "sid" ));
			$( "#accordion" ).accordion({ active: 1 });
		})
		$(document).one("receivedDetails", receivedDetails);
	}

	function deviceOK(){
		var r = '';
		for (idx in sexy.buffer.devices) {

			var dx = sexy.buffer.devices;
			whenyear = dx[idx].when.date.slice(4,4);
			whenmonth = dx[idx].when.date.slice(2,2);
			whenday = dx[idx].when.date.slice(0,2);
			whenhour = dx[idx].when.date.slice(0,2);
			whenmin = dx[idx].when.date.slice(2,2);
			whensec = dx[idx].when.date.slice(4,2);

			r += '<tr>' + 
			'<td id="ip">' + dx[idx].ipAddress +'</td>' + 
			'<td id="os">' + dx[idx].deviceInfo.deviceOs+ ' (v' + dx[idx].deviceInfo.deviceOsVersion + ')' +'</td>' + 
			'<td id="brandmodel">' + dx[idx].deviceInfo.brandName+' '+dx[idx].deviceInfo.modelName+ '</td>' + 
			'<td id="resolution">' + dx[idx].deviceInfo.resolutionWidth +' / '+ dx[idx].deviceInfo.resolutionHeight+'</td>' + 
			'<td id="mdate">' + whenday+':'+whenmonth+':'+whenyear + ' / ' + whenhour+':'+whenmin+':'+whensec +'</td>' + 
			'</tr>';
		}
		$('#devices').html(r);

	}

	function receivedDetails(){
		var r = '';
		var t = {};
		
		for (idx in sexy.buffer.tokens) {

			sexy.tokenDetails( sexy.buffer.tokens[idx].token, amplify.store( "sid" ) );
			t = 

				r += '<tr class="checkDevice" id="'+sexy.buffer.app.appId+'">' + 
				'<td id="appname">' + sexy.buffer.app.appName + '</td>' +
				'<td id="marketurl">' + '<a href="' + sexy.buffer.app.marketUrl + '">' + sexy.buffer.app.marketUrl + '</a>' +
				'<td id="platform">' + sexy.buffer.app.platform + '</td>' +
				'<td id="appdesc">' + sexy.buffer.app.appDescription + '</td></tr>';

		}

		$('#dashlink1').attr('href', sexy.buffer.app.countlyUrl);
		$('#dashlink2').attr('href', sexy.buffer.app.countlyUrl);
		$('#dashlink2').text(sexy.buffer.app.countlyUrl);

		$('#apps').html(r);
		$('#username').html( sexy.buffer.app.userName );
		$('#nick').html( " (" + amplify.store( "name" ) + ")" );
		$('#clickDoc').click(function() {
			$( "#progressbar" ).progressbar({value: 80});
			$( "#accordion" ).accordion({ active: 3 });
		});
		$('#clickDevice').click(function() {
			$( "#progressbar" ).progressbar({value: 100});
			$( "#accordion" ).accordion({ active: 4 });
		});
		$(document).on("deviceOK", deviceOK);
		$('tr.checkDevice').click(function() {
			$( "#progressbar" ).progressbar({value: 60});
			$( "#accordion" ).accordion({ active: 2 });
			var con = $(this).attr('id');
			sexy.checkDevice(con, amplify.store( "sid" ));
			$('#checkMe').click(function(){
				sexy.checkDevice(con, amplify.store( "sid" ));
			});
		});
	}

})();