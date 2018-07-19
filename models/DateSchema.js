const mongoose = require( 'mongoose' );

var DateSchema = mongoose.Schema({
  date : Date
});

module.exports = DateSchema
