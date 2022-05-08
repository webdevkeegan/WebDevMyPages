function get_event(event) {
    return `<div class="col event mb-3" data-l="${event.name}">
                <div class="card border border-danger h-100">
                    <div class="card-body">
                        <div class="bg-image hover-overlay ripple shadow-1-strong rounded" data-mdb-ripple-color="light">
                            <img src=${event.images[0].url} class="w-100" alt="${event.description}" id="${event.name}"/>
                            <a href="event_detail.html?id=${event.name}">
                                <div class="mask" style="background-color: rgba(120, 120, 120, 0.7)"></div>
                            </a>
                        </div>
                        <h3 class="card-title">
                            ${event.name}
                        </h3>
                        <button type="button" class="btn btn-primary edit hide" data-l="${event.name}">Edit</button>
                        <button type="button" class="btn btn-danger delete hide" data-l="${event.name}">Delete</button>
                    </div>
                </div>
            </div>
    `
}

$.getJSON("data/events.json", () => {
    console.log("file loaded");
}).done((data) => {
    for (const event of data) {
        const card = get_event(event);
        $('#events_div').append(card)
    }
    $('.edit').on('click', function () {
        const event = $(this).attr('data-l');
        $.post('/set_event_id', {id: event}).done((data) => {
            if (data.message === "success") {
              location.href = "/edit_event"
            }
        })
    })
    $('.delete').on('click', function () {
        const event = $(this).attr('data-l');
        $.post('/delete_event', {id: event}).done(() => {
            location.reload()
            // if (data.message === "success") {
            //     location.reload()
            // }
        })
    })
})

$('#newEvent').on('click', function () {
    // console.log($(this).attr('value'));
    const proj = $(this).attr('data-l');
    $.post('/set_event_id', {id: proj}).done((data) => {
        if (data.message === "success") {
            location.href = "/edit_event"
        }
    })
})

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