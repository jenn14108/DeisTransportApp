'use strict'
var async = require('async');
console.log("loading the tracker controller...");

exports.renderMain = (req,res) => {
  res.render('tracker', {title: "Tracker"});
};

exports.getEstimate = ( req, res) => {
  console.log("in getEstimate")
  const response = {};
  //construct the two needed query parameters for API calls
  const route = req.body.route.replace("–","-");;
  const stop = (req.body.stop).replace("-","–");
  console.log(route);
  console.log("fetching ETA of next van at " + stop + " on the " + route + " route.")
  //construct two variables needed later
  var route_id = "";
  var stop_id = "";
  var arrival_times = [];

  async.waterfall([
    function(callback){
      //get all the Partners routes
      unirest.get("https://transloc-api-1-2.p.mashape.com/routes.json?agencies=707&callback=call")
      .header("X-Mashape-Key", transloc_key)
      .header("Accept", "application/json")
      .end(function (result) {
        for (var i = 0; i < result.body.data['707'].length; i++){
          if (result.body.data['707'][i].long_name === route){
            //save the route_id for stop querying
            route_id = result.body.data['707'][i].route_id;
            console.log(route_id);
            break;
          }
        }

        callback(null, route_id);
      });
    },
    function(route_id, callback){
      //get all the Partners stops since cannot query by route_id
      unirest.get("https://transloc-api-1-2.p.mashape.com/stops.json?agencies=707&callback=call")
      .header("X-Mashape-Key", transloc_key)
      .header("Accept", "application/json")
      .end(function (result) {
        for (var i = 0; i < result.body.data.length; i++){
          if (result.body.data[i].name === stop){
            stop_id = result.body.data[i].stop_id;
            console.log(stop_id);
            break;
          }
        }
        callback(null, route_id, stop_id);
      });
    },
    function(route_id, stop_id, callback){
      //finally, get arrival estimate
      unirest.get("https://transloc-api-1-2.p.mashape.com/arrival-estimates.json?agencies=707&callback=call&routes=" + route_id + "&stops=" + stop_id)
      .header("X-Mashape-Key", transloc_key)
      .header("Accept", "application/json")
      .end(function (result) {
        if(result.body.data[0] !== undefined){
          for (var i = 0; i < result.body.data[0].arrivals.length; i++){
            arrival_times.push(result.body.data[0].arrivals[i].arrival_at);
          }
        }
        callback(null, arrival_times);
      })
    }
  ],
  function(err, result){
    if(err){
      console.log("Sorry, I could not retrieve any information");
    } else {
      if (typeof arrival_times[0] == undefined ){
        res.render('tracker', {route:route, arrival_time1: "No arrivals"});
      } else {
        if (typeof arrival_times[1] === 'undefined'){
          res.render('tracker', {route:route,
                                arrival_time1:result[0].substring(11,16)});
        } else {
          res.render('tracker', {route:route,
                                arrival_time1:result[0].substring(11,16),
                                arrival_time2:result[1].substring(11,16)});
        }
      }
    }
  });
};
