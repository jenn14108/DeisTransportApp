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
      van_name : route,
      from: req.body.stopFrom,
      to: req.body.stopTo,
      pickup_time: req.body.time,
      date: todayDate,
      num_people: req.body.numPeople
    });
    newReservation.save()
      .then( () => {
        res.render('reserve');
      })
      .catch( error => {
        res.send(error);
      });
  }
};


// console.log("adding reservation at " + pickup_time + " from " + from + " to " + to + " on the " + van_name + ".")

//var time is a string, if u want a date obj in the res constructor then u can use parse(time) as an argument in the new Date constructor
