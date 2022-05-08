$('form').on('submit', function () {
    let errorMessage = null
    $.each($('input,textarea'), function () {
        if (!$(this).val()) {
            if ($(this).parent().find('label') === 'description' || $(this).parent().find('label') === 'name' || $(this).parent().find('label') === 'date'|| $(this).parent().find('label') === 'image_url_1') {
                errorMessage = `${$(this).parent().find('label').text()} cannot be empty`;
                return false
            }
        }
    });
    if (errorMessage !== null) {
        $('#error_message').text(errorMessage);
        return false;
    }
    // $.post('/set_event_id', {id: ''})
});

function getImageDiv(count) {
    return `<div class="col-sm-12 col-md-6 col-lg-6">
                <div class="mb-3">
                    <label for="image_url_${count}" class="form-label">Image Source ${count}</label>
                    <input class="form-control" type="text" name="image_url_${count}" id="image_url_${count}">
                </div>
            </div>
            <div class="col-sm-12 col-md-6 col-lg-6">
                   <div class="mb-3">
                        <label for="image_desc_${count}" class="form-label">Image Description ${count}</label>
                        <textarea class="form-control" name="image_desc_${count}" id="image_desc_${count}"></textarea>
                   </div>
                </div>`
}

function load_form(count) {
    //console.log(getImageDiv(count))
    $('#image_div').append(getImageDiv(count))
}

function load_event(event) {
    $('#newOnly').remove();
    $('#name').text(event.name);
    $('#description').val(event.description);
    $('#date').val(event.date)
    let count = 1
    for (const image of event.images) {
        if (image.url !== "") {
            let getImageDesc = '#image_desc_' + count.toString()
            let getImageUrl = '#image_url_' + count.toString()
            $(getImageDesc).val(image.description)
            $(getImageUrl).val(image.url)
            count += 1
        }
    }
}

let id = ''

$(document).ready(() => {
    for (const x of Array(10).keys()) {
        //console.log(x)
        load_form(x + 1)
    }
    $.get('/send_event_id').done((data) => {
        id = data.id
        console.log(id)
        if(id !== "") {
            $.getJSON('/get_event_by_id?id=' + id)
                .done((data) => {
                    console.log(data)
                    if (data.message === "success") {
                        const event = data.event;
                        console.log(event)
                        load_event(event)
                    }
                })
        }
    })
});


function onDelete() {
    $.post('/delete_item', {name: id}).done(
        (data) => {
            if(data.message=== "success") {
                location.href="/whatwedo"
            }
            else {
                location.reload();
            }
        }
    )
}



