///---------------------

$('#partnerGrid').empty();

function get_partner_obj(partner) {
    return `<div class="col-md-3 imgDiv mx-auto d-flex align-self-center" >

<!--delete button-->
                <div class="col"><button class="btn btn-sm btn-danger delete_btn_partner col-auto hide" 
            value='${JSON.stringify(partner)}'>Delete partner</button></div>
            
<!--                edit button-->
                <button class="btn btn-sm btn-primary edit_btn_partner col-auto hide" data-l="${partner.link}" 
            value='${JSON.stringify(partner)}'>Edit partner</button>
            
            <div class="row">
                <img class="partner_poster" data-p="${partner.link}" src="${partner.image}">
                </div>
            </div>`
}

$('#aboutUsText').empty();
function get_aboutUs_text(text) {
    return `<div >
                <p class="serviced-text">${text.description}</p>
            </div>`
}


// partnersData.forEach((partner) => {
//     $('#partnerGrid').append(() => {
//         return get_partner_obj(partner)
//     });
// });

// $('.partner_poster').on('click',function(){
//     console.log($(this))
//     const partner_ID=$(this).attr('data-p');
//     // console.log(partner_ID)
//     //location.href goes to webpage when user clicks
//     location.href=partner_ID;
// });

//---------------show aboutUs-----------------------------------------
$.getJSON("data/aboutUs.json", () => {
    console.log("file loaded")
}).done((data) => { //data will be the json object
    data.forEach((text) => {
        console.log(text); //check if message is being loaded
        $('#aboutUsText').append(() => {
            return get_aboutUs_text(text)
        });
    });
    $('.edit_btn_aboutUs').on('click', function () {

        console.log($(this).attr('value')); //still is json string
        const text = JSON.parse($(this).attr('value')); //convert to obj
        console.log("LINE 51 aboutUS" + text.description);
        $.post('/new-aboutUs', {"text": text.description})
            .done(() => {
                //force refresh

                location.reload();
            });

    });
    //prefill form with already entered info if edit button clicked
    // $('.edit_btn_aboutUs').on('click', function () {
    //     // console.log($(this).attr('value'));
    //     const aboutUs = JSON.parse($(this).attr('value')); //convert to obj
    //
    //     //sends person's name as id
    //     $.post('/set_aboutUs_id', {aboutUsDescrip: aboutUs.description}).done((data) => {
    //         if (data.message === "success") {
    //             location.href = "/new-aboutUs"
    //         }
    //     })
    // })

});
//--------------------------------------------------------------


$.getJSON("data/partnersData.json", () => {
    console.log("file loaded")
}).done((data) => { //data will be the json object
    data.forEach((partner) => {
        // console.log(msg); //check if message is being loaded
        $('#partnerGrid').append(() => {
            return get_partner_obj(partner)
        });
    });

    $('.partner_poster').on('click', function () {
        console.log($(this))
        const partner_ID = $(this).attr('data-p');
        // console.log(partner_ID)
        //location.href goes to webpage when user clicks
        location.href = partner_ID;
    });
    $('.delete_btn_partner').on('click', function () {

        console.log($(this).attr('value')); //still is json string
        const partner = JSON.parse($(this).attr('value')); //convert to obj
        console.log("LINE 54 YOWZAA" + partner.link);
        $.post('/delete-partner', {"partner": partner.link})
            .done(() => {
                //force refresh

                location.reload();
            });

    });

    //prefill form with already entered info if edit button clicked
    $('.edit_btn_partner').on('click', function () {
        // console.log($(this).attr('value'));
        const partner = JSON.parse($(this).attr('value')); //convert to obj

        //sends partner's name as link
        $.post('/set_partner_id', {partnerName: partner.link}).done((data) => {
            if (data.message === "success") {
                location.href = "/new-partner"
            }
        })
    });


});

//-----------------------------------------------------------------

$(document).ready(() => {
    $.getJSON('/get_current_user').done((data) => {
        console.log(data.message)
        if (data.message === 'success') {
            $('#login').remove()
        }
        else {
            $('#logout').remove();
            $('.hide').each(function() {
                $(this).remove();
            })
        }
    })
})