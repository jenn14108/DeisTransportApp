const
 mongoose = require( 'mongoose' );
 createError = require('http-errors');
 express = require('express');
 path = require('path');
 cookieParser = require('cookie-parser');
 logger = require('morgan');
 bodyParser = require('body-parser');
 util = require("util");
 unirest  = require("unirest");
 //used to read JSON file into node.js to ultimately save into mongoose
 fs = require("fs");
 assert = require('assert');
 VanShuttleSchedulesController = require('./controllers/VanShuttleSchedulesController');
 app = express();
 VanDaySchema = require('./models/VanDaySchema')
 ScheduleSchema = require('./models/ScheduleSchema')

console.log('API server listening...');


//mongoose.connect( mongoDB, function(err, db) {
//{ useNewUrlParser: true }
// here is where we connect to the database!
const mongoDB = process.env.MONGO_URI || 'mongodb://localhost/DeisTransportApp'
mongoose.connect( mongoDB ,{useNewUrlParser: true})
const db = mongoose.connection;
mongoose.Promise = global.Promise;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log("we are connected!")
});

//THIS WORKS:
var VanDaySchema = require('./models/VanDaySchema')
var VanDay = mongoose.model("vanday", VanDaySchema)
// var dayOne = new VanDay({date: new Date(2018, 6, 12), schedule_id: 0000})
//
// dayOne.save(function (err, dayOne) {
//     if (err) return console.error(err);
// });

var EnterVanDays = require('./EnterVanDays');
var EnterSchedule = require('./EnterSchedule')
var first_day = new Date(2018, 7, 25)




// VanDay.find(function (err, VanDays) {
//   if (err) return console.error(err);
//   console.log(VanDays);
// })






// viewengine setup
app.set('views', path.join(__dirname, 'views'));
app.set('viewengine', 'pug');

//middleware to process the req object and make it more useful!
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// this handles all static routes ...
// so don't name your routes so they conflict with the public folders
app.use(express.static(path.join(__dirname, 'public')));


app.post('/webhook', VanShuttleSchedulesController.check_parameters,
                      VanShuttleSchedulesController.respondToDF);

// app.get('/skills', skillsController.getAllSkills );
// app.post('/saveSkill', skillsController.saveSkill );
// app.post('/deleteSkill', skillsController.deleteSkill );

app.use('/', function(req, res, next) {
  console.log("in / controller")
  res.render('index', { title: 'BranVan App' });
});

EnterVanDays.step(new Date(2018, 7, 25), new Date(2018, 11, 15), [false,false,false,false,true,true,true], 0, "Cambridge")

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
