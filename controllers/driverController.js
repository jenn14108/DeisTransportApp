'use strict';
console.log("loading the driverController..");

exports.renderMain = (req,res) => {
  res.render('drivers', {title: 'For Drivers'});
};
