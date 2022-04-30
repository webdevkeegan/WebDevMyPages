
$(document).ready(function() {
    $("#alert_button").text("");

    $("#save_button").on('click',function(){
        console.log("clicked save button")

        if($('#description_to_be_updated').val()=== null  || $('#description_to_be_updated').val()===NaN){
            console.log("check description_to_be_updated");
            $("#alert_button").text("description cannot be empty");
            return false;
        }

        else{
            $("#edit_aboutUs_form").submit(); //submit if no user error
        }
    });
});
