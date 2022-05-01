$('#servicesGrid').empty();

function get_service_obj(service) {
    return `<div class="col mb-2">

            <div class="card col mb-2 pt-3 serviced text-center h-100 border-info">
              <div class="serviced-body">
                <h5 class="serviced-title ">${service.service}</h5>
                <p class="serviced-text">${service.description}</p>
                <button class="btn btn-sm btn-danger delete_btn_service col-auto hide" 
            value='${JSON.stringify(service)}'>Delete service</button>
              </div>              
            </div>
           
            </div>
            `
}

function get_person_obj(person) {
    return `<div class="col mb-2">
            <div class="card serviced text-center h-100">
            <img class="serviced-img-top" src=${person.profile_picture} alt="profile picture">
              <div class="serviced-body">
                <h2 class="serviced-title">${person.name}</h2>
                <h3 class="serviced-text">${person.title}</h3>
                <h5 class="serviced-text">${person.department}</h5>
                <p class="serviced-text">${person.contact}</p>
                <button class="btn btn-sm btn-danger delete_btn_person col-auto hide" 
            value='${JSON.stringify(person)}'>Delete person</button>
                    <!--INCLUDE POPUP HERE-->
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