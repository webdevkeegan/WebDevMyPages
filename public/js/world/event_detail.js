function get_carousel_item(image, count) {
    return `<div class="carousel-item" id='num${count}'>
                <img class="d-block w-100" src=${image.url} alt=${image.description}>
                <div class="carousel-caption d-none d-md-block">
                    <p>${image.description}</p>
                </div>
            </div>`
}

function get_carousel_indic(num) {
    return `<button type='button' data-bs-target="#eventCarousel" data-bs-slide-to=${num} aria-label="Slide ${num}" id="indic${num}"></button>`
}


function load_event(event) {
    let count = 0;
    for (const img of event.images) {
        const carouselObj = get_carousel_item(img, count);
        $('#carousel_inner').append(carouselObj);
        const indic = get_carousel_indic(count);
        $('#carousel_indicators').append(indic);
        count += 1;
    }
    $('#num0').addClass('active');
    $('#indic0').addClass('active');

    $('#event_name').text(event.name);
    // $('#project_location').text(proj.location)
    // console.log(proj.description)
    $('#event_desc').html(event.description);
    $('#event_date').text(event.date);

}

$(document).ready(() => {
    const query_string = window.location.search;
    const url_params = new URLSearchParams(query_string);
    const id = url_params.get('id');
    if(id) {
        $.getJSON('/get_event_by_id?id=' + id)
            .done((data) => {
                console.log(data)
                if (data.message === "success") {
                    const event = data.event;
                    load_event(event)
                }
            })
    }
    $.getJSON('/get_current_user').done((data) => {
        console.log(data.message)
        if (data.message === 'success') {
            $('#login').remove()
        }
        else {
            // $('#logout').remove();
            $('.hide').each(function() {
                $(this).remove();
            })
        }
    })
});