'use strict'
console.log("loading the schedules controller...");
//const Query = require('../Query')

exports.renderMain = (req,res) => {
  res.render('schedules', {title: "Schedules"});
};

exports.getSchedule = (req,res, next) => {
  console.log("in getSchedules")
  var route = req.body.schedule
  console.log(req.body.schedule.name)
  console.log("fetching schedule of route: " + route)
  var stops = Query.getSchedule(route).then(data =>
    {
      res.render('schedules', {data:data})
    })
}
