'use strict';
const VanShuttleSchedules = require( "../models/VanShuttleSchedules.js" );
const scheduleQueryParameters = require("../models/scheduleQueryParameters.js");


console.log("loading the VanShuttleScheduleController");

//console.log(scheduleQueryParameters);

//create datasets for all shuttles
var dayTimeWalthamShuttleSchedule = readJSONFile("./JSON_Schedules/DaytimeWalthamShuttleSchedule.json");
var campusVanSchedule = readJSONFile("./JSON_Schedules/CampusVanSchedule.json");
var dayTimeCampusShuttleSchedule = readJSONFile("./JSON_Schedules/dayTimeCampusShuttleSchedule.json");
var eveningWalthamVanSchedule = readJSONFile("./JSON_Schedules/eveningWalthamVanSchedule.json");
var bostonCambridgeShuttleThursSchedule = readJSONFile("./JSON_Schedules/BostonCambridgeShuttleTHursSchedule.json");
var bostonCambridgeShuttleFriSchedule = readJSONFile("./JSON_Schedules/BostonCambridgeShuttleFriSchedule.json");
var bostonCambridgeShuttleSatSchedule = readJSONFile("./JSON_Schedules/BostonCambridgeShuttleSatSchedule.json");
var bostonCambridgeShuttleSunSchedule = readJSONFile("./JSON_Schedules/BostonCambridgeShuttleSunSchedule.json");

//compile all schedules
var schedules = [dayTimeCampusShuttleSchedule,
                campusVanSchedule,
                dayTimeWalthamShuttleSchedule,
                eveningWalthamVanSchedule,
                bostonCambridgeShuttleThursSchedule,
                bostonCambridgeShuttleFriSchedule,
                bostonCambridgeShuttleSatSchedule,
                bostonCambridgeShuttleSunSchedule];

//console.log statements to check that files have been successfully loaded into node.js
//console.log(util.inspect(dayTimeWalthamShuttleSchedule, false, null));
//console.log(util.inspect(campusVanSchedule, false, null));
//console.log(util.inspect(schedules, false, null));

//function to load .json schedules into node.js
function readJSONFile (file) {
  var temp = fs.readFileSync(file);
  return JSON.parse(temp);
}

//create database to store the different van/shuttle schedules
 VanShuttleSchedules.collection.insertMany(schedules, function(err,r){
   assert.equal(null,err);
   assert.equal(8, r.insertedCount);

 });







exports.respondToDF = (req, res) => {
  console.dir(req.body);
  const response =
  {
    "fulfillmentText" : "This is my own text response!"
  }
  return res.json(response);
}


// this returns the right schedule
exports.getSchedule = ( req, res ) => {
  console.log('in getSchedule');
  Skill.find( {} )
    .exec()
    .then( ( skills ) => {
      res.render( 'skills', {
        skills: skills
      } );
    } )
    .catch( ( error ) => {
      console.log( error.message );
      return [];
    } )
    .then( () => {
      console.log( 'skill promise complete' );
    } );
};
