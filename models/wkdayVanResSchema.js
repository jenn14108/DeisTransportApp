const mongoose = require( 'mongoose' );

var wkdayVanResSchema = mongoose.Schema({
 run_time: String,
 stops: [
   {
     stop: String,
     num_res: Number
   }
 ]
});

module.exports = mongoose.model('wkdayVanReservationCheck', wkdayVanResSchema);
