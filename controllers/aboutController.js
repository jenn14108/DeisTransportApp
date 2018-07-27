'use strict'
console.log("loading the about us controller...");
//const Query = require('../Query')

exports.renderMain = (req,res) => {
  res.render('about', {title: "About"});
};
