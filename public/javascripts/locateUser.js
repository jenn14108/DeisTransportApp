var lat;
var long;
var firstLoad = true;
$( document ).ready(function() {
  $("button[name='locate-button']").on('click',function() {
       console.log('button clicked');
       firstLoad = false;
       getLocation();
  });
});

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

function initMap() {
  var myLatlng;
  if (firstLoad == true) {
    myLatlng = new google.maps.LatLng(42.365544, -71.255144);
  } else {
    console.log(lat);
    console.log(long);
    myLatlng = new google.maps.LatLng(lat, long);
  }
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

  map.data.loadGeoJson('./GeoJSON/deis_stops.geojson');
  if (firstLoad == false){
    marker.setMap(map);
  }
  console.log("done")
}
