const
  express = require('express');
  bodyParser = require('body-parser');
  cookieParser = require('cookie-parser');
  util = require("util");
  assert = require("assert");
  service = express();
  mongoose = require('mongoose');
  //ScheduleController = require('./controllers/VanShuttleScheduleController');
  service.use(bodyParser.json());


var server = service.listen(8000, function() {
  console.log('API server listening...');
});

//read in JSON file into node.js to save into mongoose
var fs = require("fs");

//create datasets for all shuttles
var dayTimeWalthamShuttleSchedule = readJSONFile("DaytimeWalthamShuttleSchedule.json");
var campusVanSchedule = readJSONFile("CampusVanSchedule.json");
var dayTimeCampusShuttleSchedule = readJSONFile("dayTimeCampusShuttleSchedule.json");
var eveningWalthamVanSchedule = readJSONFile("eveningWalthamVanSchedule.json");
var bostonCambridgeShuttleThursSchedule = readJSONFile("BostonCambridgeShuttleTHursSchedule.json");
var bostonCambridgeShuttleFriSchedule = readJSONFile("BostonCambridgeShuttleFriSchedule.json");
var bostonCambridgeShuttleSatSchedule = readJSONFile("BostonCambridgeShuttleSatSchedule.json");
var bostonCambridgeShuttleSunSchedule = readJSONFile("BostonCambridgeShuttleSunSchedule.json");

//compile all schedules
var schedules = [dayTimeCampusShuttleSchedule,
                campusVanSchedule,
                dayTimeWalthamShuttleSchedule,
                eveningWalthamVanSchedule,
                bostonCambridgeShuttleThursSchedule,
                bostonCambridgeShuttleFriSchedule,
                bostonCambridgeShuttleSatSchedule,
                bostonCambridgeShuttleSunSchedule];

//console.log(util.inspect(dayTimeWalthamShuttleSchedule, false, null));
//console.log(util.inspect(campusVanSchedule, false, null));
//console.log(util.inspect(schedules, false, null));

//connect to database
mongoose.connect('mongodb://localhost/DeisTransportApp');
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function(){
  console.log("we are connected!");
})

//function to load .json schedules into node.js
function readJSONFile (file) {
  var temp = fs.readFileSync(file);
  return JSON.parse(temp);
}

//create database to store the different van/shuttle schedules
 const VanShuttleSchedules = require( '../models/VanShuttleSchedules' );
 VanShuttleSchedules.collection.insertMany(schedules, function(err,r){
   assert.equal(null,err);
   assert.equal(8, r.insertedCount);
   db.close();
 });

service.post('/webhook', function (req, res){
  console.log(req);
   return res.json({
         "fulfillmentMessages": [],
         "fulfillmentText": "No I do not want to work for you. I am my own boss :)",
         "payload": {},
         "outputContexts": [],
         "source": "Test Source",
         "followupEventInput": {}
    });
});
