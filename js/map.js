var map, infoWindow;
var placeMarkers = [];
var defaultAddress = {
    lat: 12.9715987,
    lng: 77.59456269999998
};
var userLocaladrs, flag = 0;
var geoLoc = {
    lat: 0,
    lng: 0
};
var defaultId = "ChIJbU60yXAWrjsR4E9-UejD3_g";
var placeInfoWindow;

function initMap() {
    var zoomAutocomplete = new google.maps.places.Autocomplete(
        document.getElementById('area-text'));
    // Try HTML5 geolocation.
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            var pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };
            userLocaladrs = pos;
            getName(pos);//get name of place for wiki link
            map = new google.maps.Map(document.getElementById('map'), {
            mapTypeControl: false,
            //default lat lng
            center: pos,
            zoom: 10
            });
            map.setCenter(pos);
            zoomAutocomplete.bindTo('bounds', map);
            addMarkeronZoom(pos, " ");
            findPlaces('hospital',pos, 5000);
        }, function() {
            map = new google.maps.Map(document.getElementById('map'), {
            mapTypeControl: false,
            //default lat lng
            center: defaultAddress,
            zoom: 10
            });
            zoomAutocomplete.bindTo('bounds', map);
            handleLocationError(true, infoWindow, map.getCenter());
        });
    } else {
            // Browser doesn't support Geolocation
            map = new google.maps.Map(document.getElementById('map'), {
            mapTypeControl: false,
            //default lat lng
            center: defaultAddress,
            zoom: 10
            });
            zoomAutocomplete.bindTo('bounds', map);
        handleLocationError(false, infoWindow, map.getCenter());
    }
}

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
    alert('Error: The Geolocation service failed. Default location will be set.');
    addMarkeronZoom(defaultAddress, defaultId);
    flag = 1;
    findPlaces('hospital',defaultAddress, 5000);
}

var getName = function(pos) {
    var name;
    console.log(pos);
    var getnametimeOut = setTimeout(function() {
    alert('Error: The geocode service failed.Try Again Later');
    }, 8000);
    $.ajax({
        url: 'https://maps.googleapis.com/maps/api/geocode/json?latlng=' + pos.lat + ',' + pos.lng + '&sensor=false',
        success: function(data) {
            clearTimeout(getnametimeOut);
            retriveName(data);
        }
    });
};
var retriveName = function(data) {
    var arrAddress = data.results[0].address_components;
    // iterate through address_component array
    for (var i = 0; i < arrAddress.length; i++) {
        if (arrAddress[i].types[0] == "locality") {
            userLocalAddr = arrAddress[i].long_name;
            break;
        }
    }
    console.log(userLocalAddr);
};

//add marker to searched area.
function addMarkeronZoom(pos, id) {
    var marker = new google.maps.Marker({
        position: pos,
        map: map,
        title: "Selected Area",
        id: id,
        animation: google.maps.Animation.DROP
    });


    var defaultIcon = makeMarkerIcon('CC0000');
    var highlightedIcon = makeMarkerIcon('6600CC');
    infoWindow = new google.maps.InfoWindow();

    if (id != " ") {
        marker.addListener('click', function() {
            getPlacesDetails(this, infoWindow);
        });
    } else {
        marker.addListener('click', function() {
            infoWindow.setContent('<h4>Your Location<br>' + "lat:" + pos.lat + "<br>lng:" + pos.lng + "</h4>");
            infoWindow.open(map, marker);
        });
    }
    marker.addListener('mouseover', function() {
        this.setIcon(highlightedIcon);
    });
    marker.addListener('mouseout', function() {
        this.setIcon(defaultIcon);
    });

}

function makeMarkerIcon(markerColor) {
    var markerImage = new google.maps.MarkerImage(
        'https://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|' + markerColor +
        '|40|_|%E2%80%A2',
        new google.maps.Size(21, 34),
        new google.maps.Point(0, 0),
        new google.maps.Point(10, 34),
        new google.maps.Size(21, 34));
    return markerImage;
}

function hideMarkers(markers) {
        for (var i = 0; i < markers.length; i++) {
            markers[i].setMap(null);
        }
    }
    //get users searched area using geocoder

function userArea() {
        // Initialize the geocoder.
        var geocoder = new google.maps.Geocoder();
        // Get the address or place that the user entered.
        var address = document.getElementById('area-text').value;
        // Make sure the address isn't blank.
        if (address === '') {
            window.alert('You must enter an area, or address.');
        } else {
            // Geocode the address/area entered to get the center. Then, center the map
            // on it and zoom in
            geocoder.geocode({
                address: address
            }, function(results, status) {
                if (status == google.maps.GeocoderStatus.OK) {
                    geoLoc.lat = results[0].geometry.location.lat();
                    geoLoc.lng = results[0].geometry.location.lng();
                    map.setCenter(results[0].geometry.location);
                    map.setZoom(10);
                    addMarkeronZoom(results[0].geometry.location, results[0].place_id);
                    findPlaces('hospital',results[0].geometry.location, 5000);
                } else {
                    window.alert('We could not find that location - try entering a more' +
                        ' specific place.');
                }
            });
        }
    }
    //get the user lat lng when filter function is called
