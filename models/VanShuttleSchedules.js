'use strict';
const mongoose = require( 'mongoose' );

var VanShuttleScheduleSchema = mongoose.Schema( {
  stop: {
    name: [String],
    arrival_times : [{time: String},
                    {time2: String},
                    {time3: String},
                    {time4: String},
                    {time5: String},
                    {time6: String},
                    {time7: String},
                    {time8: String},
                    {time9: String},
                    {time10: String},
                    {time11: String},
                    {time12: String},
                    {time13: String},
                    {time14: String}]
  }
});

const VanShuttleSchedules = mongoose.model( 'VanShuttleSchedules', VanShuttleScheduleSchema );
module.exports = VanShuttleSchedules;
