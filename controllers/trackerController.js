'use strict'
var async = require('async');
var transLocAPI = require('../models/transLocAPI');
var matchStopName = require('../models/matchStopName');
console.log("loading the tracker controller...");

exports.renderMain = (req,res) => {
  res.render('tracker', {title: "Tracker"});
};

exports.dispRoute = (req,res) => {
  console.log("in dispRoute")
  var route = req.body.vanType
  var name;
  if (route == "2010") {
    name = "Campus BranVan (Weekdays)";
  } else if (route == "2011") {
    name = "Campus BranVan (Weekends)";
  } else if (route == "2020") {
    name = "Daytime Campus Shuttle";
  } else if (route == "3020") {
    name = "Daytime Waltham Shuttle";
  } else if (route == "3010") {
    name = "Evening Waltham Branvan";
  } else if (route == "1010") {
    name = "Boston/Cambridge Shuttle (Thurs)";
  } else if (route == "1020") {
    name = "Boston/Cambridge Shuttle (Fri)";
  } else if ( route == "1030") {
    name = "Boston/Cambridge Shuttle (Sat)";
  } else if (route == "1040") {
    name = "Boston/Cambridge Shuttle (Sun)";
  }
  console.log("fetching info of route: " + name)
  var stops = Query.getSchedule(route).then(data =>
    {
      //res.render('schedules', {name:name, data:data})
      res.json({data: data});
    })
}

