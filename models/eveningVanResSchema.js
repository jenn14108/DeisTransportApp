const mongoose = require( 'mongoose' );

var eveningVanResSchema = mongoose.Schema({
  run_time: String,
  stops: [
    {
      stop: String,
      num_res: Number
    }
  ]
});

module.exports = mongoose.model('eveningVanReservationCheck', eveningVanResSchema);
