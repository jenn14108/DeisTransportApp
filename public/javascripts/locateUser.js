var lat;
var long;
var map;
$( document ).ready(function() {
  $("button[name='locate-button']").on('click',function() {
       console.log('button clicked');
       getLocation();
       // initMap();
  });
});

function getLocation() {
  if (navigator.geolocation) {
    console.log("geolocation working!");
    navigator.geolocation.getCurrentPosition(function(position){
      lat = position.coords.latitude;
      long = position.coords.longitude;
      console.log(lat, long);
    });
  }
}

// function initMap() {
//   var myLatlng = new google.maps.LatLng(42.3756803, -71.2375709);
//   var mapOptions = {
//     zoom: 4,
//     center: myLatlng
//   }
//   var map = new google.maps.Map(document.getElementById('map'), mapOptions);
//   var marker = new google.maps.Marker({
//       position: myLatlng,
//   });
//   marker.setMap(map);
//   console.log("done")
// }
