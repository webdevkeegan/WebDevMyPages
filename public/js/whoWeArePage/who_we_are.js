$('#servicesGrid').empty();

function get_service_obj(service) {
    return `<div class="col mb-2 aservice " data-l="${service.service}" >

            <div class="card col mb-2 pt-3 serviced text-center h-100" style="border-color: #d90429">
              <div class="serviced-body">
                <h5 class="serviced-title ">${service.service}</h5>
                
                <p class="serviced-text hideBio">${service.description}</p>
                
<!--                edit button-->
                <button class="btn btn-sm btn-primary edit_btn_service col-auto hide" data-l="${service.service}" 
            value='${JSON.stringify(service)}'>Edit service</button>
            
<!--                delete button-->
                <button class="btn btn-sm btn-danger delete_btn_service col-auto hide" data-l="${service.service}"
            value='${JSON.stringify(service)}'>Delete service</button>
              </div>              
            </div>
           
            </div>
            `
}

function get_person_obj(person) {
    return `<div class="col mb-2 aperson" data-l="${person.contact}">
            <div class="card serviced text-center h-100 p-card">
            <img class="serviced-img-top " src=${person.profile_picture} alt="profile picture">
              <div class="serviced-body ">
                <h2 class="serviced-title">${person.name}</h2>
                <h3 class="serviced-text">${person.title}</h3>
                <h5 class="serviced-text">${person.department}</h5>
                <p class="serviced-text">${person.contact}</p>
                <!--           toggle     bio button-->
                <p class="hideBio">${person.bio}</p>
                
<!--                edit button-->
                <button class="btn btn-sm btn-primary edit_btn_person col-auto hide" data-l="${person.contact}"
            value='${JSON.stringify(person)}'>Edit person</button>
                            
<!--                delete button-->
                <button class="btn btn-sm btn-danger delete_btn_person col-auto hide" data-l="${person.contact}"
            value='${JSON.stringify(person)}'>Delete person</button>
              </div>
              
            </div></div>
            `
}

//---------------show services-----------------------------------------
$.getJSON("data/servicesProvided.json", () => {
    console.log("file loaded")
}).done((data) => { //data will be the json object
    data.forEach((service) => {
        console.log(service); //check if message is being loaded
        $('#servicesGrid').append(() => {
            return get_service_obj(service)
        });
    });
    $('.delete_btn_service').on('click',function(){

        console.log($(this).attr('value')); //still is json string
        const service = JSON.parse($(this).attr('value')); //convert to obj
        console.log("LINE 54 YEEHAW"+service.service);
        $.post('/delete-service',{"service":service.service})
            .done(()=>{
                //force refresh

                location.reload();
            });

    });

    //prefill form with already entered info if edit button clicked
    $('.edit_btn_service').on('click', function () {
        // console.log($(this).attr('value'));
        const service = JSON.parse($(this).attr('value')); //convert to obj

        //sends person's name as id
        $.post('/set_service_id', {serviceName: service.service}).done((data) => {
            if (data.message === "success") {
                location.href = "/new-service"
            }
        })
    });

    //blank form
    $('#addNEWService').on('click', function () {
        // console.log($(this).attr('value'));

        //sends person's name as id
        $.post('/set_service_id', {serviceName: ""}).done((data) => {
            if (data.message === "success") {
                location.href = "/new-service"
            }
        })
    });





});
//--------------------------------------------------------------


//---------------show people-----------------------------------------

$.getJSON("data/people.json", () => {
    console.log("file loaded")
}).done((data) => { //data will be the json object
    data.forEach((person) => {
        console.log(person); //check if message is being loaded
        $('#peopleGrid').append(() => {
            return get_person_obj(person)
        });
    });
    $('.delete_btn_person').on('click',function(){

        console.log($(this).attr('value')); //still is json string
        const person = JSON.parse($(this).attr('value')); //convert to obj
        console.log("LINE 83 DELETE PERSON"+person.name);
        $.post('/delete-person',{"person":person.name})
            .done(()=>{
                //force refresh

                location.reload();
            });

    });

    //prefill form with already entered info if edit button clicked
    $('.edit_btn_person').on('click', function () {
        // console.log($(this).attr('value'));
        const person = JSON.parse($(this).attr('value')); //convert to obj

        //sends person's name as id
        $.post('/set_person_id', {personName: person.name}).done((data) => {
            if (data.message === "success") {
                location.href = "/new-person"
            }
        })
    });

    //blank form
    $('#addNEWperson').on('click', function () {
        // console.log($(this).attr('value'));

        //sends person's name as id
        $.post('/set_person_id', {personName: ""}).done((data) => {
            if (data.message === "success") {
                location.href = "/new-person"
            }
        })
    });





});
//-----------------------------------------------------------------

// $('.aperson').on('click', function () {
//     console.log("clicked aperson")
//     $(this).find(".hideBio").toggle("hideBio");
// });
// $(".aperson").click(function() {
//     console.log("clicked aperson")
// });

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

// $(".aperson").click(function() {
//     console.log("clicked aperson")
// });

$(document).on( 'click', '.aperson', function () {
    console.log("clicked aperson")
    console.log($(this))
    $(this).find(".hideBio").fadeToggle("hideBio");
    $(this).find(".card").toggleClass("bg-light");
});

$(document).on( 'click', '.aservice', function () {
    console.log("clicked aservice")
    console.log($(this))
    $(this).find(".hideBio").fadeToggle("hideBio");
    $(this).find(".card").toggleClass("bg-light");
    $(this).find(".card").toggleClass("adjustWidth");
});
