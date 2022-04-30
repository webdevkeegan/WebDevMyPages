///---------------------

$('#partnerGrid').empty();

function get_partner_obj(partner) {
    return `<div class="col-md-3 imgDiv mx-auto d-flex align-self-center" >
                <div class="col"><button class="btn btn-sm btn-danger delete_btn_partner col-auto " 
            value='${JSON.stringify(partner)}'>Delete partner</button></div>
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


});