$(document).ready(function() {
    var band;

    //This is the jqueryUI Api to allow a interactive date picker
    $(function() {
        $("#sdate").datepicker();
    });
    //when the search button is clicked....
    $("#singlebutton").on("click", function(event) {

        $(".event").remove();
        $("#badSearch").remove();

        event.preventDefault();
        console.log("hello")
            //pull the event name and remove any spaces to avoid errors
        var input = "&keyword=" + $("#band").val();
        var focus = input;
        band=$("#band").val();
        console.log(focus);



        //pull the city from the input remove spaces
        var locali = "&city=" + $("#location").val();
        var local = locali;

        

        //holds the number by it self for later use
        var num = $("#events").val();

        //get the radius from the city which the user is willing to travel
        var radi = "&radius=" + $("#radius").val();

        console.log(radi);

        //the range of dates the user wants to search for events
        var sDate = moment($("#sdate").val()).format();
        var startDate = "&startDateTime=" + sDate;



        // smash it all together
        var url = "https://app.ticketmaster.com/discovery/v2/events.json?apikey=a5upVMn0jR69IVVxnz7eNimthI2Jugow" + focus + local + "&size=5";
       


        if($("#radius").val() != "-"){
            url += radi;
        };

        if ($("#sdate").val() != "") {

            url += startDate;

        };
         console.log(url);

        $.ajax({
            type: "GET",
            "url": url,
            "async": true,
            "crossDomain": true,
            "dataType": "json",

            success: function(response) {
                if (response._embedded == undefined) {
                    console.log("Sorry There are no Events with Your Preferences");
                    var newDiv = $("<div id='badSearch'>");
                    $("#results").append(newDiv);
                    var holder = $("<br><h2 class='errorMessage'>Sorry There Are No Events with Your Preferences</h2><h3 class='errorMessage'>You Can Try Again After Changing Some Stuff Around</h3>");
                    $("#badSearch").append(holder);

                } else {

                    var info = JSON.stringify(response._embedded.events[0].name);

                    console.log(response._embedded.events);

                    console.log(response._embedded.events.length);

                    for (var i = 0; i < response._embedded.events.length; ++i) {
                        //var item     = "apple" + i ;
                        //var title    = "pear"+i;
                        //var pic      = "zebra"+i;
                        //var viewitem = "elephant"+i;

                        // if (null != title && null != viewitem) {

                        var event = response._embedded.events[i];

                        //the name of the event
                        var title = event.name;
                        //band = title;
                        console.log(title);

                        //the date and time of the event
                        function convert_date(input) {
                            return moment(input, 'YYYY-MM-DD').format('MM-DD-YYYY');
                        }
                        var when = convert_date(event.dates.start.localDate);
                        console.log(when);


                        function convert_time(input) {
                            return moment(input, 'HH:mm').format('h:mm A');
                        }
                        var time = convert_time(event.dates.start.localTime);
                        console.log(time);


                        //link dirrectly to the tickets
                        var tickets = event.url;
                        console.log(tickets);


                        var image = event.images[1].url;
                        console.log(image);


                        //venue
                        var venue = event._embedded.venues[0].name;
                        console.log(venue);

                        console.log(i);
                        var event_id = "event" + i;
                        var table_id = "table" + i;
                        var table_body_id = "table_body_id" + i;
                        var table_row_id = "row" + i;

                        

                        

                        $('#results').append("<div id=" + event_id + " class=event>");
                        $('#' + event_id).append("<table id=" + table_id + ">");
                        $('#' + table_id).append("<tbody id=" + table_body_id + ">");
                        $('#' + table_body_id).append("<tr id=" + table_row_id + ">");


                        $('#' + table_row_id).append("<td><img src=" + image + " width=100 height=100></td>");
                        $('#' + table_row_id).append("<td class='textInfo'><a href=" + tickets + "><div>" + title + "</div></a><div>" + venue + "</div><div>" + when + "</div><div>" + time + "</div></td>");
                        // $('#' + table_row_id).append("<td>"+venue+"</td>");
                        //$('#' + table_row_id).append("<td>"+when+"</td>");
                        //$('#' + table_row_id).append("<td>"+time+"</td>");
                        // $('#' + table_row_id).append("<td>"+tickets+"</td>");




                    }
                }
            },

            error: function(response) {
                console.log("nope didnt work");
            }

        });




    });






    $("#results").on("click", ".event", function() {
        var event_id = this.id;

        items_id = ("item" + event_id);


        $('#' + event_id).append("<div id=" + items_id + " class=item>");



        $(".item").not('#' + items_id).remove();



        var apikey = "xyzxyz-hello-PRD-1134e8f72-d7f6a09c";
        var keywords = band;
        var entries = 5;

        var url = "https://svcs.ebay.com/services/search/FindingService/v1?SECURITY-APPNAME=" + apikey + "&OPERATION-NAME=findItemsByKeywords&SERVICE-VERSION=1.0.0&RESPONSE-DATA-FORMAT=JSON&callback=_cb_findItemsByKeywords&REST-PAYLOAD&keywords=" + keywords + "&paginationInput.entriesPerPage=" + entries + "&GLOBAL-ID=EBAY-US&siteid=0";




        $.ajax({
            url: url,
            dataType: "jsonp"
        });

    });

});






function _cb_findItemsByKeywords(root) {
    console.log(root);
    var items = root.findItemsByKeywordsResponse[0].searchResult[0].item || [];
    console.log(items);
    var html = [];
    html.push('<table width="100%" border="0" cellspacing="0" cellpadding="3"><tbody>');

    for (var i = 0; i < items.length; ++i) {
        var item = items[i];
        var title = item.title;
        var pic = item.galleryURL;
        var viewitem = item.viewItemURL;

        if (null != title && null != viewitem) {
            html.push('<tr><td>' + '<img src="' + pic + '" border="0">' + '</td>' +
                '<td><a href="' + viewitem + '" target="_blank">' + title + '</a></td></tr>');
        }
    }
    html.push('</tbody></table>');
    document.getElementById(items_id).innerHTML = html.join("");

    $("#" + items_id).each(function() {
        var $this = $(this);
        var newrows = [];
        $this.find("tr").each(function() {
            var i = 0;
            $(this).find("td").each(function() {
                i++;
                if (newrows[i] === undefined) {
                    newrows[i] = $("<tr></tr>");
                }
                newrows[i].append($(this));
            });
        });
        $this.find("tr").remove();
        $.each(newrows, function() {
            $this.append(this);
        });

    });
};
///1 Comment