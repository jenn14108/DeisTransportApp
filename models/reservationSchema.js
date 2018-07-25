const mongoose = require( 'mongoose' );

var reservationSchema = mongoose.Schema({
  van_name : String,
  from: String,
  to: String,
  pickup_time: Date,
  date: Date
});

module.exports = mongoose.model('reservationSchema', reservationSchema);
