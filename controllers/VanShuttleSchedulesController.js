'use strict';
const bostonCambridgeShuttleSchedule = require("../models/bostonCambridgeShuttleSchedule");
const campusVanSchedule = require("../models/CampusVanSchedule");
const dayTimeCampusShuttleSchedule = require("../models/DayTimeCampusShuttleSchedule");
const daytimeWalthamShuttleSchedule = require("../models/DaytimeWalthamShuttleSchedule");
const eveningWalthamVanSchedule = require("../models/EveningWalthamVanSchedule");
const scheduleQueryParameters = require("../models/scheduleQueryParameters.js");
const mongo = require('mongodb');
console.log("loading the VanShuttleScheduleController");

//create datasets for all shuttles
var dayTimeWalthamVan = readJSONFile("./JSON_Schedules/DaytimeWalthamShuttleSchedule.json");
var campusVan = readJSONFile("./JSON_Schedules/CampusVanSchedule.json");
var dayTimeCampusShuttle = readJSONFile("./JSON_Schedules/dayTimeCampusShuttleSchedule.json");
var eveningWalthamVan = readJSONFile("./JSON_Schedules/eveningWalthamVanSchedule.json");
var bostonShuttleThurs = readJSONFile("./JSON_Schedules/BostonCambridgeShuttleTHursSchedule.json");
var bostonShuttleFri = readJSONFile("./JSON_Schedules/BostonCambridgeShuttleFriSchedule.json");
var bostonShuttleSat = readJSONFile("./JSON_Schedules/BostonCambridgeShuttleSatSchedule.json");
var bostonShuttleSun= readJSONFile("./JSON_Schedules/BostonCambridgeShuttleSunSchedule.json");

//console.log statements to check that files have been successfully loaded into node.js
//console.log(util.inspect(dayTimeWalthamShuttleSchedule, false, null));
//console.log(util.inspect(campusVanSchedule, false, null));
//console.log(util.inspect(schedules, false, null));

//function to load .json schedules into node.js
function readJSONFile (file) {
  var temp = fs.readFileSync(file);
  return JSON.parse(temp);
}

//compile all boston schedules
var bostonSchedules = bostonShuttleThurs,
                      bostonShuttleFri,
                      bostonShuttleSat,
                      bostonShuttleSun;

//create 5 collections to store the different van/shuttle schedules
bostonCambridgeShuttleSchedule.collection.insertMany(bostonSchedules, function(err,r){
    assert.equal(null,err);
    assert.equal(3, r.insertedCount);
});
campusVanSchedule.collection.insertMany(campusVan, function(err,r){
    assert.equal(null,err);
    assert.equal(8, r.insertedCount);
});
dayTimeCampusShuttleSchedule.collection.insertMany(dayTimeCampusShuttle, function(err,r){
    assert.equal(null,err);
    assert.equal(6, r.insertedCount);
});
eveningWalthamVanSchedule.collection.insertMany(eveningWalthamVan, function(err,r){
    assert.equal(null,err);
    assert.equal(4, r.insertedCount);
});
daytimeWalthamShuttleSchedule.collection.insertMany(dayTimeWalthamVan, function(err,r){
    assert.equal(null,err);
    assert.equal(11, r.insertedCount);
});



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

   //find the correct branvan schedule
   if (scheduleQueryParameters['pickup_stop'] &&  scheduleQueryParameters['pickup_time']){
       next();
   }
};


//this is the method used to respond to dialogflow queries

/*USEFUL INFO
    DayTime Campus Shuttle : Weekdays only: 7:30 a.m. to 4:30 p.m.
    Campus Branvan : Weekdays: 7:30 a.m. to 2:30 a.m. Weekends: 12 p.m. to 2:30 a.m.
    Daytime Waltham Shuttle: Weekdays Only 7:30 a.m. to 4:30 p.m.
    Evening Waltham Branvan: 4 p.m. to 2:30 a.m. There is no 5:30 p.m. run */

exports.respondToDF = (req, res) => {
    //we need the date in order to query later
    var date = new Date();
    var current_hour = date.getHours();
    var current_minute= date.getMinutes();
    //campus van
    // if (scheduleQueryParameters['van_type'].search('van') !== -1
    //     && scheduleQueryParameters['van_type'].search('campus') !== -1){
    //   const objId = new mongo.ObjectId('5b43c6b450ad37035f4b0c05');
    //   console.log(VanShuttleSchedules.findOne(objId,{name:scheduleQueryParameters['pickup_stop']},
    //                                           {arrival_times: {$gt: current_minute}}));

      //user is asking about the shuttle if not the van
    // }
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
