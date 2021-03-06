

  //Calling Google API
      // This example requires the Places library. Include the libraries=places
    // parameter when you first load the API. For example:
    //<script src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places">

    //Nearby 
    //https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=-33.8670522,151.1957362&radius=1500&type=restaurant&keyword=cruise&key=YOUR_API_KEY
    //https://maps.googleapis.com/maps/api/place/details/json?placeid=ChIJN1t_tDeuEmsRUsoyG83frY4&key=AIzaSyAAkK3AyE8Cbqb9H5MYqptjJwRhRgltoZM");


    var map;
    var infowindow; //Currently infoWindow is not used
    var service;
    var searchPlace;

    var input = document.getElementById("city-input");
    var searchBox;

    $.getScript("https://maps.googleapis.com/maps/api/js?key=AIzaSyCO9gxNVvg9CiM8dhQLlDsCpmsG5vylzBk&libraries=places&callback=initMap");

    function initMap() {
        
        //Get Auto complete function
        //initAutocomplete();
        searchBox = new google.maps.places.SearchBox(input);
        //get user values from Database
        var userPlace = getPlaceValues();
//        searchPlace = {lat: 41.87, lng: -87.65};
        getGeoLocations(userPlace);

 //       nearbyPlace(searchPlace.lat, searchPlace.lng, "park");

        map = new google.maps.Map(document.getElementById('map'), {
        center: searchPlace,
        zoom: 15
        });

        //Currently infowindow is not used
        infowindow = new google.maps.InfoWindow();

        service = new google.maps.places.PlacesService(map);
        service.nearbySearch({
        location: searchPlace,
        radius: 5000,
        type: ['park']
        }, callback);
        /*
        service.nearbySearch({
        location: searchPlace,
        radius: 5000,
        type: ['restaurants']
        }, callback);
        */
        service.nearbySearch({
        location: searchPlace,
        radius: 5000,
        type: ['museum']
        }, callback);
    }

    function callback(results, status) {

        if (status === google.maps.places.PlacesServiceStatus.OK) {
        for (var i = 0; i < results.length; i++) {
            // use this method to places without maps 
            getPlaceDetails(results[i]);
            
            //Use this method to display on map + list. Need to comment previous method call.
            //    createMarker(results[i]);
            }
        }
    }

    //Get user value from database
    function getPlaceValues(){
        //var database = Firebase_Database();
        var city = localStorage.getItem("city").trim();
        var zipcode = localStorage.getItem("zipcode").trim();

        if(city !== "" && typeof city !== 'undefined'){
            $("#title").append("<h4>WanderList for " + city + "</h4>");
            return city;
        }
        if(zipcode !== "" && typeof zipcode !== 'undefined'){
            $("#title").append("<h4>WanderList for " + zipcode + "</h4>");
            return zipcode;
        }
        else{
            //Send default city
            return "Chicago";
        }
            
    }

    //Get Location coordinate details for Place
    function getGeoLocations(city){
        queryURL = "https://maps.googleapis.com/maps/api/geocode/json?address=" + city + "&key=AIzaSyDxI6cMDI1nHohhOXMbQ7MUDi1GZKJ4KVM";
        var cityLocCall = new XMLHttpRequest();
        cityLocCall.open("GET", queryURL, false);
        cityLocCall.send(null);
        searchPlace = JSON.parse(cityLocCall.response).results[0].geometry.location;
    }


    //Get Details for the place
    function getPlaceDetails(place){
        service.getDetails( 
            {placeId: place.place_id},
            function(placeDet, status){
                if (status === google.maps.places.PlacesServiceStatus.OK){
                    renderDisplay(placeDet);
                }
            }
        );
        //end place details
    }

    //Render the information for display
    function renderDisplay(place){
        var arrCarousel =['#one!', '#two!', '#three!','#four!','#five!','#six!','#seven!','#eight!','#nine!','#ten!']
        var sectionPlaceInfo = $("#cityInfo");
        var divInfo = $("<div class='row'>");
        var divPlace = $("<div class='col s6 attraction z-depth-3 placeInfo'>");

        divPlace.append("<strong> Place Name: " + place.name + "</strong>");
        divPlace.append('<br> Address: ' + place.formatted_address);
        divPlace.append("<br>Rating: " + place.rating);
        divPlace.append("<br> Review:");

        //get reviews
        var reviews = place.reviews;
        if(typeof reviews !== 'undefined'){
            for(i=0; i<reviews.length; i++){
                divPlace.append("<br>" + parseInt(i+1) +". " +reviews[i].text);
                if(i===2){
                    break;
                }
            }
        }
        else{
            divPlace.append("<br> No Reviews.");                
        }

        //Get Photos
        if(typeof place.photos !== 'undefined'){
            var divImg = $("<div class='col s5 offset-s1 attractionImage carousel'>");
            for(i=0; i< place.photos.length; i++) {
                var aCarousel = $("<a class='carousel-item' href='"+ arrCarousel[i] +"'>");
                var placeImg = $("<img>").attr("src", place.photos[i].getUrl({maxHeight: 300}));
                aCarousel.append(placeImg)
                divImg.append(aCarousel);
            }//end photos
            divInfo.append(divPlace,divImg);
            sectionPlaceInfo.append(divInfo);
            $('.carousel').carousel();
    
        }
    }

    function initAutocomplete() {
        /*
            var map = new google.maps.Map(document.getElementById('map'), {
                center: {lat: 41.87, lng: -87.65},
                zoom: 15,
                mapTypeId: 'roadmap'
            });
            */
           var input = document.getElementById("city-input");
           var searchBox = new google.maps.places.SearchBox(input);
           searchBox.addListener('places_changed', function() {
                var places = searchBox.getPlaces();
                if (places.length == 0) {
                    return;
                 }
            });
        }
    
    //This method is not used. This method can be used if you want to displace map with location
    function createMarker(place) {
        var placeLoc = place.geometry.location;
        var marker = new google.maps.Marker({
        map: map,
        position: place.geometry.location
        });
        //To displace places in list format along with map
        getPlaceDetails(place);

        google.maps.event.addListener(marker, 'click', function() {
        infowindow.setContent(place.name);
        infowindow.open(map, this);
        });
    }
