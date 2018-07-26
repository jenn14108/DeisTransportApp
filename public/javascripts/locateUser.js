//Create global variables to be used later
var lat;
var long;
//Map has to be initialized when the page loads, but no markers
//should be set until the user presses the locate button
var firstLoad = true;

$( document ).ready(function() {
  $("button[name='locate-button']").on('click',function() {
       console.log('button clicked');
       firstLoad = false;
       getLocation();
  });
});

//This function utilizes HTML5 Geolocation to locate the user
function getLocation() {
  if (navigator.geolocation) {
    console.log("geolocation working!");
    navigator.geolocation.getCurrentPosition(function(position){
      lat = position.coords.latitude;
      long = position.coords.longitude;
      initMap();
    });
  }
}

//This function initializes the map
function initMap() {
  var myLatlng;
  //first load the general Brandeis area
  if (firstLoad == true) {
    myLatlng = new google.maps.LatLng(42.365544, -71.255144);
  } else {
    console.log(lat);
    console.log(long);
    myLatlng = new google.maps.LatLng(lat, long);
  }

  //zoom is how close or far the map view is on the page
  var mapOptions = {
    zoom: 14,
    center: myLatlng
  }
  var map = new google.maps.Map(document.getElementById('map'), mapOptions);
  var image = {
    url: '../images/boy.png',
    scaledSize: new google.maps.Size(60,60)
  }
  var marker = new google.maps.Marker({
      position: myLatlng,
      icon: image
  });
  //add markers for all brandeis shuttle/van stops
  map.data.loadGeoJson('./GeoJSON/deis_stops.geojson');

  //user pressed button, display user location
  if (firstLoad == false){
    marker.setMap(map);
  }
  console.log("done")
}
