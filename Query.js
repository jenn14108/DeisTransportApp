//given schedule ID, return full schedule
exports.getSchedule = function getSchedule(sched_id)
{
  return Schedule.findOne({schedule_id: sched_id})
  .then(Schedules => {
    if (Schedules)
    {
      return Schedules.stops
    }
    return -1
    console.log("ccccccccccccccc")
  })
  .catch(err => console.log("error: "+err))
}

//given schedule ID and stop name, get all times for that stop
exports.getTimesForStop = function getTimesForStop(sched_id, stopName)
{

  var i = 0;
  return this.getSchedule(sched_id)
  .then(schedule =>
  {
    if (!schedule) //if 0 or not a valid schedule
    {
      console.log("aaaaaaaaaaaaaaa")
      return -1
    }
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
        return -1
      }
    }
  })
  .catch(err => {console.log("error: "+err)})
}

//given schedule ID and stop name, get next time of a van at that stop
exports.getNextTime = function getNextTime(sched_id, stopName, nowExact)
{
  if (!nowExact || nowExact == undefined)
  {
    var nowExact = new Date()
  }
  var offset = nowExact.getTimezoneOffset()
  // console.log("offset: "+offset)
  var now = new Date(Date.UTC(2000, 0, 1, nowExact.getHours(), nowExact.getMinutes()+300))
  console.log("now"+now)
  return this.getTimesForStop(sched_id, stopName)
  .then(times =>
  {
    if (times == -1)
    {
      return new Date(Date.UTC(3000, 0, 1, 0, 0))
    }
    else
    {
      // console.log("now: "+now)

      for (var i = 0; i < times.length; i++)
      {
        console.log("times[i]: "+times[i])
        if (times[i] > (now))
        {
          return new Date(nowExact.getFullYear(), nowExact.getMonth(), nowExact.getDate(), times[i].getHours(), times[i].getMinutes())
        }
      }
    }
  })
  .catch(err => console.log("error: "+err))
}

exports.getNextTimeForVan = function getNextTimeForVan(vanName, stopName)
{
  console.log("vanName: "+vanName)
  console.log("stopName: "+stopName)
  return this.getVanScheduleID(vanName)
  .then(sched_id => {
    console.log("asfasdfaggsgsdfgs"+sched_id)
    return this.getNextTime(sched_id, stopName)
  })
}


//note that you can call this without date and it will assume today
exports.getVanDay = function getVanDay(nowExact)
{
  console.log("nowExact: "+ typeof nowExact)
  if (!nowExact || nowExact==undefined)
  {
    console.log("making new today ")
    nowExact = new Date()
  }
  var offset = nowExact.getTimezoneOffset()
  // console.log("offset: "+offset)
  date = new Date(Date.UTC(nowExact.getFullYear(), nowExact.getMonth(), nowExact.getDate(), offset/60+8))
  // console.log("date: "+date)
  return VanDay.findOne({date: date})
  // .then(vanDay => console.log("vanDay: "+vanDay))
  .catch(err => console.log("error4: "+err))
}
///"Make a method that will, given a day and a van, return schedule ID"

//note that you can call this without date and it will assume today
exports.getVanScheduleID = function getVanScheduleID(vanName, date) //campusVan, walthamVan, walthamShuttle, campusShuttle, cambridgeShuttle
{
  console.log("date: "+date)
  return this.getVanDay(date)
  .then(vanday =>
  {
    console.log(vanday)
    // console.log("length: "+vanday)
    for (var i = 0; i < vanday.schedule_by_van.length; i++)
    {
      if (vanday.schedule_by_van[i].van === vanName)
      {
        // console.log("aaa"+vanday.schedule_by_van[i])
        // console.log("sched id: "+vanday.schedule_by_van[i].schedule_id)
        console.log("vanday.schedule_by_van[i].schedule_id: "+vanday.schedule_by_van[i].schedule_id)
        return vanday.schedule_by_van[i].schedule_id
      }
    }
    console.log("bbbbbbbbbbbbbbb")
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
