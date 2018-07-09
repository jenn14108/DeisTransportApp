const
 createError = require('http-errors');
 express = require('express');
 path = require('path');
 cookieParser = require('cookie-parser');
 bodyParser = require('body-parser');
 logger = require('morgan');
 util = require("util");
 VanShuttleScheduleController = require('./controllers/VanShuttleSchedulesController');
 mongoose = require( 'mongoose' );
 assert = require('assert');
//used to read JSON file into node.js to ultimately save into mongoose
 fs = require("fs");
 app = express();


app.use(bodyParser.json());
console.log('API server listening...');


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
 const VanShuttleSchedules = require( "./models/VanShuttleSchedules");
 VanShuttleSchedules.collection.insertMany(schedules, function(err,r){
   assert.equal(null,err);
   assert.equal(8, r.insertedCount);
   db.close();
 });

app.post('/webhook', VanShuttleScheduleController.respondToDF)



// here is where we connect to the database!
mongoose.connect( 'mongodb://localhost/DeisTransportApp' );
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log("we are connected!")
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

//middleware to process the req object and make it more useful!
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// this handles all static routes ...
// so don't name your routes so they conflict with the public folders
app.use(express.static(path.join(__dirname, 'public')));


// here is where the routing happens, we're not using Routers
// as the app is still quite small...

//
// app.get('/skills', skillsController.getAllSkills );
// app.post('/saveSkill', skillsController.saveSkill );
// app.post('/deleteSkill', skillsController.deleteSkill );

app.use('/', function(req, res, next) {
  console.log("in / controller")
  res.render('index', { title: 'BranVan App' });
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
