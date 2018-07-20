//this is used to load all JSON files into local mongoDB

//create datasets for all shuttles
var dayTimeWalthamVan = readJSONFile("./JSON_Schedules/DaytimeWalthamShuttleSchedule.json");
var campusVan = readJSONFile("./JSON_Schedules/CampusVanSchedule.json");
var dayTimeCampusShuttle = readJSONFile("./JSON_Schedules/dayTimeCampusShuttleSchedule.json");
var eveningWalthamVan = readJSONFile("./JSON_Schedules/eveningWalthamVanSchedule.json");
var bostonShuttleThurs = readJSONFile("./JSON_Schedules/BostonCambridgeShuttleTHursSchedule.json");
var bostonShuttleFri = readJSONFile("./JSON_Schedules/BostonCambridgeShuttleFriSchedule.json");
var bostonShuttleSat = readJSONFile("./JSON_Schedules/BostonCambridgeShuttleSatSchedule.json");
var bostonShuttleSun= readJSONFile("./JSON_Schedules/BostonCambridgeShuttleSunSchedule.json");

//console.log statements to check that files have been successfully loaded into node.js
//console.log(util.inspect(dayTimeWalthamShuttleSchedule, false, null));
//console.log(util.inspect(campusVanSchedule, false, null));
//console.log(util.inspect(schedules, false, null));

//function to load .json schedules into node.js
function readJSONFile (file) {
  var temp = fs.readFileSync(file);
  return JSON.parse(temp);
}

//compile all boston schedules
var bostonSchedules = bostonShuttleThurs,
                      bostonShuttleFri,
                      bostonShuttleSat,
                      bostonShuttleSun;

//create 5 collections to store the different van/shuttle schedules
bostonCambridgeShuttleSchedule.collection.insertMany(bostonSchedules, function(err,r){
    assert.equal(null,err);
    assert.equal(3, r.insertedCount);
});
campusVanSchedule.collection.insertMany(campusVan, function(err,r){
    assert.equal(null,err);
    assert.equal(8, r.insertedCount);
});
dayTimeCampusShuttleSchedule.collection.insertMany(dayTimeCampusShuttle, function(err,r){
    assert.equal(null,err);
    assert.equal(6, r.insertedCount);
});
eveningWalthamVanSchedule.collection.insertMany(eveningWalthamVan, function(err,r){
    assert.equal(null,err);
    assert.equal(4, r.insertedCount);
});
daytimeWalthamShuttleSchedule.collection.insertMany(dayTimeWalthamVan, function(err,r){
    assert.equal(null,err);
    assert.equal(11, r.insertedCount);
});
