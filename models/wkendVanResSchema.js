const mongoose = require( 'mongoose' );

var wkendVanResSchema = mongoose.Schema({
  run_time: String,
  stops: [
    {
      stop: String,
      num_res: Number
    }
  ]
});

module.exports = mongoose.model('wkendVanReservationCheck', wkendVanResSchema);
