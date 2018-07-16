var mongoose = require( 'mongoose' );
var VanDaySchema = require('./models/VanDaySchema')
var VanDay = mongoose.model( "VanDay", VanDaySchema );
var async = require('async');


exports.addVanSchedulePair = function (date, sched_id, van_name)
{
var vanSchedulePair = {van: van_name, schedule_id: sched_id};
VanDay.findOneAndUpdate({date: date}, {$push: {schedule_by_van: vanSchedulePair}});
};


exports.step = function step(i, end_date, days, sched_id, van_name) {
  //async.parrallel
  //async.waterfall
  //async.series

  const function_list = [];

  for(let date = i; date <= end_date; date = new Date(date.setDate(date.getDate() + 1))){
    console.log("entering van days")
    function_list.push(function(callback){
      console.log("In push function callback")
      if (days[date.getDay()]) { // if the day of the week is one of the days we are editing
        console.log("days[date.getDay()] is true")
        VanDay.findOne({date: date}, function(err, doc){ // find the first document with the given date
          if (err) {
            console.log("err1: "+err)
            console.log("doc: "+doc)
            callback(err, null);
            return;
          }
          if(doc) { //if doc with Date date was found
            console.log("Document found with matching date. Editing document.")
            //add van_name and sched_id to the array
            console.log("doc.schedule_by_van.van_name: "+doc.schedule_by_van.van_name)
            if (false) { //if there is already a schedule assigned for that van on that day
              // console.log("Success!!!")
            } else { //if the van is not assigned a schedule for that day

              var vanSchedulePair = {van: van_name, schedule_id: sched_id};
              VanDay.update(
                {date: date},
                {$push: {schedule_by_van: vanSchedulePair}},
                function(err, vanDay) {
                  if (err) {
                    callback(err, null);
                  } else {
                    callback(null);
                  }
                }
              )
            }
          } else { //if doc with Date date was not found and there was no error
            //create new document with Date date, van van_name, schedule_id sched_id
            console.log("Document not found. Creating document.")
            console.log(date);
            const new_vanday = new VanDay({
              date: date,//,
              schedule_by_van: {
                van: van_name,
                schedule_id: sched_id
              }
            })
            //save the new entry
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
      console.log("days[date.getDay()] is false")



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
