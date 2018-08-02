//This DF Controller responds to queries from dialogflow for both Partners and
//Brandeis

'use strict';
var Session = require('../models/session');
var transLocAPI = require('../models/transLocAPI');
var reservationController = require('./reservationController');
var reservation = require('../models/reservationSchema');
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
  const response = {};
  const session_id = req.body.session;
  var stop = req.body.queryResult.parameters.stop_name;
  var route = req.body.queryResult.parameters.route_name;
  var date = new Date(req.body.queryResult.parameters.date)
  var time = new Date(req.body.queryResult.parameters.time)
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






            //Branvan Methods:
            case "getArrivalEstimate":
            // Session.findOne({session : session_id} , function (err, session_obj) {
            //   if (err){
            //     return res.json({"fulfillmentText":"Sorry, I could not find the arrival time of the next shuttle."})
            //   } else if (!session_obj) {
            //     return res.json({"fulfillmentText":"Sorry, something went wrong with your login."})
            //   } else {
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
              // }
            // });

            break;

            case "isVanRunning":
            console.log("in isVanRunning")
            // Session.findOne({session : session_id} , function (err, session_obj) {
              // if (err){
              //   return res.json("Sorry, I could not find whether the "+route+" is running.")
              // } else if (!session_obj) {
              //   return res.json({"fulfillmentText":"Sorry, something went wrong with your login."})
              // } else {
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
                  .catch(err => console.log("err: "+err))
                }
              // }
            // });

            break;

















            case "makeReservation":
              console.log("in makeReservation")

              if (route == "walthamVan") {
                route = "Evening Waltham Branvan"
              }
              if (route == "campusVan") {
                route = "Campus BranVan (Weekdays)"
              }
              if (route == "campusVan" && (time.getDay()==0 || time.getDay()==6)) {
                route = "Campus BranVan (Weekends)"
              }

              var momentTime = moment(time)


              var todate = moment().format('LL')
              console.log("momentTime: "+momentTime.format('LT'))
              console.log(req.user)
              if (req.user == undefined) {
                var Name = "temp"
              } else {
                var Name = req.user.googlename
              }
              let newReservation = new reservation({
                name: Name,
                van_name : route,
                from: stop,
                to: stop2,
                pickup_time: momentTime.format('LT'),
                date: todate,
                num_people: numSeats
              })

              console.log(newReservation)


              var minutes = time.getMinutes()
              if (minutes == 0) {
                minutes = "00"
              }
              var people = "people"
              if (numSeats == 1) {
                people = "person"
              }

              newReservation.save()
                .then(error => {
                  setTimeout(function(){
                    var string = "I made you a reservation from "+stop+" to "+stop2+" on the "+route+" for "+numSeats+" "+people+ " on the "+time.getHours()+":"+minutes+" run, "+todate
                    return res.json({"fulfillmentText":string})
                  }, 50000)
                })
                .catch( error => {
                  return res.json({"fulfillmentText":"I wasn't able to reserve for that time."})
                });
            break;




















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
