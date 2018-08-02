'use strict'
console.log("loading the myReservations controller...");
const reservation = require('../models/reservationSchema');

//const Query = require('../Query')

exports.renderMain = (req,res) => {
  res.render('myReservations', {title: "My Reservations"});
};


exports.getUserReservations = (req,res, next) => {
  console.log('in getUserReservations..');
  reservation.find( {
    name: res.locals.brandeisUsername
  } )
    .exec()
    .then( ( reservations ) => {
      console.log(reservations);
      res.locals.reservations = [];
      for (var i = 0 ; i < reservations.length; i++){
        var temp = (reservations[i].date).toString();
        var indexToDelete = temp.indexOf('G');
        var justDate = temp.substr(0,indexToDelete-10);
        res.locals.reservations.push({
          name: reservations[i].name,
          date: justDate,
          from: reservations[i].from,
          to: reservations[i].to,
          num_people: reservations[i].num_people,
          vanType: reservations[i].van_name,
          run_time: reservations[i].pickup_time
        });
      }
      next();
    })
    .catch( ( error ) => {
      console.log( error.message );
    });
}
