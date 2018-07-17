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
}