exports.getEstimate = ( req, res) => {
  console.log("in getEstimate")
  const brandeisQuery = new transLocAPI(483);
  const response = {};
  //construct the two needed query parameters for API calls
  const route = req.body.vanType;
  var stop = req.body.stop;
  const displayStop = req.body.stop;
  var shortname; var shortname2; var shortname3;
  var name; var name2; var name3;
  //campus bvan
  if (route == 2011 || route == 2010) {
    shortname = "Yellow"
    if (route == 2010){
      name = "Campus BranVan (Weekdays)";
    } else {
      name = "Campus BranVan (Weekends)";
    }
  //waltham bvan & extra waltham
  } else if (route == 3010) {
    shortname = "Blue"
    name = "Evening Waltham Branvan";
    shortname2 = "Green"
    name2 = "Extra Waltham Branvan";
  //campus josephs
  } else if (route == 2020) {
    shortname = "Red"
    name = "Daytime Campus Shuttle";
  //waltham josephs
  } else if (route == 3020) {
    shortname = "Orange"
    name = "Daytime Waltham Shuttle";
  //boston shuttles
  } else if (route == 1010 || route == 1020 || route == 1030 || route == 1040) {
    shortname = "Purple"
    shortname2 = "Pink"
    if (route == 1010) {
      name = "Boston/Cambridge Shuttle (Thurs)";
      name2 = "Boston/Cambridge Shuttle (Thurs)";
    } else if (route == 1020) {
      name = "Boston/Cambridge Shuttle (Fri)";
      name2 = "Boston/Cambridge Shuttle (Fri)";
    } else if (route == 1030) {
      name = "Boston/Cambridge Shuttle (Sat)";
      name2 = "Boston/Cambridge Shuttle (Sat)";
    } else {
      name = "Boston/Cambridge Shuttle (Sun)";
      name2 = "Boston/Cambridge Shuttle (Sun)";
    }
  }

  console.log("THIS IS THE ROUTE: " + name);

  if (shortname !== "Blue"){
    stop = matchStopName.matchTransLocStopName(shortname, stop);
  }
  console.log("NEW STOP NAME: " + stop);
  console.log("color: " + shortname);
  //console.log("fetching ETA of next van at " + stop + " on the " + route + " route.")
  //construct two variables needed later
  var route_id = "";
  var stop_id = "";
  var arrival_times = [];
  if (shortname === 'Blue' || shortname === 'Purple'){
    async.series([
      function(callback){
        async.waterfall([
          function(callback){
            brandeisQuery.findRouteIdShortName(shortname, callback);
          },
          function(route_id, callback){
            brandeisQuery.findStopId(stop, function(err, result){
              if(err){
                callback(err, null);
              } else {
                callback(null, route_id, result);
              }
            })
          },
          function(route_id, stop_id, callback) {
            brandeisQuery.findArrivalEstimate(route_id, stop_id, callback);
          }
        ],
        function(err, result){
          callback(err, result);
        })
      },
      function(callback){
        async.waterfall([
          function(callback){
            brandeisQuery.findRouteIdShortName(shortname2, callback);
          },
          function(route_id, callback){
            brandeisQuery.findStopId(stop, function(err, result){
              if(err){
                callback(err, null);
              } else {
                callback(null, route_id, result);
              }
            });
          },
          function(route_id, stop_id, callback) {
            brandeisQuery.findArrivalEstimate(route_id, stop_id, callback);
          }
        ],
        function(err, result){
          callback(err, result);
        })
      }
    ], function(err, result){
          if (err){
            console.log(err);
          } else {
              var result1 = result[0];
              var result2 = result[1];
              console.log(result1);
              console.log(result2);
              //console.log(typeof result1[0] === 'undefined' && typeof result2[0] === 'undefined')
              if (typeof result1[0] === 'undefined' && typeof result2[0] === 'undefined' ){
                res.render('tracker', {route:name, stop:displayStop, arrival_time1: "No arrivals"});
              } else if (typeof result1[0] === 'undefined' && typeof result2[0] !== 'undefined'){
                  res.render('tracker', {route:name, stop:displayStop,
                                        arrival_time1:result2[0].substring(11,16)});
              } else if (typeof result1[1] === 'undefined' && typeof result2[1] !== 'undefined' ){
                  res.render('tracker', {route:name, stop:displayStop,
                                    arrival_time1:result1[0].substring(11,16),
                                    route2:name2, stop2:displayStop, arrival_time21:result2[1].substring(11,16),
                                  arrival_time22: result2[2].substring(11,16)});
              } else if (typeof result2[1] === 'undefined' && typeof result1[1] !== 'undefined' ){
                res.render('tracker', {route:name, stop:displayStop,
                                  arrival_time1:result1[0].substring(11,16),
                                  arrival_time2: result1[1].substring(11,16),
                                  route2:name2, stop2:displayStop, arrival_time21:result2[0].substring(11,16)});
              } else {
                res.render('tracker', {route:name, stop:displayStop,
                                  arrival_time1:result1[0].substring(11,16),
                                  arrival_time2: result1[1].substring(11,16),
                                  route2:name2, stop2:displayStop,
                                  arrival_time21:result2[0].substring(11,16),
                                  arrival_time22: result2[1].substring(11,16)});
              }
          }
        }
    )
  } else {
    async.waterfall([
      function(callback){
        brandeisQuery.findRouteIdShortName(shortname, callback);
      },
      function(route_id, callback){
        brandeisQuery.findStopId(stop, function(err, result){
          if(err){
            callback(err, null);
          } else {
            callback(null, route_id, result);
          }
        });
      },
      function(route_id, stop_id, callback) {
        brandeisQuery.findArrivalEstimate(route_id, stop_id, callback);
      }
    ],
    function(err, result){
      if(err){
        console.log("Sorry, I could not retrieve any information");
      } else {
        if (typeof result[0] === 'undefined' ){
          res.render('tracker', {route:name, stop:stop, arrival_time1: "No arrivals"});
        } else {
          if (typeof result[1] === 'undefined'){
            res.render('tracker', {route:name, stop:stop,
                                  arrival_time1:result[0].substring(11,16)});
          } else {
            res.render('tracker', {route:name, stop:stop,
                                  arrival_time1:result[0].substring(11,16),
                                  arrival_time2:result[1].substring(11,16)});
          }
        }
      }
    });
  }
}
