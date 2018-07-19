'use strict'
console.log("loading the tracker controller...");

exports.renderMain = (req,res) => {
  res.render('tracker', {title: "Tracker"});
};

exports.getEstimate = ( req, res) => {
  console.log("in getEstimate")
  var route = req.body.route
  var stop = req.body.stop
  console.log("fetching ETA of next van at " + stop + " on the " + route + " route.")
};
