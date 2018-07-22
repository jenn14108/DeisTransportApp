module.exports = class transLocAPI {

  constructor(agency_id){
    this.agency_id = agency_id;
  }

  findRouteId(route){
    unirest.get("https://transloc-api-1-2.p.mashape.com/routes.json?agencies="+ this.agency_id + "&callback=call")
    .header("X-Mashape-Key", transloc_key)
    .header("Accept", "application/json")
    .end(function (result) {
      for (var i = 0; i < result.body.data[agency_id].length; i++){
        if (result.body.data[agency_id][i].long_name === route){
          console.log(route_id);
          return result.body.data[agency_id][i].long_name
        }
      }
    });
  }

  findStopId(stop){
    unirest.get("https://transloc-api-1-2.p.mashape.com/stops.json?agencies=707&callback=call")
    .header("X-Mashape-Key", transloc_key)
    .header("Accept", "application/json")
    .end(function (result) {
      for (var i = 0; i < result.body.data.length; i++){
        if (result.body.data[i].name === stop){
          stop_id = result.body.data[i].stop_id;
          console.log(stop_id);
          break;
        }
      }
    });
  }

  findArrivalEstimate(route_id, stop_id){
    unirest.get("https://transloc-api-1-2.p.mashape.com/arrival-estimates.json?agencies=707&callback=call&routes=" + route_id + "&stops=" + stop_id)
    .header("X-Mashape-Key", transloc_key)
    .header("Accept", "application/json")
    .end(function (result) {
      if(result.body.data[0] !== undefined){
        for (var i = 0; i < result.body.data[0].arrivals.length; i++){
          arrival_times.push(result.body.data[0].arrivals[i].arrival_at);
        }
      }
    });
  }
};
