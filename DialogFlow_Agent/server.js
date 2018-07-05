var express = require('express');
var bodyParser = require('body-parser');
var util = require("util");
var csv = require("csv");
var service = express();
var obj = csv();
var parameters = require('./parameters');
service.use(bodyParser.json());
var server = service.listen(8081, function() {
  console.log('API server listening...');
});


var myData = [];


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