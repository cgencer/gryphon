$(document).ready(function() {
	$('#content').text('booting up...');
	var cfdata = {};
	var here = this;
	$.ajax({
		url : "dataset.json",
		dataType: "json",
		error: function(jqXHR, textStatus, errorThrown) {
			if (jqXHR.status === 0) {
				_error = 'Not connect.\n Verify Network.';
			} else if (jqXHR.status == 404) {
				_error = 'Requested page not found. [404]';
			} else if (jqXHR.status == 500) {
				_error = 'Internal Server Error [500].';
			} else if (textStatus === 'parsererror') {
				_error = 'Requested JSON parse failed.';
			} else if (textStatus === 'timeout') {
				_error = 'Time out error.';
			} else if (textStatus === 'abort') {
				_error = 'Ajax request aborted.';
			} else {
				_error = 'Uncaught Error.\n' + jqXHR.responseText;
			}
			console.log(_error);
		},
		success : function (data) {
//			console.dir(data);
			$('#content').text('loaded the file...');
			here.cfdata = crossfilter(data);
			$('#tablature').dataTable({
				'aaData':data,
				'bJQueryUI': true,
				'sPaginationType': "full_numbers",
				'aoColumns': [
					{'mData':'city'},
					{'mData':'country'},
					{'mData':'zip'},
					{'mData':'music'},
					{'mData':'eyecolor'},
				]
			});

//			for(var i in data) {
//				$('#content').append('<div>'+i+' ---> '+data[i]+'</div>');
//			}
		}
	});
});
