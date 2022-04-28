
$(document).ready(function() {
    $("#alert_button").text("");

    $("#save_button").on('click',function(){
        console.log("clicked save button")
        // console.log($('#stock_number').val())


        if($('#person_to_be_added').val()=== null || $('#person_to_be_added').val().length <= 0 || $('#person_to_be_added').val()===NaN){
            console.log("check person_to_be_added");
            $("#alert_button").text("Name cannot be empty");
            return false;
        }
        if($('#department_to_be_added').val()=== null ||$('#department_to_be_added').val().length <= 0 || $('#department_to_be_added').val()===NaN){
            console.log("check department_to_be_added");
            $("#alert_button").text("Department cannot be empty");
            return false;
        }
        if($('#title_to_be_added').val()=== null ||$('#title_to_be_added').val().length <= 0 || $('#title_to_be_added').val()===NaN){
            console.log("check title_to_be_added");
            $("#alert_button").text("Title cannot be empty");
            return false;
        }
        if($('#contact_to_be_added').val()=== null ||$('#contact_to_be_added').val().length <= 0 || $('#contact_to_be_added').val()===NaN){
            console.log("check contact_to_be_added");
            $("#alert_button").text("contact cannot be empty");
            return false;
        }
        if($('#picture_to_be_added').val()=== null ||$('#picture_to_be_added').val().length <= 0 || $('#picture_to_be_added').val()===NaN){
            console.log("check picture_to_be_added");
            $("#alert_button").text("URL cannot be empty");
            return false;
        }
        if($('#bio_to_be_added').val()=== null ||$('#bio_to_be_added').val().length <= 0 || $('#bio_to_be_added').val()===NaN){
            console.log("check bio_to_be_added");
            $("#alert_button").text("Bio ccannot be empty");
            return false;
        }


        else{
            $("#new_person_form").submit(); //submit if no user error
        }
    });
});
