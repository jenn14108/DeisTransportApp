//This DF Controller responds to queries from dialogflow for both Partners and
//Brandeis

'use strict';
var Session = require('../models/session');
var transLocAPI = require('../models/transLocAPI');
console.log("loading the PartnersShuttleController..");

exports.renderMain = (req,res) => {
  res.render('schedules', {title: 'Schedules'});
};

//if there is a disconnect between the name on DF and on DB, this will translate from DF to DB
exports.DFNameToAPIName = function(name) {
  // @TODO
  //THESE ARE NOT CORRECT AND HAVE NOT BEEN COMPLETED
  if (name == "cambridgeShuttle") return name;
  if (name == "campusShuttle") return name;
  if (name == "campusVan") return name;
  if (name == "walthamVan") return name;
  if (name == "walthamShuttle") return name;
}

//if there is a disconnect between the name on DF and on DB, this will translate from DF to DB
exports.DFNameToDBName = function(name) {
  if (name == "Rabb") return name;
  if (name == "Hassenfeld") return "Hassenfeld Lot";
  if (name == "Lower Charles River Road") return name;
  if (name == "cambridgeShuttle") return name;
  if (name == "campusShuttle") return name;
  if (name == "campusVan") return name;
  if (name == "walthamVan") return name;
  if (name == "walthamShuttle") return name;
  return name
}