function getplace() {
        console.log(userLocaladrs);
        var foo;
        var geocoder = new google.maps.Geocoder();
        var address = document.getElementById('area-text').value;
        if (address === '') {
            if (flag == 1) {
                return defaultAddress;
            } else {
                console.log(userLocaladrs);
                return userLocaladrs;
            }
        } else {
            return geoLoc;
        }
    }
    //get markers using placesservice
function findPlaces(type, loc, rad) {
        var bounds = map.getBounds();
        hideMarkers(placeMarkers);
        var placesService = new google.maps.places.PlacesService(map);
        placesService.textSearch({
            type: type,
            location: loc,
            radius: rad
        }, function(results, status) {
            if (status === google.maps.places.PlacesServiceStatus.OK) {
                createMarkersForPlaces(results);
            }
            else{
               window.alert("Sorry we could place Markers");
            }
        });
        map.setZoom(10);
    }
    //creating marker for each mached places
function createMarkersForPlaces(places) {
        placeMarkers.length = 0;
        var bounds = new google.maps.LatLngBounds();
        for (var i = 0; i < places.length; i++) {
            var place = places[i];
            var icon = {
                url: place.icon,
                size: new google.maps.Size(35, 35),
                origin: new google.maps.Point(0, 0),
                anchor: new google.maps.Point(15, 34),
                scaledSize: new google.maps.Size(25, 25)
            };
            // Create a marker for each place.
            var marker = new google.maps.Marker({
                map: map,
                icon: icon,
                title: place.name,
                position: place.geometry.location,
                id: place.place_id,
                animation: google.maps.Animation.DROP
            });
            //add names to global marker array
            markerName[i] = place.name;
            // Create a single infowindow to be used with the place details information
            // so that only one is open at once.
            placeInfoWindow = new google.maps.InfoWindow();
            // If a marker is clicked, do a place details search on it in the next function.
            marker.addListener('click', function() {
                if (placeInfoWindow.marker == this) {
                    window.alert("This infowindow already is on this marker!");
                } else {
                    getPlacesDetails(this, placeInfoWindow);
                }
            });

            placeMarkers.push(marker);
            if (place.geometry.viewport) {
                // Only geocodes have viewport.
                bounds.union(place.geometry.viewport);
            } else {
                bounds.extend(place.geometry.location);
            }
        }
        map.fitBounds(bounds);
    }
    //serve to get info window when clicked from list side bar
function callFromList(markerId) {
    if (placeInfoWindow) {
        placeInfoWindow.close();
    }
    placeInfoWindow = new google.maps.InfoWindow();
    getPlacesDetails(placeMarkers[markerId], placeInfoWindow);
}

//gets detail of places for infowindow
function getPlacesDetails(marker, infowindow) {
    marker.setAnimation(google.maps.Animation.BOUNCE);
    var service = new google.maps.places.PlacesService(map);
    service.getDetails({
        placeId: marker.id
    }, function(place, status) {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
            // Set the marker property on this infowindow so it isn't created again.
            infowindow.marker = marker;
            var innerHTML = '<div class="infowindow">';
            if (place.name) {
                innerHTML += '<div class="info"><strong>' + place.name + '</strong>';
            }
            if (place.formatted_address) {
                innerHTML += '<br><p>' + place.formatted_address + '</p>';
            }
            if (place.formatted_phone_number) {
                innerHTML += '<br>' + place.formatted_phone_number;
            }
            if (place.opening_hours) {
                innerHTML += '<br><br><strong>Hours:</strong><br>' +
                    place.opening_hours.weekday_text[0] + '<br>' +
                    place.opening_hours.weekday_text[1] + '<br>' +
                    place.opening_hours.weekday_text[2] + '<br>' +
                    place.opening_hours.weekday_text[3] + '<br>' +
                    place.opening_hours.weekday_text[4] + '<br>' +
                    place.opening_hours.weekday_text[5] + '<br>' +
                    place.opening_hours.weekday_text[6];
            }
            if (place.photos) {
                innerHTML += '<br><br><img src="' + place.photos[0].getUrl({
                    maxHeight: 100,
                    maxWidth: 200
                }) + '">';
            }
            innerHTML += '</div></div>';
            infowindow.setContent(innerHTML);
            infowindow.open(map, marker);

            // Make sure the marker property is cleared if the infowindow is closed.
            infowindow.addListener('closeclick', function() {
                marker.setAnimation(null);
                infowindow.marker = null;
            });
        }
        else {
            //error message
            infowindow.marker = marker;
            var innerHTML = '<div class="infowindow"><div class="info"><p>Sorry we could not find more Info:</p></div></div>';
            infowindow.setContent(innerHTML);
            infowindow.open(map, marker);
            infowindow.addListener('closeclick', function() {
            marker.setAnimation(null);
            infowindow.marker = null;
            });
        }
    });
}