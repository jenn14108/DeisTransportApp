'use strict';
const mongoose = require( 'mongoose' );

var DayTimeCampusShuttleScheduleSchema = mongoose.Schema( {
  stop: String,
  arrival_times : [{time: Number},
                    {time: Number},
                    {time: Number},
                    {time: Number}]
});

module.exports  = mongoose.model( 'DayTimeCampusShuttleSchedule', DayTimeCampusShuttleScheduleSchema );
