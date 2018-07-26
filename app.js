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
 loginRouter = require('./routes/loginRouter');
 mainPageRouter = require('./routes/mainPageRouter');
 trackerController = require('./controllers/trackerController');
 reservationController = require('./controllers/reservationController');
 schedulesController = require('./controllers/schedulesController');
 DFShuttleController = require('./controllers/DFShuttleController');
 //VanShuttleSchedulesController = require('./controllers/VanShuttleSchedulesController');
 //Set up needed variables in order to do authentication
 GoogleStrategy = require('passport-google-oauth').OAuth25Strategy; //in cofig/passport.j
 session = require('express-session');
 passport = require('passport');
 configPassport = require('./config/passport');
 configPassport(passport);
 app = express();
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

console.log('API server listening...');


//mongoose.connect( mongoDB, function(err, db) {
//{ useNewUrlParser: true }
// here is where we connect to the database!
const mongoDB = process.env.MONGO_URI || 'mongodb://localhost/DeisTransportApp'
mongoose.connect( mongoDB ,{useNewUrlParser: true})
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
console.log("we are connected!")
});

//Casper's Testing Ground>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

// nowExact = new Date(2018, 7, 30, 11)
// date = new Date(Date.UTC(nowExact.getFullYear(), nowExact.getMonth(), nowExact.getDate(), nowExact.getUTCHours()))
// console.log("date:      "+date)
//
// var function_list = []
//
// function_list.push(function(callback)
// {
//   EnterVanDays.enterVanDays(new Date(Date.UTC(2019, 6, 19, 12)), new Date(Date.UTC(2019, 6, 19, 12)), [true,true,true,true,true,true,true], 0, "campusVan")
// })
//
// EnterVanDays.enterVanDays(new Date(Date.UTC(2019, 6, 20, 12)), new Date(Date.UTC(2019, 6, 20, 12)), [true,true,true,true,true,true,true], 0, "campusVan")

//Casper's Testing Ground<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<

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

// this handles all static routes ...
// so don't name your routes so they conflict with the public folders
app.use(express.static(path.join(__dirname, 'public')));
//app.use(checkLoggedIn);
app.use('/', mainPageRouter);
app.get('/reserve', reservationController.renderMain);
app.get('/tracker', trackerController.renderMain);
app.post('/getEstimate', trackerController.getEstimate);
//app.get('/schedules', PartnersShuttleController.renderMain);
app.get('/schedules', schedulesController.renderMain);
app.post('/getSchedule', schedulesController.getSchedule);

// if(req.isAuthenticated()) res.locals.isLoggedIn = true;
// next();
// Authentication must have these three middleware in this order!
app.use(session({ secret: 'zzbbyanana' }));
app.use(passport.initialize());
app.use(passport.session());

app.use('/login', loginRouter);

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


//This rout is visited to start google authentication. Passport will send you to
//Google to get authenticated. Then, it will send the browser back to /login/authorized page
app.get('/auth/google', passport.authenticate('google', { scope : ['profile', 'email'] }));

app.get('/login/authorized',
        passport.authenticate('google', {
                successRedirect : '/',
                failureRedirect : '/loginerror'
        }));

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
