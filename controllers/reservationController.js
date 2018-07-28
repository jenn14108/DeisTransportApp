'use strict'
const reservation = require('../models/reservationSchema');
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
      van_name : van,
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


// console.log("adding reservation at " + pickup_time + " from " + from + " to " + to + " on the " + van_name + ".")

//var time is a string, if u want a date obj in the res constructor then u can use parse(time) as an argument in the new Date constructor
