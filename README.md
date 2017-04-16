# Mapbox JS Beginner Tutorial

## Introduction
This tutorial will walk you through how to build the following website: alksdjflasdfj.

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

## Adding a Basemap


## Markers
### Adding Markers
### Formatting Markers
### Popup Box for Markers
### Marker Superclusters
Coming soon...

## Zooming
### Zoom on Page Load
### Fly Zoom
Coming soon...

## Geolocation
### Zooming the map to the User's Current Location

## Directions
This is an example Google directions URL:
```
https://www.google.com/maps/dir//39.72569445,-104.7991513/@39.72569445,-104.7991513,16z?hl=en-US
```

39.72569445 is the longitude.

-104.7991513 is the latitude.

16z is the zoom level.

You can dynamically pass in a longitude and latitude to a link in your code to open up Google directions to a specified location.

## Shape Layers
### Adding a Shape Layer
Coming soon...
### Formatting Shape Layers
Coming soon...

## Toggling Layers On and Off
### Toggling Markers
### Toggling Shape Layers
Coming soon...
