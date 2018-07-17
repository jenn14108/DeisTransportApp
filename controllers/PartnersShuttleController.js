'use strict';
console.log("loading the PartnersShuttleController..");

exports.renderMain = (req,res) => {
  res.render('schedules', {title: 'Schedules'});
};


exports.respondToDF = (req, res) => {
  console.dir(req.body);
  const response = {
    "fulfillmentText" : "hello"
  }
  res.json(response);
};
