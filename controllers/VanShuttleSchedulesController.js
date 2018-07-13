'use strict';
// const bostonCambridgeShuttleSchedule = require("../models/bostonCambridgeShuttleSchedule");
// const campusVanSchedule = require("../models/CampusVanSchedule");
// const dayTimeCampusShuttleSchedule = require("../models/DayTimeCampusShuttleSchedule");
// const daytimeWalthamShuttleSchedule = require("../models/DaytimeWalthamShuttleSchedule");
// const eveningWalthamVanSchedule = require("../models/EveningWalthamVanSchedule");
// const scheduleQueryParameters = require("../models/scheduleQueryParameters.js");
// const mongoose = require( 'mongoose' );
// const db = mongoose.connection;
console.log("loading the VanShuttleScheduleController");


exports.renderMain = (req,res) => {
  res.render('schedules', {title: 'Schedules'});
}

//check that all necessary parameters are filled in
// exports.check_parameters = (req,res, next) => {
//    if (req.body.queryResult.parameters['van_shuttle_type']){
//      scheduleQueryParameters['van_type'] = req.body.queryResult.parameters['van_shuttle_type'];
//    }
//    if (req.body.queryResult.parameters['van_shuttle_stop']){
//      scheduleQueryParameters['pickup_stop'] = req.body.queryResult.parameters['van_shuttle_stop'];
//    }
//    if (req.body.queryResult.parameters['time']){
//      scheduleQueryParameters['pickup_time'] = req.body.queryResult.parameters['time'];
//    }
//    //find the correct branvan schedule if the pickup stop and time slots are filled in
//    if (scheduleQueryParameters['pickup_stop'] &&  scheduleQueryParameters['pickup_time']){
//        next();
//    }
// };


  // exports.check_parameters = (req, res, next) => {
  //   //will use schedule query parameters
  //   }
  // }

/*USEFUL INFO
    DayTime Campus Shuttle : Weekdays only: 7:30 a.m. to 4:30 p.m.
    Campus Branvan : Weekdays: 7:30 a.m. to 2:30 a.m. Weekends: 12 p.m. to 2:30 a.m.
    Daytime Waltham Shuttle: Weekdays Only 7:30 a.m. to 4:30 p.m.
    Evening Waltham Branvan: 4 p.m. to 2:30 a.m. There is no 5:30 p.m. run
    10-25, 40-55*/

//this is the method used to respond to dialogflow queries
//this queries to the API!!!! Not mongoose!!
exports.respondToDF = (req, res) => {
  if (req.body.queryResult.intent.displayName === "temp_get_harvard"){
    var output_string = "Here is a list of all vehicles offered by Harvard: ";
    unirest.get("https://transloc-api-1-2.p.mashape.com/routes.json?agencies=52&callback=call")
    .header("X-Mashape-Key", "86AEb09Skcmsho1ePNIfntZuwRjPp1ywZqkjsnH74xl90S0OWI")
    .header("Accept", "application/json")
    .end(function (result) {
      for (var i = 0; i < result.body.data['52'].length; i++){
        output_string = output_string + result.body.data['52'][i].long_name + "\n";
      }
      const response = {
        "fulfillmentText" : output_string
      }
      res.json(response);
    });
  }
  if (req.body.queryResult.intent.displayName === "get_currently_active"){
    var output_string = "Here are the current active vehicles: ";
    var vehicles = "";
    unirest.get("https://transloc-api-1-2.p.mashape.com/routes.json?agencies=52&callback=call")
    .header("X-Mashape-Key", "86AEb09Skcmsho1ePNIfntZuwRjPp1ywZqkjsnH74xl90S0OWI")
    .header("Accept", "application/json")
    .end(function (result) {
        for (var i = 0; i < result.body.data['52'].length; i++){
           if(result.body.data['52'][i].is_active === true){
             vehicles = vehicles + result.body.data['52'][i].long_name + "\n";
           }
        }
        output_string = output_string + vehicles;
        if (vehicles === undefined){
          output_string = output_string + "No vehicles are currently running";
        }
        console.log(output_string);
        const response = {
          "fulfillmentText" : output_string
        }
        res.json(response);
    });
  }
  //BU:132 BC: 32 Brandeis: 483
  if (req.body.queryResult.intent.displayName === "get_other_institutions"){
    var institution = (req.body.queryResult.parameters.institution).toString();
    var agency_id = "";
    if (institution === 'brandeis' || institution === 'Brandeis'){
      agency_id = 483;
    } else if (institution == "Boston University" || institution == "boston university"
              || institution == "BU" || institution == "bu"){
      agency_id = 132;
    } else if (institution == "Boston college" || institution == "boston college"
              || institution == "BC" || institution == "bc"){
      agency_id = 32;
    }
    var output_string = "Here are the current active vehicles at " + institution + ": \n";
    var vehicles = "";
    unirest.get("https://transloc-api-1-2.p.mashape.com/routes.json?agencies=" + agency_id + "&callback=call")
    .header("X-Mashape-Key", "86AEb09Skcmsho1ePNIfntZuwRjPp1ywZqkjsnH74xl90S0OWI")
    .header("Accept", "application/json")
    .end(function (result) {
      console.log(result.body.data[agency_id]);
        for (var i = 0; i < result.body.data[agency_id].length; i++){
           if(result.body.data[agency_id][i].is_active === true){
             vehicles = vehicles + result.body.data[agency_id][i].long_name + "\n";
           }
        }
        output_string = output_string + vehicles;
        if (vehicles === undefined){
          output_string = output_string + "No vehicles are currently running";
        }
        console.log(output_string);
        const response = {
          "fulfillmentText" : output_string
        }
        res.json(response);
    });
  }
}

// this returns the right schedule
// exports.getSchedule = ( req, res ) => {
//   console.log('in getSchedule');
//   Skill.find( {} )
//     .exec()
//     .then( ( skills ) => {
//       res.render( 'skills', {
//         skills: skills
//       } );
//     } )
//     .catch( ( error ) => {
//       console.log( error.message );
//       return [];
//     } )
//     .then( () => {
//       console.log( 'skill promise complete' );
//     } );
// };
