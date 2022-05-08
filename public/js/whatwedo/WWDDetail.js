const query_string = window.location.search;
const url_params = new URLSearchParams(query_string);
const id = url_params.get('id');

function get_carousel_item(image, count) {
    //console.log(image)
    return `<div class="carousel-item" id='num${count}'>
                <img class="d-block w-100" src='${image.url}' alt='${image.description}'>
                <div class="carousel-caption d-none d-md-block">
                    <p>${image.description}</p>
                </div>
            </div>`
}

function get_carousel_indic(num) {
    return `<button type='button' data-bs-target="#projCarousel" data-bs-slide-to=${num} aria-label="Slide ${num}" id="indic${num}"></button>`
}

function load_staff(staff) {
    return `<div class=row>
                <div class="col-6">
                    <p>${staff.name}</p>
                </div>
                <div class="col-6">
                    <p>${staff.role}</p>
                </div>
            </div>`
}
function load_proj(proj) {
    // console.log(proj)
    let count = 0;
    for (const img of proj.images) {
        if (img.url !== "") {
            const carouselObj = get_carousel_item(img, count);
            $('#carousel_inner').append(carouselObj);
            const indic = get_carousel_indic(count);
            $('#carousel_indicators').append(indic);
            count += 1;
        }
    }
    $('#num0').addClass('active');
    $('#indic0').addClass('active');

    $('#project_name').text(proj.name);
    $('#project_location').text(proj.location)
    // console.log(proj.description)
    $('#proj_desc').html(proj.description)
    $('.edit').attr('data-l', proj.name)
    $('.delete').attr('data-l', proj.name)
    $('#mainLink').attr('href', proj.report1)

    if (proj.report2 !== "") {
        $('#link2').attr('href', proj.report2)
    }
    else {
        $('#link2').remove()
    }
    if (proj.report3 !== "") {
        $('#link3').attr('href', proj.report3)
    }
    else {
        $('#link3').remove()
    }
    // console.log(partners)
    if (proj.partners[0].url !== "") {
        $('#partner1').attr('src', proj.partners[0].logo)
        $('#partner1_link').attr('href', proj.partners[0].url)
    }
    else {
        $('#partner1_div').remove()
    }
    if (proj.partners[1].url !== "") {
        $('#partner2').attr('src', proj.partners[1].logo)
        $('#partner2_link').attr('href', proj.partners[1].url)
    }
    else {
        $('#partner2_div').remove()
    }
    if (proj.partners[2].url !== "") {
        $('#partner3').attr('src', proj.partners[2].logo)
        $('#partner3_link').attr('href', proj.partners[2].url)
    }
    else {
        $('#partner3_div').remove()
    }
    if (proj.partners[3].url !== "") {
        $('#partner3').attr('src', proj.partners[3].logo)
        $('#partner3_link').attr('href', proj.partners[3].url)
    }
    else {
        $('#partner4_div').remove()
    }
    if (proj.partners[4].url !== "") {
        $('#partner4').attr('src', proj.partners[4].logo)
        $('#partner4_link').attr('href', proj.partners[4].url)
    }
    else {
        $('#partner5_div').remove()
    }

    for (const staff of proj.staff) {
        if (staff.name !== "") {
            console.log(staff)
            const staff_obj = load_staff(staff)
            $('#staffList').append(staff_obj)
        }
    }
}

// function login() {
//     const from = "WWDdetail.html?id=" + id;
//     $.post('/redirectTo', {from: from})
//     $.get('/login')
// }

$('.edit').on('click', function () {
    const proj = $(this).attr('data-l');
    console.log(proj);
    $.post('/set_proj_id', {id: id}).done((data) => {
        if (data.message === "success") {
            location.href = "/edit_proj"
        }
    })
})
$('.delete').on('click', function () {
    // console.log($(this).attr('value'));
    const proj = $(this).attr('data-l');
    console.log(proj)
    $.post('/delete_item', {name: id}).done(
        (data) => {
            location.href = "/whatwedo"
            // console.log(data)
            // if(data.message=== "success") {
            //    // location.href="/whatwedo"
            // }
            // else {
            //    // location.reload();
            // }
        }
    )
})

$(document).ready(() => {
    if(id) {
        $.getJSON('/get_proj_by_id?id=' + id)
            .done((data) => {
                console.log(data)
                if (data.message === "success") {
                    const proj = data.proj;
                    $('.hide').attr('data-l', proj.name)
                    load_proj(proj)
                }
                // $('.edit').on('click', function () {
                //     const proj = $(this).attr('data-l');
                //     console.log(proj);
                //     $.post('/set_proj_id', {id: id}).done((data) => {
                //         if (data.message === "success") {
                //             location.href = "/edit_proj"
                //         }
                //     })
                // })
                // $('.delete').on('click', function () {
                //     // console.log($(this).attr('value'));
                //     const proj = $(this).attr('data-l');
                //     // console.log(proj)
                //     $.post('/delete_item', {name: id}).done(
                //         (data) => {
                //             if(data.message=== "success") {
                //                 location.href="/whatwedo"
                //             }
                //             else {
                //                 location.reload();
                //             }
                //         }
                //     )
                // })
                // $('.hide').on('click', function () {
                //     // console.log($(this).attr('value'));
                //     const proj = $(this).attr('data-l');
                //     $.post('/set_proj_id', {id: proj}).done((data) => {
                //         if (data.message === "success") {
                //             location.href = "/edit_proj"
                //         }
                //     })
                // })
            })
    }
    $.getJSON('/get_current_user').done((data) => {
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
});