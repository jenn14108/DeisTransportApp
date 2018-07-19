'use strict'
console.log("loading the schedules controller...");

exports.renderMain = (req,res) => {
  res.render('schedules', {title: "Schedules"});
};
