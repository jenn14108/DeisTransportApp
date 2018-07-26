'use strict'
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
  console.log("in addReservation")
  var van = req.body.vanType
  var from = req.body.stopFrom
  var to = req.body.stopTo
  var time = req.body.time
  var vanName
  if (van == "2010") {
    vanName = "Campus BranVan (Weekdays)"
  } else if (van == "2011") {
    vanName = "Campus BranVan (Weekends)"
  } else if (van == "3010") {
    vanName = "Evening Waltham Branvan"
  }
  //JENN U CAN USE EITHER var van(route number) or vanName(route name) to create the res object.
  //var from & to are both van names.
  //var time is a string, if u want a date obj in the res constructor then u can use parse(time) as an argument in the new Date constructor
  console.log("adding reservation at " + time + " from " + from + " to " + to + " on the " + vanName + ".")
}
