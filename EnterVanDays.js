//Month index is 0 based, all others are 1 based

//parameters: start_date, end_date, boolean array of length 7 indicating which days the given schedule is in use, schedule_id, van name
// var mongoose = require( 'mongoose' );
// var VanDay = require('./models/VanDaySchema')
// var Schedule = require('./models/ScheduleSchema')
//
//
// const mongoDB = process.env.MONGO_URI || 'mongodb://localhost/DeisTransportApp'
// mongoose.connect( mongoDB )
// const db = mongoose.connection;
// mongoose.Promise = global.Promise;
// db.on('error', console.error.bind(console, 'connection error:'));
// db.once('open', function() {
//   console.log("we are connected!")
// });

//THIS WORKS:

// var dayOne = new VanDay({date: new Date(2018, 6, 12), schedule_id: 0000})
//
// dayOne.save(function (err, dayOne) {
//     if (err) return console.error(err);
// });
//
// VanDay.find(function (err, VanDays) {
//   if (err) return console.error(err);
//   console.log(VanDays);
// })

module.exports = {
 EnterVanDays: function(start_date, end_date, days, sched_id, van_name) {
    var mongoose = require( 'mongoose' );
    var VanDay = require('./models/VanDaySchema')
    var Schedule = require('./models/ScheduleSchema')


    const mongoDB = process.env.MONGO_URI || 'mongodb://localhost/DeisTransportApp'
    mongoose.connect( mongoDB )
    const db = mongoose.connection;
    mongoose.Promise = global.Promise;
    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', function() {
      console.log("we are connected!")
    });

    for (var i = start_date; i <= end_date; i.setDate(i.getDate() + 1)) {
      if (days[i.getDay()]) { //if the day of the week is one that we want to set schedule for
        var vanDay = new VanDay({date: i, schedule_id: sched_id})
        console.log(vanDay)
        vanDay.save(function(err, vanDay) {
          if (err) return console.error(err)
        });
      }
    }
  }
}
