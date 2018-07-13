module.exports = {
  EnterSchedule: function(sched_id, stopsString) {
    var mongoose = require( 'mongoose' );
    var VanDay = require('./models/VanDaySchema')
    var ScheduleSchema = require('./models/ScheduleSchema')
    var Schedule = mongoose.model( 'Schedule', ScheduleSchema );


    const mongoDB = process.env.MONGO_URI || 'mongodb://localhost/DeisTransportApp'
    mongoose.connect( mongoDB )
    const db = mongoose.connection;
    mongoose.Promise = global.Promise;
    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', function() {
      console.log("we are connected!")
    });

    var schedule = new Schedule({schedule_id: sched_id, stops: stopsString})

    //for stop in stops




  }
}
/**
var ScheduleSchema = mongoose.Schema({
  schedule_id: Number,
  stops: [{
    stop: String,
    times: [{Date}]
  }]
});
*/
