exports.getSchedule = function getSchedule(sched_id)
{
  return Schedule.findOne({schedule_id: sched_id})
  .then(Schedules => Schedules.stops)
  .catch(err => console.log("error: "+err))
}

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

exports.getNextTime = function getNextTime(sched_id, stopName)
{
  nowExact = new Date()
  now = new Date(Date.UTC(2000, 0, 1, nowExact.getHours(), nowExact.getMinutes()))
  return this.getTimesForStop(sched_id, stopName)
  .then(times =>
  {
    if (times === "stop not found")
    {
      return new Date(Date.UTC(3000, 0, 1, 0, 0))
    }
    else
    {
      for (var i = 0; i < times.length; i++)
      {
        if (times[i] > now)
        {
          return times[i]
        }
      }
    }
  })
  .catch(err => console.log("error: "+err))
}


///"Make a method that will, given a day and a van, return schedule ID"

exports.getVanScheduleID = function getVanScheduleID(vanName) //campusVan, walthamVan, walthamShuttle, campusShuttle, cambridgeShuttle
{
  nowExact = new Date()
  now = new Date(Date.UTC(nowExact.getFullYear(), nowExact.getMonth(), nowExact.getDate()))

  return VanDay.findOne({date: now})
  .then(vanday => console.log(vanday))
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
