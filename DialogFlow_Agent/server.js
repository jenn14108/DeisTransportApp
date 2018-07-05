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