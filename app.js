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
mongoose.connect( mongoDB )
const db = mongoose.connection;
mongoose.Promise = global.Promise;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log("we are connected!")
});

//THIS WORKS:
var VanDay = require('./models/VanDaySchema')
// var dayOne = new VanDay({date: new Date(2018, 6, 12), schedule_id: 0000})
//
// dayOne.save(function (err, dayOne) {
//     if (err) return console.error(err);
// });

var EnterVanDays = require('./EnterVanDays')
var EnterSchedule = require('./EnterSchedule')
// EnterVanDays.EnterVanDays(new Date(2018, 7, 25), new Date(2018, 11, 15), [false,false,false,false,true,true,true], 9989, "Cambridge")

VanDay.find(function (err, VanDays) {
  if (err) return console.error(err);
  console.log(VanDays);
})

EnterSchedule.EnterSchedule(1242, "[{ \"stop\" : \"Marlborough/Mass Ave.\",\"times\" : [ {new Date(0, 0, 1, 0, 45)},{new Date(0, 0, 1, 2, 15)},

                  {new Date(0, 0, 1, 13, 25)},

                  {new Date(0, 0, 1, 15, 00)},
                // {"time" : 3.00},
                  {new Date(0, 0, 1, 16, 30)},
                // {"time" :4.30},
                  {new Date(0, 0, 1, 18, 15)},
                // {"time" :6.15},
                  {new Date(0, 0, 1, 19, 15)},
                // {"time" : 7.15},
                  {new Date(0, 0, 1, 20, 15)},
                // {"time" : 8.15},
                  {new Date(0, 0, 1, 21, 00)},
                // {"time" :9.00},
                  {new Date(0, 0, 1, 22, 00)},
                // {"time" :10.00},
                  {new Date(0, 0, 1, 23, 00)},
                // {"time" :11.00},
                  {new Date(0, 0, 1, 24, 00)} ]
                }
              ]")





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
