'use strict';
const mongoose = require( 'mongoose' );

var BostonCambridgeShuttleScheduleSchema = mongoose.Schema( {
  day: String,
  stop: String,
  arrival_times : [{time: Number},
                    {time: Number},
                    {time: Number},
                    {time: Number},
                    {time: Number},
                    {time: Number},
                    {time: Number},
                    {time: Number},
                    {time: Number},
                    {time: Number},
                    {time: Number},
                    {time: Number},
                    {time: Number}]
});

module.exports = mongoose.model( 'BostonCambridgeShuttleSchedule', BostonCambridgeShuttleScheduleSchema );
