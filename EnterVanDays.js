exports.enterVanDays = function enterVanDays(start_date, end_date, days, sched_id, van_name)
{
  for(let date = start_date; date <= end_date; date = new Date(date.setDate(date.getDate() + 1)))
  {
    if (days[date.getDay()])
    {
      VanDay.findOne({date: date})
      .then(vanday =>
        {
          if (vanday) //if there is a day already
          {
            var dayChanged = false
            var array = vanday.schedule_by_van
            update_loop: for (var i = 0; i < array.length; i++)
            {
              if (array[i].van == van_name) //if the van already had a schedule assigned for that day
              {
                array[i] = {van : van_name, schedule_id: sched_id}
                dayChanged = true
                break update_loop;
              }
            }
            if (!dayChanged) //if the van did not have a schedule assigned for that day
            {
              array[i] = {van : van_name, schedule_id: sched_id}
            }

            vanday.save().then().catch(err => console.log("err"+err))  //save the new entry
          }
          else //if there is not a day already
          {
            console.log("Document not found. Creating document.")
            const new_vanday = new VanDay
            ({
              date: date,
              schedule_by_van: [{van: van_name, schedule_id: sched_id}]
            })
            new_vanday.save().then().catch(err => console.log("err"+err))  //save the new entry
          }
        }
      )
      .catch(err => console.log("err: "+err))
    }
  }
}
