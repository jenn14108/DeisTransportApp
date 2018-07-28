const mongoose = require( 'mongoose' );

var reservationSchema = mongoose.Schema({
  name: String,
  van_name: String,
  from: String,
  to: String,
  pickup_time: String,
  date: Date,
  num_people: Number
});

module.exports = mongoose.model('reservation', reservationSchema);
