//This DF Controller responds to queries from dialogflow for both Partners and
//Brandeis

'use strict';
var Session = require('../models/session');
var transLocAPI = require('../models/transLocAPI');
console.log("loading the PartnersShuttleController..");

exports.renderMain = (req,res) => {
  res.render('schedules', {title: 'Schedules'});
};

exports.respondToDF = (req, res) => {
  const intent = req.body.queryResult.intent.displayName;
  const response = {};
  const session_id = req.body.session;
  var stop = req.body.queryResult.parameters.stop_name;
  var route = req.body.queryResult.parameters.route_name;
  //construct the two needed query parameters for API calls
  if (!(typeof stop === 'undefined')){
    stop = stop.replace("–","-");
  }
  if (!(typeof route === 'undefined')){
    route = route.replace("-","–");
  }
  //construct two variables needed later
  var route_id = "";
  var stop_id = "";
  var arrival_times = [];

  //make sure that there is a session
  Session.findOne({session: session_id}, function (err, session_obj) {
    if (err) {
        response.fulfillmentText = "Sorry, I could not process your request.";
        return res.json(response);
    } else { //session ID was found
      if (session_obj) {
        session_obj.stop = stop;
        session_obj.route = route;
        session_obj.save(function (err) {
          if (err) {
            response.fulfillmentText = "Sorry, your request could not be processed.";
            console.dir(err);
            return res.json(response);
          }
        });
      } else { //store information provided by the user
        const session = new Session({
          session: session_id,
          stop : stop,
          route : route,
        });
        session.save(function (err) {
          if (err) {
            response.fulfillmentText = "Sorry, something went wrong.";
            return res.json(response);
          }
        });
      }
    }
  });

  switch (intent) {
    case "get_shuttle_schedule": //Partners
        Session.findOne({session : session_id }, function (err, session_obj) {
          if (err || !session_obj){
            response.fulfillmentText = "Sorry, I could not retrieve any information";
            res.json(response);
          } else {
            const partnersQuery = new transLocAPI(707)
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
                response.err = err;
                response.fulfillmentText = "Sorry, I could not retrieve any information";
                res.json(response);
              } else {
                if (result[0] == undefined ){
                  response.fulfillmentText = "Sorry, the " + route + " shuttle does not currently stop at " + stop
                } else {
                  response.fulfillmentText = "The next " + route + " shuttle to " + stop + " will arrive at " + result[0].substring(11,16);
                }
                res.json(response);
              }
            });
          }
        });
        break;

    case "get_second_shuttle_time":
        Session.findOne({session : session_id} , function (err, session_obj) {
          if (err || !session_obj){
            response.fulfillmentText = "Sorry, I could not find the arrival time of the next shuttle.";
          } else {
            if (!(typeof session_obj.arrival_times[1] === 'undefined')){
              response.fulfillmentText = "The shuttle after the first to " + session_obj.stop + " will arrive at " + session_obj.arrival_times[1].substring(11,16);
            }
          }
          res.json(response);
        });
        break;
    case "get_closest_stop":
        Session.findOne({session : session_id} , function (err, session_obj) {
          if (err || !session_obj){
            response.fulfillmentText = "Sorry, I could not locate your location.";
          } else {
            response.fulfillmentText = "yessss";
          }
          res.json(response);
        });

        break;
    //remaining code for finding brandeis shuttle times
    case "get_brandeis_shuttle":
        Session.findOne({session : session_id }, function (err, session_obj) {
          if (err || !session_obj){
            response.fulfillmentText = "Sorry, I could not retrieve any information";
            res.json(response);
          } else {
            const brandeisQuery = new transLocAPI(483);
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
                response.err = err;
                response.fulfillmentText = "Sorry, I could not retrieve any information";
                res.json(response);
              } else {
                if (result[0] == undefined ){
                  response.fulfillmentText = "Sorry, the " + route + " shuttle does not currently stop at " + stop
                } else {
                  response.fulfillmentText = "The next " + route + " shuttle to " + stop + " will arrive at " + result[0].substring(11,16);
                }
                res.json(response);
              }
            });
          }
        });
        break;
    }
};



//debug tools  - check length of variables being compared to
// const var_a = "" + result.body.data['707'][i].long_name.trim().toString();
// const var_b = "" + route.trim().toString();
// var max_length = var_a.length > var_b.length ? var_a.length : var_b.length
// for(var j = 0; j < max_length; j++){
//   if(var_a.charAt(j) != var_b.charAt(j)){
//     console.log("hey!")
//     console.log(`${var_a.charAt(j)} is different from ${var_b.charAt(j)} !!!`)
//   }
// }
// console.log(`comparing ${var_a}(type: ${typeof var_a}, length: ${var_a.length}) and ${var_b}(type: ${typeof var_b}, length:
