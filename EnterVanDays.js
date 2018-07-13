var mongoose = require( 'mongoose' );
var VanDaySchema = require('./models/VanDaySchema')
var VanDay = mongoose.model( "VanDay", VanDaySchema );
var async = require('async');

exports.step = function step(i, end_date, days, sched_id, van_name) {
  //async.parrallel
  //async.waterfall
  //async.series

  const function_list = [];

  for(let date = i; date <= end_date; date = new Date(date.setDate(date.getDate() + 1))){
    function_list.push(function(callback){
      if (days[date.getDay()]) {
        VanDay.findOne({date: date}, function(doc, err){
          if (err) {
            callback(err, null);
            return;
          }
          if(doc) {
            //update
            VanDay.update(
              {date: date},
              { $push: {schedule_by_van: {van: van_name, schedule_id: sched_id}}},
              function(err, vanDay) {
                if (err) {
                  callback(err, null);
                } else {
                  callback(null);
                }
              }
            )
          } else {
            //create
            console.log(date);
            const new_vanday = new VanDay({
              date: date,//,
              schedule_by_van: {
                van: van_name,
                schedule_id: sched_id
              }
            })

            new_vanday.save(function(err){
              if (err){
                callback(err, null);
              } else {
                callback(null);
              }


              //
            })
          }
        })
      }




    })
  }

  async.parallel(function_list, function(err, results){
    if(err){
      console.log(err);
    } else {
      console.log('done!');
    }
  })
}
