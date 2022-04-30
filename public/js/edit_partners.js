
$(document).ready(function() {
    $("#alert_button").text("");

    $("#save_button").on('click',function(){
        console.log("clicked save button")

        if($('#partner_to_be_added').val()=== null || $('#partner_to_be_added').val().length <= 0 || $('#partner_to_be_added').val()===NaN){
            console.log("check partner_to_be_added");
            $("#alert_button").text("partner name cannot be empty");
            return false;
        }
        if($('#partner_url').val()=== null ||$('#partner_url').val().length <= 0 || $('#partner_url').val()===NaN){
            console.log("check partner_url");
            $("#alert_button").text("partner url cannot be empty");
            return false;
        }
        if($('#partner_logo').val()=== null ||$('#partner_logo').val().length <= 0 || $('#partner_logo').val()===NaN){
            console.log("check partner_logo");
            $("#alert_button").text("partner logo cannot be empty");
            return false;
        }

        else{
            $("#edit_partner_form").submit(); //submit if no user error
        }
    });
});
