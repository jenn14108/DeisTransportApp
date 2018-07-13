const mongoose = require( 'mongoose' );

/**
This is the schema for our van schedules
It can handle the following situations:
**Regular van schedules that repeat by week
**Periods of time during which the van is not running on that schedule
****(either not running at all, or on different schedule)
**Schedules that deviate from the standard schedule

Attribute Description:
**van_name=name of van: "Waltham", "Campus", "Cambridge"
**running_periods:
****Periods of time during which the van is running.
****This is an array of objects, where each object contains a start date and end date
**weekdays_running is a boolean array of length 7, where each slot refers to a day of the week, 0=sunday, 6=saturday. true=running, false=not running
**arrival_times is the standard schedule
*/


var ScheduleSchema = mongoose.Schema({
  schedule_id: Number,
  stops: [{
    stop: String,
    times: [Date]
  }]
});

module.exports = ScheduleSchema



/**



  van_name : String,            //Name of van: "Waltham" "Campus" "Cambridge"
  running_periods: [{Date, Date}]             //Denotes the periods of time in which the van is running. is an array of pairs of dates, where the first date is when the van starts running on its regular schedule, and the second is when it stops running on regular schedule
                  //new Date("<YYYY-mm-dd>") returns the ISODate with the specified date.

  weekdays_running : [Boolean], //days of the week that the van is running. True=running False=Not Running. index 0=Sunday index 6=Saturday
  [{
    arrival_times : [{
      stop: String,
      hour: Number,
      minute: Number
    }]
  }]
*/
