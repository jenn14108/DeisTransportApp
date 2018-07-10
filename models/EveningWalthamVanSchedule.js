'use strict';
const mongoose = require( 'mongoose' );

var EveningWalthamVanScheduleSchema = mongoose.Schema( {
  stop: String,
  arrival_times : [{time: Number},
                    {time: Number}]
});

module.exports  = mongoose.model( 'EveningWalthamVanSchedule', EveningWalthamVanScheduleSchema );
