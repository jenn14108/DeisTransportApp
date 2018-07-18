var mongoose = require( 'mongoose' );
var VanDaySchema = require('./models/VanDaySchema')
var VanDay = mongoose.model( "VanDay", VanDaySchema );
var async = require('async');


exports.step = function step(i, end_date, days, sched_id, van_name)
{
  const function_list = [];

  for(let date = i; date <= end_date; date = new Date(date.setDate(date.getDate() + 1)))
  {
    console.log("entering van days")
    function_list.push(function(callback)
    {
      if (days[date.getDay()])    // if the day of the week is one of the days we are editing
      {
        VanDay.findOne({date: date}, function(err, doc) // find the first document with the given date
        {
          if (err)
          {
            console.log("err1: "+err)
            console.log("doc: "+doc)
            callback(err, null);
            return;
          }
          if (doc) //if doc with Date date was found
          {
            var updated = false
            console.log("Document found with matching date. Editing document.")
            for (var i = 0; i < doc.schedule_by_van.length; i++)
            {
              if (doc.schedule_by_van[i].van === van_name) //if there is already a schedule assigned for that van on that day
              {
                console.log("Van already had assigned schedule for given date, updating to new schedule")
                var array = doc.schedule_by_van
                doc.schedule_by_van[i] = {van: van_name, schedule_id: sched_id}
                console.log(array)
                VanDay.update(
                  {date: date},
                  {$set: {schedule_by_van: array}}
                )
                updated = true
              }
            }
            //add van_name and sched_id to the array

            if (!updated) //if the van is not assigned a schedule for that day
            {
              console.log("Van does not yet have schedule for this date, adding schedule")
              var vanSchedulePair = {van: van_name, schedule_id: sched_id};
              VanDay.update(
                {date: date},
                {$push: {schedule_by_van: vanSchedulePair}},
                function(err, vanDay) {if (err) {callback(err, null);} else {callback(null);}})
            }
          }
          else  //if doc with Date date was not found and there was no error, create new document with Date date, van van_name, schedule_id sched_id
          {
            console.log("Document not found. Creating document.")
            const new_vanday = new VanDay
            ({
              date: date,
              schedule_by_van: [{van: van_name, schedule_id: sched_id}]
            })
            new_vanday.save(function(err) { if (err){callback(err, null);} else {callback(null);}})  //save the new entry
          }
        })
      }
    })
  }
  async.parallel(function_list, function(err, results){if(err){console.log(err);} else {console.log('done!');}})
}
