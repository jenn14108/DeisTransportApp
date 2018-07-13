const mongoose = require( 'mongoose' );

var VanDaySchema = mongoose.Schema({
  date : Date,
  schedule_by_van: [
    {
      van: String,
      schedule_id: Number
    }
  ]
});

module.exports = VanDaySchema
