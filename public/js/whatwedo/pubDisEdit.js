$('form').on('submit', function () {
    let errorMessage = null
    $.each($('input,textarea'), function () {
        if (!$(this).val()) {
                errorMessage = `${$(this).parent().find('label').text()} cannot be empty`;
                return false
        }
    });
    if (errorMessage !== null) {
        $('#error_message').text(errorMessage);
        return false;
    }
    // $.post('/set_proj_id', {id: ''})
});


function load_proj(proj) {
    $('#newOnly').remove()
    $('#citation').text(proj.citation);
    $('#url').val(proj.url)
    $('#pubdis').val(proj.pub_dis)
}

// const query_string = window.location.search;
// const url_params = new URLSearchParams(query_string);
// const id = url_params.get('id');
let id = ''

$(document).ready(() => {
    console.log(id)
    $.get('/send_pub_dis').done((data) => {
        id = data.id
        console.log(data)
        if(id !== "") {
            $.getJSON('/get_pubdis_by_id?id=' + id)
                .done((data) => {
                    console.log(data)
                    if (data.message === "success") {
                        const proj = data.proj;
                        console.log(proj)
                        load_proj(proj)
                    }
                })
        }
    })
});


function onDelete() {
    $.post('/delete_pubdis', {name: id}).done(
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



