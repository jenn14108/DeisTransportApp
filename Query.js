exports.getSchedule = function getSchedule(sched_id)
{
  Schedule.findOne({schedule_id: sched_id}, function (err, Schedules)
  {
    if (err) return console.error("error 1: "+err);
    if (Schedules)
    {
      var end = false;
      var i = 0;
      while(!end)
      {
        var time = Schedules.stops[0].times[i]
        if (time)
        {
          // console.log(time)
        }
        else
        {
          end = true
        }
        i++
      }
      return Schedules;
    }
  })
}
