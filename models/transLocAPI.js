module.exports = class transLocAPI {

  constructor(agency_id){
    this.agency_id = agency_id;
  }

  //This method queries the transLoc API to find the route ID given the route name
  findRouteId(route, callback){
    var agencyId = this.agency_id;
    var res;
    unirest.get("https://transloc-api-1-2.p.mashape.com/routes.json?agencies="+ this.agency_id + "&callback=call")
    .header("X-Mashape-Key", transloc_key)
    .header("Accept", "application/json")
    .end(function (result) {
      for (var i = 0; i < result.body.data[agencyId].length; i++){
        if (result.body.data[agencyId][i].long_name === route){
           res = result.body.data[agencyId][i].route_id;
           break;
        }
      }
      callback(null, res);
    });
  }

  //This method queries the transLoc API to find the route ID given the route name
  findRouteIdShortName(route, callback){
    var agencyId = this.agency_id;
    var res;
    unirest.get("https://transloc-api-1-2.p.mashape.com/routes.json?agencies="+ this.agency_id + "&callback=call")
    .header("X-Mashape-Key", transloc_key)
    .header("Accept", "application/json")
    .end(function (result) {
      for (var i = 0; i < result.body.data[agencyId].length; i++){
        if (result.body.data[agencyId][i].short_name === route){
           console.log("THIS IS THE ROUTE ID: " + result.body.data[agencyId][i].route_id )
           res = result.body.data[agencyId][i].route_id;
           break;
        }
      }
      callback(null, res);
    });
  }

  //This method queries the transLoc API to find the stop ID given the stop name
  findStopId(stop, callback){
    var agencyId = this.agency_id;
    var res;
    unirest.get("https://transloc-api-1-2.p.mashape.com/stops.json?agencies=707&callback=call")
    .header("X-Mashape-Key", transloc_key)
    .header("Accept", "application/json")
    .end(function (result) {
      for (var i = 0; i < result.body.data.length; i++){
        if (result.body.data[i].name === stop){
          console.log("THIS IS THE STOP ID: " + result.body.data[i].stop_id);
          res = result.body.data[i].stop_id;
          break;
        }
      }
      callback(null, res);
    });
  }

  //This method finds the arrival estimate to a particular stop given the stop ID
  //and the route ID
  findArrivalEstimate(route_id, stop_id, callback){
    var agencyId = this.agency_id;
    var res = [];
    unirest.get("https://transloc-api-1-2.p.mashape.com/arrival-estimates.json?agencies=707&callback=call&routes=" + route_id + "&stops=" + stop_id)
    .header("X-Mashape-Key", transloc_key)
    .header("Accept", "application/json")
    .end(function (result) {
      if (result.body.data !== undefined &&
          result.body.data[0] !== undefined){
        for (var i = 0; i < result.body.data[0].arrivals.length; i++){
          res.push(result.body.data[0].arrivals[i].arrival_at);
        }
      }
      callback(null, res);
    });
  }
};


// for more than one queries:
// async.waterfall - do all querying in order because need result from last query
// async.parallel - just do all the querying doesn't matter in which order
// async.series = do all querying in order
// example: for one query only
// var route_id;
// transLocAPIObject.findRouteId(route, function(err, res){
//   if (err){
//     console.log("There was an error");
//   } else {
//     route_id = res;
    //if want to send to dialogflow has to be in here
//     res.fulfillmentText = "blah"
//   }
// })
