$( document ).ready(function() {
  $("button[name='make-res']").on('click',function() {
       console.log('button clicked');

       //check if all information is filled out. Then decide which pop-up to display
       if (($("select[name='vanType']").val() === 'Select a van')
            || ($("select[name='stopFrom']").val() === 'Select a stop')
            || ($("select[name='stopTo']").val() === 'Select a stop')
            || ($("select[name='time']").val() === 'Select a time')){
          $(".alert-warning").css("display", "block");
          setTimeout(function(){
            $(".alert-warning").css("display", "none");
          }, 3000)
          return;
        } else {
          $(".alert-success").css("display", "block");
          setTimeout(function(){
            $(".alert-success").css("display", "none");
          }, 3000)
          return;
        }
  });
});
