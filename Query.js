//given schedule ID, return full schedule
exports.getSchedule = function getSchedule(sched_id)
{
  return Schedule.findOne({schedule_id: sched_id})
  .then(Schedules => Schedules.stops)
  .catch(err => console.log("error: "+err))
}

//given schedule ID and stop name, get all times for that stop
exports.getTimesForStop = function getTimesForStop(sched_id, stopName)
{
  var i = 0;
  return this.getSchedule(sched_id)
  .then(schedule =>
  {
    while(true)
    {
      if (schedule[i])
      {
        if (schedule[i].stop === stopName)
        {
          return schedule[i].times
        }
        i++
      }
      else
      {
        return "stop not found"
      }
    }
  })
  .catch(err => console.log("error: "+err))
}

//given schedule ID and stop name, get next time of a van at that stop
exports.getNextTime = function getNextTime(sched_id, stopName)
{
  var nowExact = new Date()
  var offset = nowExact.getTimezoneOffset()
  console.log("offset: "+offset)
  var now = new Date(Date.UTC(2000, 0, 1, nowExact.getHours(), nowExact.getMinutes()))
  return this.getTimesForStop(sched_id, stopName)
  .then(times =>
  {
    if (times === "stop not found")
    {
      return new Date(Date.UTC(3000, 0, 1, 0, 0))
    }
    else
    {
      console.log("now: "+now)

      for (var i = 0; i < times.length; i++)
      {
        console.log("times[i]: "+times[i])
        if (times[i] > (now))
        {
          return new Date(nowExact.getFullYear(), nowExact.getMonth(), nowExact.getDay(), times[i].getUTCHours(), times[i].getUTCMinutes())
        }
      }
    }
  })
  .catch(err => console.log("error: "+err))
}

exports.getNextTimeForVan = function getNextTimeForVan(vanName, stopName)
{
  return this.getVanScheduleID(vanName)
  .then(sched_id => this.getNextTime(sched_id, stopName))
}

exports.getVanDay = function getVanDay()
{
  nowExact = new Date()
  now = new Date(Date.UTC(nowExact.getFullYear(), nowExact.getMonth(), nowExact.getDate(), 12))
  return VanDay.findOne({date: now})
  .catch(err => console.log("error: "+err))
}
///"Make a method that will, given a day and a van, return schedule ID"

exports.getVanScheduleID = function getVanScheduleID(vanName) //campusVan, walthamVan, walthamShuttle, campusShuttle, cambridgeShuttle
{
  return this.getVanDay()
  .then(vanday =>
  {
    // console.log("length: "+vanday.schedule_by_van.length)
    for (var i = 0; i < vanday.schedule_by_van.length; i++)
    {
      if (vanday.schedule_by_van[i].van === vanName)
      {
        console.log("aaa"+vanday.schedule_by_van[i])
        console.log("sched id: "+vanday.schedule_by_van[i].schedule_id)
        return vanday.schedule_by_van[i].schedule_id
      }
    }
    return -1
  })
  .catch(err => console.log("error: "+err))
}

exports.getStopNames = function getStopNames(sched_id)
{
  return Schedule.findOne({schedule_id: sched_id})
  .then(Schedule =>
  {
    var array = []
    for (var i = 0; i < Schedule.stops.length; i++)
    {
      array.push(Schedule.stops[i].stop)
    }
    return array
  })
}


/**

parameter: id
return: times and stops



*/
