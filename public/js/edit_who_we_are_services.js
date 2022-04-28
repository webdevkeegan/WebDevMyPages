
$(document).ready(function() {
    $("#alert_button").text("");

    $("#save_button").on('click',function(){
        console.log("clicked save button")
        // console.log($('#stock_number').val())


        if($('#service_to_be_added').val()=== null || $('#service_to_be_added').val().length <= 0 || $('#service_to_be_added').val()===NaN){
            console.log("check service_to_be_added");
            $("#alert_button").text("Service cannot be empty");
            return false;
        }
        if($('#description_of_service').val()=== null ||$('#description_of_service').val().length <= 0 || $('#description_of_service').val()===NaN){
            console.log("check description_of_service");
            $("#alert_button").text("description of service cannot be empty");
            return false;
        }


        else{
            $("#edit_service_form").submit(); //submit if no user error
        }
    });
});
