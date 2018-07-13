const mongoose = require( 'mongoose' );

var VanDaySchema = mongoose.Schema({
  date : Date,
  schedule_ids : [{String : Number}]  //Can I do this? I want to have entries like "Waltham" : 3452
});

module.exports = VanDaySchema
