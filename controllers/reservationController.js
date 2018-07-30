'use strict'
const reservation = require('../models/reservationSchema');
const wkendResCheck = require('../models/wkendVanResSchema');
const wkdayResCheck = require('../models/wkdayVanResSchema');
const eveningResCheck = require('../models/eveningVanResSchema');
const moment = require('moment');
console.log("loading the reservation controller...");
exports.renderMain = (req,res) => {
  res.render('reserve', {title: "Reserve A Spot"});
}

exports.getRouteInfo = (req,res) => {
  console.log("in getRouteInfo")
  var route = req.body.vanType
  var name;
  if (route == "2010") {
    name = "Campus BranVan (Weekdays)"
  } else if (route == "2011") {
    name = "Campus BranVan (Weekends)"
  } else if (route == "3010") {
    name = "Evening Waltham Branvan"
  }
  console.log("fetching info of route: " + name)
  var stops = Query.getSchedule(route).then(data =>
    {
      //res.render('schedules', {name:name, data:data})
      res.json({data: data});
    })
}

exports.addReservation = (req,res) => {
  if ((req.body.vanType === 'Select a van')
       || (req.body.stopFrom === 'Select a stop')
       || (req.body.stopTo === 'Select a stop')
       || (req.body.time === 'Select a time')
       || (req.body.numPeople === 'Select the number of people')){
         console.log("Incomplete Reservation. Not saved.");
         setTimeout(function(){
           res.render('reserve');
         }, 2000)
  } else {
    console.log("in addReservation")
    var routeNum = req.body.vanType
    var route;
    //determine which van
    if (routeNum == "2010") {
      route = "Campus BranVan (Weekdays)";
    } else if (routeNum == "2011") {
      route = "Campus BranVan (Weekends)";
    } else if (routeNum == "3010") {
      route = "Evening Waltham Branvan";
    }
    var todayDate = moment().format('LL')
    //start creating a new reservation
    console.log("creating a new reservation...");
    let newReservation = new reservation({
      name: brandeisUsername,
      van_name : route,
      from: req.body.stopFrom,
      to: req.body.stopTo,
      pickup_time: req.body.time,
      date: todayDate,
      num_people: req.body.numPeople
    });
    newReservation.save()
      .then( () => {
        setTimeout(function(){
          res.render('reserve');
        }, 2000)
      })
      .catch( error => {
        res.send(error);
      });
  }
};

//This method finds all the reservation for a particular driver based on
//the van type, the time of the run, and the present date
exports.findReservations = (req, res) => {
  if ((req.body.vanType === 'Select a van')
       || (req.body.time === 'Select a time')){
         console.log("Incomplete Search.");
           res.render('drivers');
  } else {
    var van;
    var todayDate = moment().format('LL')
    if (req.body.vanType == "2010") {
      van = "Campus BranVan (Weekdays)";
    } else if (req.body.vanType == "2011") {
      van = "Campus BranVan (Weekends)";
    } else if (req.body.vanType == "3010") {
      van = "Evening Waltham Branvan";
    }
    reservation.find({
      van_name: van,
      pickup_time: req.body.time,
      date: todayDate})
      .exec()
      .then((reservations) => {
        // if(reservations.length == 0){
        //   res.render('drivers');
        // } else {
          res.render('drivers', {
            reservations: reservations
          });
        // }
      })
      .catch((error) => {res.send(error)});
  }
};

//used to load all documents used to check for slots on vans
//into the collection (not used by users of app, used for dev purposes)
exports.addAllResChecks = (req , res) => {
  const times = ['12:00 AM' , '12:15 AM', '12:30 AM', '12:45 AM', '1:00 AM',
  '1:15 AM' , '1:30 AM', '1:45 AM', '2:00 AM', '2:15 AM',
  '7:00 AM' , '7:15 AM', '7:30 AM', '7:45 AM',
  '8:00 AM' , '8:15 AM', '8:30 AM', '8:45 AM',
  '9:00 AM' , '9:15 AM', '9:30 AM', '9:45 AM',
  '10:00 AM' , '10:15 AM', '10:30 AM', '10:45 AM',
  '11:00 AM' , '11:15 AM', '11:30 AM', '11:45 AM',
  '12:00 PM' , '12:15 PM', '12:30 PM', '12:45 PM',
  '1:00 PM' , '1:15 PM', '1:30 PM', '1:45 PM',
  '2:00 PM' , '2:15 PM', '2:30 PM', '2:45 PM',
  '3:00 PM' , '3:15 PM', '3:30 PM', '3:45 PM',
  '4:00 PM' , '4:15 PM', '4:30 PM', '4:45 PM',
  '5:00 PM' , '5:15 PM', '5:30 PM', '5:45 PM',
  '6:00 PM' , '6:15 PM', '6:30 PM', '6:45 PM',
  '7:00 PM' , '7:15 PM', '7:30 PM', '7:45 PM',
  '8:00 PM' , '8:15 PM', '8:30 PM', '8:45 PM',
  '9:00 PM' , '9:15 PM', '9:30 PM', '9:45 PM',
  '10:00 PM' , '10:15 PM', '10:30 PM', '10:45 PM',
  '11:00 PM' , '11:15 PM', '11:30 PM', '11:45 PM',
  ]
  for (i = 0; i < times.length ; i++){
    let newRunTime = new wkendResCheck ({
         run_time: times[i],
         stops: [
           {stop:"Rabb",
            num_res: 0} ,
           {stop:"Hassenfeld Lot",
            num_res: 0} ,
           {stop:"Main Entrance",
            num_res: 0} ,
           {stop:"Lower Charles River Road",
            num_res: 0} ,
           {stop:"Charles River Lot",
            num_res: 0} ,
           {stop:"Lemberg Children's Center",
            num_res: 0} ,
           {stop:"Foster Apartments (Mods/Gosman)",
            num_res: 0} ,
        ]
    });
    newRunTime.save();
    console.log("SAVED");

    let newRunTime1 = new wkdayResCheck ({
         run_time: times[i],
         stops: [
           {stop:"Rabb",
            num_res: 0} ,
           {stop:"Hassenfeld Lot",
            num_res: 0} ,
           {stop:"Main Entrance",
            num_res: 0} ,
           {stop:"Lower Charles River Road",
            num_res: 0} ,
           {stop:"Charles River Lot",
            num_res: 0} ,
           {stop:"Lemberg Children's Center",
            num_res: 0} ,
           {stop:"Foster Apartments (Mods/Gosman)",
            num_res: 0} ,
        ]
    });
    newRunTime1.save();
    console.log("SAVED");
  }
}
// console.log("adding reservation at " + pickup_time + " from " + from + " to " + to + " on the " + van_name + ".")

//var time is a string, if u want a date obj in the res constructor then u can use parse(time) as an argument in the new Date constructor
