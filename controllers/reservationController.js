'use strict'
const reservation = require('../models/reservationSchema');
const moment = require('moment');
console.log("loading the reservation controller...");


exports.renderMain = (req,res) => {
  res.render('reserve', {title: "Reserve A Spot"});
}

exports.createReservation = (req,res) => {
  console.log("creating a new reservation...");
  let newReservation = new reservation({
    van_name : req.body.vanType,
    from: req.body.stopFrom,
    to: req.body.stopTo,
    pickup_time: req.body.time,
    date: moment().format('LL')
  });
  newReservation.save()
    .then( () => {
      res.redirect()
    })
}
