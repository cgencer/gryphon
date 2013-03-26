var GryphonDashboard = (function(GryphonDashboard, $, undefined){

	google.load('visualization', '1.0', {'packages':['corechart', 'table', 'geochart']});

	function sMenuReceived(package) {
		console.dir(package);
	}
	function fMenuReceived(package) {
		console.dir(package);
	}
	function getContent() {
	    return  $('#containerForCalendar').html();
	};

	$(document).ready( function() {

		$.datepicker.setDefaults( $.datepicker.regional['en'] );
		$("#containerForCalendar").datepicker({'numberOfMonths':2});
		$('a[rel=tooltip]').popover({'html':true, 'trigger':'click', 'placement':'bottom', 'content': getContent()});

		$("#create-widget").click( function(){
			var options={
				"url": "http://makina.nmdapps.com/Events/Report/MAKINA/CIRawReport",
				"refreshTime": 20,
				"fetchOptions": [
					{
						"type":"sum", // sum, group by
						"name":"fetch 1",
						"byColumns":[], // group bys
						"columns":['timeslotCLICK','timeslotINSTALL'],// city,app,company
						"fetchCallBack": fetchCallBackSum
					}, {
						"type":"groupby", // sum, group by
						"name":"fetch 2",
						"byColumns":['CountryCode','City'], // group bys
						"columns":['timeslotCLICK','timeslotINSTALL'],// city,app,company
						"fetchCallBack": fetchCallBackGroupBy
					}, {
						"type":"groupby", // sum, group by
						"name":"fetch 3",
						"byColumns":['CountryCode'], // group bys
						"columns":['timeslotCLICK','timeslotINSTALL'],// city,app,company
						"fetchCallBack": fetchCallBackGroupBy2
					}
				],
				"responseSuccessCallBack" : responseSuccessCallBack,
				"responseErrorCallBack": responseErrorCallBack
			};
			var widget1 =  new HandsomeWidget(options,"widget-console");

			console.log("widget1");
			console.log(widget1);
		});

		cuteNSexy.setPaths(amplify.store( 'paths'));
		cuteNSexy.setDictionary(amplify.store( 'dictionary'));
		
		$('.sideBar').height( $(window).height() );
		cuteNSexy.runChainedEvents([ {'cmd': 'GetMenuItems', 'success': sMenuReceived, 'fail': fMenuReceived, 'payload': {'userId':123} } ]);





	});

    function fetchCallBackGroupBy (response){
        console.log("fetchCallBackGroupBy++++++++++++++");
        console.log(response);
        drawGeoMap(response.response);
    }
    function fetchCallBackSum (response){
        console.log("fetchCallBackSum++++++++++++++");
        console.log(response);
    }
    function responseSuccessCallBack (response){
        console.log(" JSONP responseSuccessCallBack");
    }
    function responseErrorCallBack (response){
        console.log(" JSONP responseErrorCallBack")
    }
	function fetchCallBackGroupBy2 (response){

    }

    function drawGeoMap(arr){
        var chart = new google.visualization.GeoChart(document.getElementById("content-widget"));
        var data =[ ['Country', 'Click'] ];
        for(var i in arr){

            var item = arr[i];
            if(item["CountryCode"]=="TR"){

                var city = item["City"];
                var click = 0;
                if(item["timeslotCLICK"]!= undefined)
                    click =item["timeslotCLICK"]["c"];
                if(isNaN(click))
                    click =0;

                var dataItem =[city,click]
                data.push(dataItem);
            }
        }

        var options = {
            region: 'TR',
            displayMode: 'markers',
            colorAxis: {colors: ['green', 'blue']}
        };

        var dataTable = google.visualization.arrayToDataTable(data);
        chart.draw(dataTable, options);
    }


	return {
		'fetchCallBackGroupBy': 	fetchCallBackGroupBy,
		'fetchCallBackSum': 		fetchCallBackSum,
		'responseSuccessCallBack': 	responseSuccessCallBack,
		'responseErrorCallBack': 	responseErrorCallBack,
		'fetchCallBackGroupBy2': 	fetchCallBackGroupBy2,
	}


}(window.GryphonDashboard = window.GryphonDashboard || {}, jQuery));