$( document ).ready(function() {
  $("button[name='make-res']").on('click',function(event) {
       console.log('button clicked');
       event.preventDefault();
       //check if all information is filled out. Then decide which pop-up to display
       if (($("select[name='vanType']").val() === 'Select a van')
            || ($("select[name='stopFrom']").val() === 'Select a stop')
            || ($("select[name='stopTo']").val() === 'Select a stop')
            || ($("select[name='time']").val() === 'Select a time')
            || ($("select[name='numPeople']").val() === 'Select the number of people')){
            $(".alert-warning").css("display", "block");
          setTimeout(function(){
            $(".alert-warning").css("display", "none");
          }, 3000)
          return;
        }

       $.ajax({
         url:"/addReservation",
         type:"POST",
         data: {
           vanType: $("select[name='vanType']").val(),
           stopFrom: $("select[name='stopFrom']").val(),
           stopTo: $("select[name='stopTo']").val(),
           time: $("select[name='time']").val(),
           numPeople: $("select[name='numPeople']").val()
         },
         dataTypeL: 'json',
         success: function(data){
           $(".alert-success").css("display", "block");
           setTimeout(function(){
             $(".alert-success").css("display", "none");
           }, 3000)
         },
         error: function(err){
           $(".alert-danger").css("display", "block");
           setTimeout(function(){
             $(".alert-danger").css("display", "none");
           }, 3000)
         },
       })
  });
});
