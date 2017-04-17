# Mapbox JS Beginner Tutorial

## Introduction
This tutorial will walk you through how to build the following website: alksdjflasdfj.

![alt text][diagram]

[diagram]: https://github.com/CPowell23/mapbox-tutorial/blob/master/map.png "US State Capitals"

While creating this tutorial, I built a project from scratch and linked to sequential commits so that you can see what code changes were made for each additional feature. Below is a link to the starter repo, and you should clone it down if you want to follow along with the tutorial. If you explore the code in the starter repo, you'll see that I've already built an internal API that serves up points that we will eventually add to our map.

**NOTE**: In the example API, I used the [Ruby geocoder gem](https://github.com/alexreisner/geocoder) to calculate the longitude and latitude coordinates for each state capital, given the city and state. You'll need longitude and latitude coordinates to be able to add points to your map. If you already know the coordinates for points you want to add, there is no need to use geocoding. But if you only know location information (i.e. addresses), you'll need to calculate the coordinates for these points before you can add them.

[Link to starter repo]()

## What You Should Already Know
  - Rails
  - How to Build an API
  - jQuery and AJAX
  - Javascript (Nice to have, but not necessary)

## Developer Sign Up
Sign up for a Mapbox Developer account and get a [free access token](https://www.mapbox.com/studio/account/tokens/).

## Protect API Keys
Before you do anything, you should install the [Ruby figaro gem](https://github.com/laserlemon/figaro) to protect your API keys. As a new developer, when you start working with APIs, you may be tempted to just get things working first and then go back and hide your api keys later. This will inevitably lead to you pushing your keys up to Github. Don't do it!

Add figaro to your Gemfile for all environments
```
gem 'figaro'
```

Bundle and Install from your terminal
```
bundle
figaro install
```

In config/application.yml, add this line of code and insert your Mapbox access token instead
```
MAPBOX_ACCESS_TOKEN: "pk.oiZ3Bld......eyE1Ij"
```

## Adding a Basemap
### First, you'll need to set up a view for your map.

Add a route
```
root to: "map#index"
```

Add a controller
```
touch app/controllers/map_controller.rb
```

Add the following code to map_controller.rb
```
class MapController < ApplicationController
  def index
  end
end
```

Then add a view
```
mkdir app/views/map
touch app/views/map/index.html.erb
```

Then add the following code to index.html.erb
```
<h1>US State Capitals</h1>

<div id='map'>
  <script charset="utf-8">
    var map_key ='<%= ENV["MAPBOX_ACCESS_TOKEN"] %>';
  </script>
</div>
```

**NOTE**: Notice that we're setting 'map_key' in the view template inside the script tags. This is a quick way to get around the fact that you won't have access to the MAPBOX_ACCESS_TOKEN environment variable in your javascript files.

### Let's go ahead and add some styles
Change the file extension of your application.css, and create a couple sass files.
```
mv app/assets/stylesheets/application.css app/assets/stylesheets/application.css.scss
touch app/assets/stylesheets/manifest.sass
touch app/assets/stylesheets/_map.sass
```

Add this to application.css, and remove the require tree line.
```
*= require manifest
```

Add this to manifest.sass
```
@import "map"
```

Add this to map.sass
```
html, body
  margin: 0
  padding: 0

h1
  color: white
  background-color: navy
  margin: 0
  padding: 10px
  font-family: "HelveticaNeue-Light", "Helvetica Neue Light", "Helvetica Neue", Helvetica, Arial, "Lucida Grande", sans-serif
  font-weight: 300

#map
  display: block
  width: 100%
  height: 100vh
```

### Now let's add the basemap
In your layout application.html.erb file, add this line above your existing stylesheet_link_tag
```
<%= stylesheet_link_tag 'https://api.mapbox.com/mapbox.js/v3.0.1/mapbox.css' %>
```

And add this line above your existing javascript_include_tag
```
<%= javascript_include_tag 'https://api.mapbox.com/mapbox.js/v3.0.1/mapbox.js' %>
```

Create a map.js file
```
touch app/assets/javascripts/map.js
```

Add this to map.js to create the basemap
```
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
```

Notice that you can alter the **latitude, longitude, zoomLevel, and mapStyle** for the basemap to suit your needs in future projects. Mapbox has a few different map styles you can choose from.

Fire up the rails server, visit the root path, and you should have a basemap!

## Markers
### Adding Markers
Once you add a basemap, the next thing you'll most likely want to do is add some markers. In the starter repo, remember that we already have an API that serves up some JSON data about our state capitals.

Make sure your rails server is fired up and visit the API endpoint at [http://localhost:3000/api/v1/capitals](http://localhost:3000/api/v1/capitals). Examine the data closely, because we're about to use it.

Open your map.js file and put the following code above your $(document).ready
```
function createCapitalsGeoJSON(response) {
  var capitals = $.map( response, function( capital ) {
    return {"type": "Feature",
            "geometry": {"type": "Point",
                          "coordinates": [ capital["longitude"], capital["latitude"] ]},
            "properties": { "city": capital["city"],
                            "state": capital["state"] }
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
      L.mapbox.featureLayer().setGeoJSON(geoJson).addTo(map);
    })
}
```

Then, inside the $(document).ready, after you set the map variable, add this line to call the functions
```
addCapitalsToMap(map);
```

Let's examine the code. The addCapitalsToMap function makes an AJAX call to our API and returns the data (the response). We then feed the response to the createCapitalsGeoJSON function, which transforms our API's JSON data into a very specific format, called GeoJSON. Take a minute to throw in some debuggers to see what our `capitals` and `geojson` variables look like before we process them.

After we create our geoJson the `L.mapbox.featureLayer().setGeoJSON(geoJson).addTo(map);` line adds our markers to the map.

Visit the map page in your browser, and you should see map markers for all 50 state capitals!

### Formatting Markers
#### Marker Size and Color
In your map.js file, inside the createCapitalsGeoJSON function, edit the "properties" to include `marker-color` and `marker-size`. Make your markers any color you like.
```
"properties": { "city": capital["city"],
                "state": capital["state"],
                "marker-color": "#ea972a",
                "marker-size": "medium" }
```

**NOTE**: Mapbox markers can be set to small, medium, or large.

#### Marker Hover Styling
In map.js, inside the addCapitalsToMap function, assign the `L.mapbox.featureLayer().setGeoJSON(geoJson).addTo(map);` line to a variable called markers.
```
var markers = L.mapbox.featureLayer().setGeoJSON(geoJson).addTo(map);
```

Then add this code immediately below the markers variable assignment
```
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
```

The mouseover code block overwrites the `marker-size` and `mark-color` when the user mouses over an individual icon. The mouseout code block sets it back to its original size and color when the user's mouse leaves.

Visit the map in your browser. Your markers should be the color you specified, and they should change size and color when you hover over them!

### Popup Box for Markers
Adding a popup box for markers is really easy. Simply add a title and/or description to your marker properties.

```
"properties": { "city": capital["city"],
                "state": capital["state"],
                "marker-color": "#ea972a",
                "marker-size": "medium",
                "title": capital["city"],
                "description": "State capital of " + capital["state"]}
```

## Geolocation: Zooming the map to the User's Current Location
A common feature you may want to add for users is the ability to click a button and zoom to their current location.

### First, you'll need to add a button to your map.

Include Font Awesome by inserting this line below your mapbox javascript_include_tag in your application.html.erb layout
```
<%= javascript_include_tag 'https://use.fontawesome.com/b46d447c0d.js' %>
```

Then add the icon inside your map div in index.html.erb, after the script tags.
```
<i id="geolocate" class="fa fa-location-arrow fa-2x"></i>
```

Apply some formatting to the icon in map.sass
```
i.fa.fa-location-arrow
  background-color: white
  color: #333333
  font-size: 20px
  padding: 5px
  border: 2px solid rgba(0,0,0,.2)
  border-radius: 4px
  position: absolute
  left: 0
  top: 65px
  margin: 10px 0 0 10px
  z-index: 999
  cursor: pointer
```

### Now let's add the code to geolocate the user
Add the following function to map.js outside of the $(document).ready
```
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
```

Then call the function inside the $(document).ready to add the geolocate functionality.
```
addGeoLocateControl(map);
```

Now check it out in your browser! When you click the geolocate button, the map should zoom and add a marker to your current location.

**NOTE**: Notice that it takes a while for the zoom to happen after you click the button. You may want to consider adding a flash message that goes away after a few seconds to let the user know that the map is working to find their current location.

## Directions
Before we start coding, let's examine the following URL. This is an example Google directions URL:
```
https://www.google.com/maps/dir//Little+Rock,+Arkansas?hl=en-US
```

Paste the example URL into a new browser window and see where it takes you.

In the following code examples, we're going to add a Directions link to our marker popup boxes, and we're going to dynamically pass in the city and state so that the link takes us to Google Maps directions for the relevant map marker.

In map.js, edit your createCapitalsGeoJSON function to look like this
```
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
```

All we've done is edit the title and description of your marker popup box, and we're now passing in the dynamically created directions link.

Open the map in your browser and test it out!

## Shape Layers
### Adding a Shape Layer
Coming soon...
### Formatting Shape Layers
Coming soon...

## Toggling Layers On and Off
### Toggling Markers
Coming soon...
### Toggling Shape Layers
Coming soon...
