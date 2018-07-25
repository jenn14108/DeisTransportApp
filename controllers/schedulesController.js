'use strict'
console.log("loading the schedules controller...");
//const Query = require('../Query')

exports.renderMain = (req,res) => {
  res.render('schedules', {title: "Schedules"});
};

exports.getSchedule = (req,res, next) => {
  console.log("in getSchedules")
  var route = req.body.schedule
  var name;
  if (route == "2010") {
    name = "Campus BranVan (Weekdays)"
  } else if (route == "2011") {
    name = "Campus BranVan (Weekends)"
  } else if (route == "2020") {
    name = "Daytime Campus Shuttle"
  } else if (route == "3020") {
    name = "Daytime Waltham Shuttle"
  } else if (route == "3010") {
    name = "Evening Waltham Branvan"
  } else if (route == "1010") {
    name = "Boston/Cambridge Shuttle (Thurs)"
  } else if (route == "1020") {
    name = "Boston/Cambridge Shuttle (Fri)"
  } else if ( route == "1030") {
    name = "Boston/Cambridge Shuttle (Sat)"
  } else if (route == "1040") {
    name = "Boston/Cambridge Shuttle (Sun)"
  }
  console.log("fetching schedule of route: " + route)
  var stops = Query.getSchedule(route).then(data =>
    {
      res.render('schedules', {name:name, data:data})
    })
}
