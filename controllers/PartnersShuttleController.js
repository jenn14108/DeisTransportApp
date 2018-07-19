'use strict';
var Session = require('../models/session');
var async = require('async');
console.log("loading the PartnersShuttleController..");

exports.renderMain = (req,res) => {
  res.render('schedules', {title: 'Schedules'});
};

exports.respondToDF = (req, res) => {
  const intent = req.body.queryResult.intent.displayName;
  const response = {};
  const session_id = req.body.session;
  //construct the two needed query parameters for API calls
  const stop = req.body.queryResult.parameters.stop_name.replace("–","-");;
  const route = (req.body.queryResult.parameters.route_name).replace("-","–");
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
    case "get_shuttle_schedule":
        Session.findOne({session : session_id }, function (err, session_obj) {
          if (err || !session_obj){
            response.fulfillmentText = "Sorry, I could not retrieve any information";
            res.json(response);
          } else {
            async.waterfall([
              function(callback){
                //get all the Partners routes
                unirest.get("https://transloc-api-1-2.p.mashape.com/routes.json?agencies=707&callback=call")
                .header("X-Mashape-Key", "86AEb09Skcmsho1ePNIfntZuwRjPp1ywZqkjsnH74xl90S0OWI")
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
                .header("X-Mashape-Key", "86AEb09Skcmsho1ePNIfntZuwRjPp1ywZqkjsnH74xl90S0OWI")
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
                .header("X-Mashape-Key", "86AEb09Skcmsho1ePNIfntZuwRjPp1ywZqkjsnH74xl90S0OWI")
                .header("Accept", "application/json")
                .end(function (result) {
                  if(result.body.data[0] !== undefined){
                    for (var i = 0; i < result.body.data[0].arrivals.length; i++){
                      arrival_times.push(result.body.data[0].arrivals[i].arrival_at);
                    }
                  }
                  console.log(arrival_times);

                  callback(null, arrival_times);
                })
              }
            ],
            function(err, result){
              if(err){
                response.err = err;
                response.fulfillmentText = "Sorry, I could not retrieve any information";
                res.json(response);
              } else {
                if (arrival_times[0] == undefined ){
                  response.fulfillmentText = "Sorry, the " + route + " shuttle does not currently stop at " + stop
                } else {
                  response.fulfillmentText = "The next " + route + " shuttle to " + stop + " will arrive at " + result[0].substring(11,16);
                }
                res.json(response);
              }
            })
          }
        });
        break;

    case "get_closest_stop":
        Session.findOne({session : session_id} , function (err, session_obj) {
          if (err || !session_obj){
            response.fulfillmentText = "Sorry, I could not locate your location.";
            res.json(response);
          } else {
            response.fulfillmentText = "yessss";
            res.json(response);
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
// console.log(`comparing ${var_a}(type: ${typeof var_a}, length: ${var_a.length}) and ${var_b}(type: ${typeof var_b}, length: ${var_b.length}): ${var_a == var_b} `);
