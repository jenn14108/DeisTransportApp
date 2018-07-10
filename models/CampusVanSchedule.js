'use strict';
const mongoose = require( 'mongoose' );

var CampusVanScheduleSchema = mongoose.Schema( {
  stop: String,
  arrival_times : [{time: Number},
                   {time: Number},
                   {time: Number},
                   {time: Number}]
});


module.exports  = mongoose.model( 'CampusVanSchedule', CampusVanScheduleSchema );
