'use strict';
const bostonCambridgeShuttleSchedule = require("../models/bostonCambridgeShuttleSchedule");
const campusVanSchedule = require("../models/CampusVanSchedule");
const dayTimeCampusShuttleSchedule = require("../models/DayTimeCampusShuttleSchedule");
const daytimeWalthamShuttleSchedule = require("../models/DayTimeWalthamShuttleSchedule");
const eveningWalthamVanSchedule = require("../models/EveningWalthamVanSchedule");
const scheduleQueryParameters = require("../models/scheduleQueryParameters.js");
const mongoose = require( 'mongoose' );
const db = mongoose.connection;
console.log("loading the VanShuttleScheduleController");


//check that all necessary parameters are filled in
exports.check_parameters = (req,res, next) => {
   if (req.body.queryResult.parameters['van_shuttle_type']){
     scheduleQueryParameters['van_type'] = req.body.queryResult.parameters['van_shuttle_type'];
   }
   if (req.body.queryResult.parameters['van_shuttle_stop']){
     scheduleQueryParameters['pickup_stop'] = req.body.queryResult.parameters['van_shuttle_stop'];
   }
   if (req.body.queryResult.parameters['time']){
     scheduleQueryParameters['pickup_time'] = req.body.queryResult.parameters['time'];
   }
   //find the correct branvan schedule if the pickup stop and time slots are filled in
   if (scheduleQueryParameters['pickup_stop'] &&  scheduleQueryParameters['pickup_time']){
       next();
   }
};

/*USEFUL INFO
    DayTime Campus Shuttle : Weekdays only: 7:30 a.m. to 4:30 p.m.
    Campus Branvan : Weekdays: 7:30 a.m. to 2:30 a.m. Weekends: 12 p.m. to 2:30 a.m.
    Daytime Waltham Shuttle: Weekdays Only 7:30 a.m. to 4:30 p.m.
    Evening Waltham Branvan: 4 p.m. to 2:30 a.m. There is no 5:30 p.m. run
    10-25, 40-55*/

//this is the method used to respond to dialogflow queries
exports.respondToDF = (req, res) => {
    var user_stop = scheduleQueryParameters['pickup_stop'];
    var van_type = scheduleQueryParameters['van_type'];
    //we need the date in order to query later
    var date = new Date();
    var current_hour = date.getHours();
    var current_minute= date.getMinutes();
    //campus van
    if (van_type.search('van') !== -1 && van_type.search('campus') !== -1){
       var document = campusVanSchedule.findOne({'stop': {$regex: '/Rabb/'}});
       console.log(document.stop);
      //user is asking about the shuttle if not the van
    }
    const response = {
      "fulfillmentText" : "Nothing yet"
    }
    res.json(response);
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
