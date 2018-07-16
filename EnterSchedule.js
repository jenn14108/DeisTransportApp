var mongoose = require( 'mongoose' );
var ScheduleSchema = require('./models/ScheduleSchema')
var Schedule = mongoose.model( 'Schedule', ScheduleSchema );
var async = require('async');

//var vanSchedulePair = {van: van_name, schedule_id: sched_id};

exports.enterSchedule = function enterSchedule(sched_id, stopsVar)
{
  const function_list = [];
  function_list.push(function(callback)
  {
    const schedule = new Schedule({schedule_id: sched_id, stops: stopsVar})
    schedule.save(function(err) { if (err){callback(err, null);} else {callback(null);}})
  })
  async.parallel(function_list, function(err, results){if(err){console.log(err);} else {console.log('done!');}})
}

/**
var ScheduleSchema = mongoose.Schema({
  schedule_id: Number,
  stops: [{
    stop: String,
    times: [Date]
  }]
});
*/
