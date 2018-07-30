const
 mongoose = require( 'mongoose' );
 createError = require('http-errors');
 express = require('express');
 path = require('path');
 cookieParser = require('cookie-parser');
 logger = require('morgan');
 util = require("util");
 unirest = require("unirest");
 bodyParser = require('body-parser');
 //used to read JSON file into node.js to ultimately save into mongoose
 fs = require("fs");
 assert = require('assert');
 mainPageRouter = require('./routes/mainPageRouter');
 trackerController = require('./controllers/trackerController');
 reservationController = require('./controllers/reservationController');
 schedulesController = require('./controllers/schedulesController');
 DFShuttleController = require('./controllers/DFShuttleController');
 aboutController = require('./controllers/aboutController');
 driverController = require('./controllers/driverController');
 voiceAgentController = require('./controllers/voiceAgentController');

 //VanShuttleSchedulesController = require('./controllers/VanShuttleSchedulesController');
 //Set up needed variables in order to do authentication
 GoogleStrategy = require('passport-google-oauth').OAuth25Strategy; //in cofig/passport.j
 session = require('express-session');
 passport = require('passport');
 configPassport = require('./config/passport');
 configPassport(passport);
 VanDaySchema = require('./models/VanDaySchema')
 VanDay = mongoose.model("vanday", VanDaySchema)
 ScheduleSchema = require('./models/ScheduleSchema')
 Schedule = mongoose.model("schedule", ScheduleSchema)
 EnterVanDays = require('./EnterVanDays');
 EnterSchedule = require('./EnterSchedule')
 Query = require('./Query')
 transloc_key = process.env.TRANSLOC_KEY;
 googlemapskey = process.env.GOOGLEMAPSKEY;
 async = require('async');
 moment = require('moment');
 transLocAPI = require('./models/transLocAPI');
 reservationSchema = require('./models/reservationSchema');
 app = express();

brandeisUsername = 'temp';
console.log('API server listening...');


// here is where we connect to the database!
const mongoDB = process.env.MONGO_URI || 'mongodb://localhost/DeisTransportApp'
mongoose.connect( mongoDB ,{useNewUrlParser: true})
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
console.log("we are connected!")

});







// viewengine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

//middleware to process the req object and make it more useful!
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

//for authentication
app.use(session({
  secret: 'zzbbyanana',
  resave: false,
  saveUninitialized: true,
}));
app.use(passport.initialize());
app.use(passport.session());

// here is where we check on a user's log-in status (middleware)
app.use((req,res,next) => {
  res.locals.loggedIn = false
  if (req.isAuthenticated()){
    console.log("user has been Authenticated")
    res.locals.user = req.user
    res.locals.loggedIn = true
    brandeisUsername = req.user.googlename;
    if (req.user){
      if (req.user.googleemail=='jelee14108@brandeis.edu'
          || req.user.googleemail == 'chungek@brandeis.edu'
          || req.user.googleemail == 'casperlk@brandeis.edu'){
        console.log("Owner has logged in")
        res.locals.status = 'owner'
      } else {
        console.log('some user has logged in')
        res.locals.status = 'user'
      }
    }
  }
  next();
});

// this handles all static routes ...
// so don't name your routes so they conflict with the public folders
app.use(express.static(path.join(__dirname, 'public')));
//app.use(checkLoggedIn);
app.use('/', mainPageRouter);
app.use('/about', aboutController.renderMain)
app.get('/drivers', driverController.renderMain);
app.use('/voiceAgent', voiceAgentController.renderMain);
app.get('/reserve', reservationController.renderMain);
app.post('/getRouteInfo', reservationController.getRouteInfo);
app.post('/addReservation', reservationController.addReservation);
app.post('/findReservations', reservationController.findReservations);
app.get('/tracker', trackerController.renderMain);
app.post('/getEstimate', trackerController.getEstimate);
//app.get('/schedules', PartnersShuttleController.renderMain);
app.get('/schedules', schedulesController.renderMain);
app.post('/getSchedule', schedulesController.getSchedule);




//route middleware to make sure a user is logged in to see certain pages
function isLoggedIn(req,res,next) {
  console.log("checking to see if user is authenticated!");
  //if user is authenticated in the session, continue
  res.locals.loggedIn = false;
  if (req.isAuthenticated()){
    console.log("user has been Authenticated");
    res.locals.user = req.user
    res.locals.loggedIn = true
    return next();
  } else {
    console.log("user has not been authenticated...");
    res.redirect('/login');
  }
}


// here is where we check on a user's log-in status (middleware)
app.use((req,res,next) => {
  res.locals.loggedIn = false
  if (req.isAuthenticated()){
    console.log("user has been Authenticated")
    res.locals.user = req.user
    res.locals.loggedIn = true
    if (req.user){
      if (req.user.googleemail=='jelee14108@brandeis.edu'
          || req.user.googleemail == 'chungek@brandeis.edu'
          || req.user.googleemail == 'casperlk@brandeis.edu'){
        console.log("Owner has logged in")
        res.locals.status = 'owner'
      } else {
        console.log('some user has logged in')
        res.locals.status = 'user'
      }
    }
  }
  next();
})



//Casper's Testing Ground>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

nowExact = new Date(2018, 7, 30, 11)
date = new Date(Date.UTC(nowExact.getFullYear(), nowExact.getMonth(), nowExact.getDate(), nowExact.getUTCHours()))
console.log("date:      "+date)
var start = new Date(Date.UTC(2018, 6, 24,12))
var end = new Date(Date.UTC(2018, 6, 26,12))
console.log("start: "+start)
console.log("end: "+end)

EnterVanDays.enterVanDays(start, end, [true,true,true,true,true,true,true], 2010, "campusVan")

//Casper's Testing Ground<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<


//* JEN TESTING
const apiquery = new transLocAPI(707);
var stop = 'Prudential';
var route = 'MGH – BWH';
// var route_id = apiquery.findRouteId(route);

//This rout is visited to start google authentication. Passport will send you to
//Google to get authenticated. Then, it will send the browser back to /login/authorized page
app.get('/auth/google',
    passport.authenticate('google',
                         { scope : ['profile', 'email'] }));

app.get('/login/authorized',
        (req,res,next) => {
          console.log('we are in login/authorized')
          next()
        },
        passport.authenticate('google', {
                successRedirect : '/',
                failureRedirect : '/loginerror'
        }));

//Authentication routes
app.get('/loginerror', function(req,res){
  res.render('loginerror',{})
})
app.get('/login', function(req,res){
  res.render('login',{})
})
// route for logging out
app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });


//webhook to use dialogflow and alexa
app.post('/webhook', DFShuttleController.respondToDF);


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
