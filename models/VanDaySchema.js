const mongoose = require( 'mongoose' );

var VanDaySchema = mongoose.Schema({
  date : Date,
  schedule_id : Number
});

module.exports = 
mongoose.model( 'VanDay', VanDaySchema );
