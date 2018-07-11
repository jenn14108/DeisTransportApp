/*USING THE API
1. Find the agency ID by querying with geo area (NE + SW longitude and latitude)
2. Using the agency ID, find the stop IDs (since Brandeis doesn't have any vans running in the summer)
3. Then, we can find arrival estimates using the agency ID and the stop ID for specific stops

Below is an example with Harvard
*/

// This code uses GET Agencies (with geo area filter) to obtain agency numbers in the MA area
//Harvard agency number = 52
const transLocAPIKey = process.env.TRANSLOC_KEY || 'mongodb://localhost/DeisTransportApp'
unirest.get("https://transloc-api-1-2.p.mashape.com/agencies.json?callback=call&geo_area=42.445496%2C+-71.000767%7C42.233368%2C+-71.462164")
.header("X-Mashape-Key", transLocAPIKey)
.header("Accept", "application/json")
.end(function (result) {
  console.log(result.status, result.headers, result.body);
});


// This code uses GET Stops (with Harvard's agency number) to obtain a list of ALL stops for all routes
//**** It also gives us the stop_id of particular stops
unirest.get("https://transloc-api-1-2.p.mashape.com/stops.json?agencies=52&callback=call")
.header("X-Mashape-Key", transLocAPIKey)
.header("Accept", "application/json")
.end(function (result) {
  //console.log(result.status, result.headers, result.body);
  //check agency ids
  for (var i = 0; i < result.body.data.length; i++){
     console.log(result.body.data[i].agency_ids);
  }
  console.log(result.body.data);
});



// This code obtains the arrival times of agency 12 (Go Triangle)
unirest.get("https://transloc-api-1-2.p.mashape.com/arrival-estimates.json?agencies=12&callback=call")
.header("X-Mashape-Key", transLocAPIKey)
.header("Accept", "application/json")
.end(function (result) {
  //console.log(result.status, result.headers, result.body);
//  console.log(result.body);
  //for (var i = 0; i < result.body.data.length; i++){
    //console.log(result.body.data[i].arrivals);
  //}
  //console.log(result.body.data[0].arrivals);
});
