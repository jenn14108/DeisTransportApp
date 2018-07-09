'use strict';
const VanShuttleSchedules = require( '../models/VanShuttleSchedules' );
console.log("loading the VanShuttleScheduleController");


exports.respondToDF = (req, res) => {
  console.dir(req.body);
  const response =
  {
    "fulfillmentText" : "This is my own text response!"
  }
  res.json(response);
}


// this returns the right schedule
exports.getSchedule = ( req, res ) => {
  console.log('in getSchedule');
  Skill.find( {} )
    .exec()
    .then( ( skills ) => {
      res.render( 'skills', {
        skills: skills
      } );
    } )
    .catch( ( error ) => {
      console.log( error.message );
      return [];
    } )
    .then( () => {
      console.log( 'skill promise complete' );
    } );
};
