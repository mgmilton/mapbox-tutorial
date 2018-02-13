function createCapitalsGeoJSON(response) {
  var capitals = $.map( response, function( capital ) {
    var cityAndState = capital["city"] + "," + capital["state"]
    var cityAndStateNoSpaces = cityAndState.replace(/ /g,"+")
    var directionsLink = "<a href=\"https://www.google.com/maps/dir//" +
                          cityAndStateNoSpaces +
                          "?hl=en-US\" target=\"_blank\" rel=\"noreferrer\" title=\"Opens in a new window\">Get Directions</a>"
    return {"type": "Feature",
            "geometry": {"type": "Point",
                          "coordinates": [ capital["longitude"], capital["latitude"] ]},
            "properties": { "city": capital["city"],
                            "state": capital["state"],
                            "marker-color": "#ea972a",
                            "marker-size": "medium",
                            "title": capital["city"] + ", " + capital["state"],
                            "description": directionsLink}
            };
  });
  return {"type": "FeatureCollection",
                  "features": capitals };
};

function addCapitalsToMap(map){
  $.ajax({
    url: "/api/v1/capitals",
    method: "GET"
  }).done(function(response){
      var geoJson = createCapitalsGeoJSON(response);
      var markers = L.mapbox.featureLayer().setGeoJSON(geoJson).addTo(map);
      markers.on('mouseover', function(e) {
        e.layer.setIcon(L.mapbox.marker.icon({
          "marker-size": 'large',
          "marker-color": "#d8800d"
        }));
      });
      markers.on('mouseout', function(e) {
        e.layer.setIcon(L.mapbox.marker.icon({
          "marker-size": 'medium',
          "marker-color": "#ea972a"
        }));
      });
    })
}

function addGeoLocateControl(map) {
  var geolocateLayer = L.mapbox.featureLayer().addTo(map);
  var geolocate = document.getElementById('geolocate');

  if (navigator.geolocation) {
    geolocate.onclick = function (e) {
      e.preventDefault();
      e.stopPropagation();
      map.locate();
    };
  }

  map.on('locationfound', function(e) {
      // offset bounds so it doesn't zoom in so much
      e.bounds._northEast.lat += 5 // north bound
      e.bounds._northEast.lng += 5 // east bound
      e.bounds._southWest.lat -= 5 // south bound
      e.bounds._southWest.lng -= 5 // west bound

      map.fitBounds(e.bounds);

      // add a marker for the user's location
      geolocateLayer.setGeoJSON({
          type: 'Feature',
          geometry: {
              type: 'Point',
              coordinates: [e.latlng.lng, e.latlng.lat]
          },
          properties: {
              'title': 'Your Location',
              'marker-color': '#000080',
              'marker-symbol': 'star'
          }
      });
  });
}

$(document).ready(function() {
  L.mapbox.accessToken = map_key;
  var latitude = 39.0;
  var longitude = -97.4;
  var zoomLevel = 5;
  var mapStyle = 'mapbox.streets';

  var map = L.mapbox.map('map')
    .setView([latitude, longitude], zoomLevel)
    .addLayer(L.mapbox.tileLayer(mapStyle));
  addCapitalsToMap(map);
  addGeoLocateControl(map);
});