exports.respondToDF = (req, res) => {

  const intent = req.body.queryResult.intent.displayName;
  console.log("INTEENT: "+intent)
  const response = {};
  const session_id = req.body.session;
  var date = new Date(req.body.queryResult.parameters.date)
  var dateString = req.body.queryResult.outputContexts[0].parameters["date.original"]
  if (dateString) {
    dateString = dateString.replace("?","").replace(".","")
  }

  var stop2 = this.DFNameToDBName(req.body.queryResult.parameters.stopName1);
  var numSeats = req.body.queryResult.parameters.number
  console.log(dateString)
  if(req.body.queryResult.parameters.stop_name)
  {
    var stop = this.DFNameToDBName(req.body.queryResult.parameters.stop_name);
  }
  else
  {
    var stop = this.DFNameToDBName(req.body.queryResult.parameters.stopName);
  }
  if (req.body.queryResult.parameters.route_name)
  {
    var route = this.DFNameToDBName(req.body.queryResult.parameters.route_name);
  }
  else
  {
    var route = this.DFNameToDBName(req.body.queryResult.parameters.vanType);
  }
  console.log("intent: "+intent)
  console.log("response: "+response)
  console.log("session_id: "+session_id)
  console.log("stop: "+stop)
  console.log("route: "+route)
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
    console.log("in findOne")
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
              }
              callback(null, route_id, stop_id);
            });
          }
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
              console.log(arrival_times);
              Session.update({session: session_id}, {$set:{arrival_times: arrival_times}}, function(err){
                if(err){
                  callback(err, null);
                } else {
                  callback(null, arrival_times);
                }
              })
            })
          }
        ],
        function(err, result){
          if(err){
            response.err = err;
            response.fulfillmentText = "Sorry, I could not retrieve any information";
            return res.json(response);
          } else {
            if (arrival_times[0] == undefined ){
              response.fulfillmentText = "Sorry, the " + route + " shuttle does not currently stop at " + stop
            } else {
              response.fulfillmentText = "The next " + route + " shuttle to " + stop + " will arrive at " + result[0].substring(11,16);
            }
            return res.json(response);
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
      return res.json(response);
    });
    break;
    case "get_closest_stop":
    Session.findOne({session : session_id} , function (err, session_obj) {
      if (err || !session_obj){
        response.fulfillmentText = "Sorry, I could not locate your location.";
      } else {
        response.fulfillmentText = "yessss";
      }
      return res.json(response);
    });

    break;

    //Branvan Methods:
    case "getArrivalEstimate":
    Session.findOne({session : session_id} , function (err, session_obj) {
      if (err){
        return res.json("Sorry, I could not find the arrival time of the next shuttle.")
      } else if (!session_obj) {
        return res.json("Sorry, something went wrong with your login.")
      } else {
        console.log("route: "+route)
        console.log("stop: "+stop)
        Query.getNextTimeForVan(route, stop).then(resp => {
          console.log(resp)
          if (resp.getFullYear() > 2100) {
            return res.json({"fulfillmentText":"That shuttle isn't running today."})
          }

          resp = new Date(resp-resp.getTimezoneOffset()*60000)
          var minutes = resp.getMinutes()
          var m2 = ""
          if (minutes == 0) {
            m2 = "0"
          }
          return res.json({"fulfillmentText":"The next "+route+" leaves "+stop+" at "+resp.getUTCHours()%12+":"+minutes+m2+"."})
        })
      }
    });

    break;

    case "isVanRunning":
    console.log("in isVanRunning")
    Session.findOne({session : session_id} , function (err, session_obj) {
      if (err){
        return res.json("Sorry, I could not find whether the "+route+" is running.")
      } else if (!session_obj) {
        return res.json("Sorry, something went wrong with your login.")
      } else {
        if (!date) {
          date = new Date()
        }
        if (route) {
          Query.getVanScheduleID(route, date).then(id => {
            if (id > 0) {
              return res.json({"fulfillmentText":"Yes, the "+route+" is running "+dateString+"."})
            }
            return res.json({"fulfillmentText":"No, the "+route+" is not running "+dateString+"."})
          })
        } else {
          Query.getVanDay(date).then(vd => {
            var runningVans = [];
            if (vd) {
              for (var i = 0; i < vd.schedule_by_van.length; i++) {
                if (vd.schedule_by_van[i].schedule_id > 0) {
                  runningVans.push(vd.schedule_by_van[i].van)
                }
              }
            }

            var runningVansString = ""
            for (var i = 0; i < runningVans.length -1; i++) {
              runningVansString += runningVans[i]+", "
            }
            runningVansString += "and "+runningVans[i]

            if (runningVans.length > 1) {

              return res.json({"fulfillmentText":"The "+runningVansString+" are running "+dateString+"."})
            } else if (runningVans.length == 1) {
              return res.json({"fulfillmentText":"Only the "+runningVans[0] +" is running " +dateString})
            } else {
              return res.json({"fulfillmentText":"There are no vans running " +dateString})
            }
          })
        }
      }
    });

    break;















    case "makeReservation":
    console.log("in makeReservation")
    Session.findOne({session : session_id} , function (err, session_obj) {
      if (err){
        return res.json("Sorry, I could not find whether the "+route+" is running.")
      } else if (!session_obj) {
        return res.json("Sorry, something went wrong with your login.")
      } else {
        console.log("from: "+stop)
        console.log("to: "+stop2)
        console.log("van: "+route)
        console.log("number of seats: "+numSeats)
        var string = "from: "+stop+" to: "+stop2+" van: "+route+" number of seats: "+numSeats
        return res.json({"fulfillmentText":string})
      }
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
    Session.findOne({session : session_id }, function (err, session_obj) {
      if (err || !session_obj){
        response.fulfillmentText = "Sorry, I could not retrieve any information";
        return res.json(response);
      } else {
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
              console.log(arrival_times);
              Session.update({session: session_id}, {$set:{arrival_times: arrival_times}}, function(err){
                if(err){
                  callback(err, null);
                } else {
                  callback(null, arrival_times);
                }
              })
            })
          }
        ],
        function(err, result){
          if(err){
            response.err = err;
            response.fulfillmentText = "Sorry, I could not retrieve any information";
            return res.json(response);
          } else {
            if (arrival_times[0] == undefined ){
              response.fulfillmentText = "Sorry, the " + route + " shuttle does not currently stop at " + stop
            } else {
              response.fulfillmentText = "The next " + route + " shuttle to " + stop + " will arrive at " + result[0].substring(11,16);
            }
            return res.json(response);
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
// console.log(`comparing ${var_a}(type: ${typeof var_a}, length: ${var_a.length}) and ${var_b}(type: ${typeof var_b}, length: ${var_b.length}): ${var_a == var_b} `);
