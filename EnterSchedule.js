EnterSchedule: function(sched_id, file) {
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


  
}
