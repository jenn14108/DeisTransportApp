$(document).ready("locate-button").on('click',function() {
       console.log('button clicked');
       getLocation();
});

    function getLocation() {
      if (navigator.geolocation) {
        console.log("geolocation working!");
        navigator.geolocation.getCurrentPosition(function(position){
          var latitude = position.coords.latitude;
          var longitude = position.coords.longitude;
          console.log(latitude, longitude);
        });
      }
    }
