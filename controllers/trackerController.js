'use strict'
var async = require('async');
var transLocAPI = require('../models/transLocAPI');
console.log("loading the tracker controller...");

exports.renderMain = (req,res) => {
  res.render('tracker', {title: "Tracker"});
};

exports.getEstimate = ( req, res) => {
  console.log("in getEstimate")
  const partnersQuery = new transLocAPI(707);
  const response = {};
  //construct the two needed query parameters for API calls
  const route = req.body.route.replace("-","–");;
  const stop = (req.body.stop).replace("–","-");
  console.log("fetching ETA of next van at " + stop + " on the " + route + " route.")
  //construct two variables needed later
  var route_id = "";
  var stop_id = "";
  var arrival_times = [];

  async.waterfall([
    function(callback){
      partnersQuery.findRouteId(route, callback);
    },
    function(route_id, callback){
      partnersQuery.findStopId(stop, function(err, result){
        if(err){
          callback(err, null);
        } else {
          callback(null, route_id, result);
        }
      });
    },
    function(route_id, stop_id, callback) {
      partnersQuery.findArrivalEstimate(route_id, stop_id, callback);
    }
  ],
  function(err, result){
    if(err){
      console.log("Sorry, I could not retrieve any information");
    } else {
      if (typeof result[0] === 'undefined' ){
        res.render('tracker', {route:route, stop:stop, arrival_time1: "No arrivals"});
      } else {
        if (typeof result[1] === 'undefined'){
          res.render('tracker', {route:route, stop:stop,
                                arrival_time1:result[0].substring(11,16)});
        } else {
          res.render('tracker', {route:route, stop:stop,
                                arrival_time1:result[0].substring(11,16),
                                arrival_time2:result[1].substring(11,16)});
        }
      }
    }
  });
};
