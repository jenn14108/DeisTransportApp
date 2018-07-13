'use strict'
console.log("loading the reservation controller...");


exports.renderMain = (req,res) => {
  res.render('reserve', {title: "Reserve A Spot"});
}

//NEW
