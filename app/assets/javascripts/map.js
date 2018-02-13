function createCapitalsGeoJSON(response) {
  var capitals = $.map( response, function( capital ) {
    return {"type": "Feature",
            "geometry": {"type": "Point",
                          "coordinates": [ capital["longitude"], capital["latitude"] ]},
            "properties": { "city": capital["city"],
                              "state": capital["state"],
                              "marker-color": "#ea972a",
                              "marker-size": "medium" }
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
    })
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
});
