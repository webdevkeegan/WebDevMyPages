



///---------------------

$('#partnerGrid').empty();

function get_partner_obj(partner) {
    return `<div class="col-md-3 imgDiv mx-auto d-flex align-self-center" >
                <img class="partner_poster" data-p="${partner.link}" src="${partner.image}">
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

$.getJSON("data/partnersData.json",()=>{
    console.log("file loaded")
}).done((data)=>{ //data will be the json object
    data.forEach((partner)=>{
        // console.log(msg); //check if message is being loaded
        $('#partnerGrid').append(() => {
            return get_partner_obj(partner)
        });
    })

    $('.partner_poster').on('click',function(){
        console.log($(this))
        const partner_ID=$(this).attr('data-p');
        // console.log(partner_ID)
        //location.href goes to webpage when user clicks
        location.href=partner_ID;
    });

});