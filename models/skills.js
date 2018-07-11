'use strict';
const mongoose = require( 'mongoose' );

var skillSchema = mongoose.Schema( {
  name: String,
  description: String
} );

module.exports = mongoose.model( 'Skill', skillSchema );
