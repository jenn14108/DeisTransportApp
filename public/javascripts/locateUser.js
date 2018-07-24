const axios = require('axios');
//This script uses the HTML5 Geolocation function to locate users. This will
//be used to determine the closest Brandeis stop to the user
function getLocation() {
if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(patchPosition);
  console.log('location')
    } else {
   console.log('no location');
 }
   }

 function patchPosition(position) {
      axios.post('/user', {
           lat: position.coords.latitude,
           lng: position.coords.longitude
    }).then((res) => {
        console.log("geolocation", res.config.data)
      }).catch( function(error) {
    if (error.response) {
      console.log(error.response.data);
      console.log(error.response.status);
      console.log(error.response.headers);
    }
  })
}

 getLocation();
