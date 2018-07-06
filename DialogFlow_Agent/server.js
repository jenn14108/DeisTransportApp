const
  express = require('express');
  bodyParser = require('body-parser');
  cookieParser = require('cookie-parser');
  util = require("util");
  service = express();
  mongoose = require('mongoose');
  service.use(bodyParser.json());


var server = service.listen(8000, function() {
  console.log('API server listening...');
});

//read in JSON file into node.js to save into mongoose
var fs = require("fs");
console.log("HOPEFULLY STARTING TO READ JSON FILE");
var readDayTimeVanSchedule = fs.readFileSync("DaytimeWalthamSchedule.json");
var dayTimeWalthamVanSchedule = JSON.parse(contents);
//check if the json file was correctly loaded into server.js 
//console.log(util.inspect(dayTimeWalthamVanSchedule, false, null));


//connect to database
mongoose.connect('mongodb://localhost/DeisTransportApp');
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function(){
  console.log("we are connected!");
})


// var shuttle_information = JSON.parse('DaytimeWalthamSchedule.json');
// console.log(shuttle_information);
// var myData = [];




service.post('/webhook', function (req, res){
  console.log(req);
   return res.json({
         "fulfillmentMessages": [],
         "fulfillmentText": "No I do not want to work for you. I am my own boss :)",
         "payload": {},
         "outputContexts": [],
         "source": "Test Source",
         "followupEventInput": {}
    });
});
