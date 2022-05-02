
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


//-------EDITING BUTTON FOR PARTNER

function load_partner(partner) {
    partner = JSON.parse(partner);
    console.log("in load_partner"+partner)
    $('#partner_to_be_added').val(partner.name);
    $('#partner_url').val(partner.link);
    $('#partner_logo').val(partner.image);

}

//--------------------


let id = ''
$(document).ready(() => {

    $.get('/send_partner_id').done((data) => {
        id = data.id //where id is service's name
        console.log("in /send_partner_id:")
        console.log(id)
        if(id !== "") {
            $.getJSON('/get_partner_id?id=' + id)
                .done((data) => {
                    console.log("in /get_partner_id?id=:")
                    console.log(data)

                    if (data.message === "success") {
                        const partner = JSON.stringify(data.partner);
                        console.log(partner)
                        load_partner(partner)
                    }
                })
        }
    })
});