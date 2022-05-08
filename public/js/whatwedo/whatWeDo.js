$('#carousel_indicators').empty();
$('#carousel_inner').empty();
$('#pastProjList').empty();

function get_carousel_item(proj, count) {
    return `<div class="carousel-item border border-danger border-2 red_border round" data-l="${proj.location}" id='num${count}'>
                    <div class="bg-image hover-overlay ripple shadow-1-strong round" data-mdb-ripple-color="light">
                            <img src=${proj.images[0].url} class="w-100 round" alt="${proj.images[0].description}" id="${proj.name}"/>
                            <a href="WWDdetail.html?id=${proj.name}">
                                <div class="mask" style="background-color: rgba(120, 120, 120, 0.7)"></div>
                            </a>
                        </div>
                <div class="carousel-caption d-none d-md-block">
                    <h5 class="grey_out m-3 p-1">${proj.name}</h5>
                    <button type="button" class="btn btn-primary proj hide" data-l="${proj.name}">Edit</button>
                    <button type="button" class="btn btn-danger projDelete hide" data-l="${proj.name}">Delete</button>
                </div>
            </div>`
}

function get_carousel_indic(num) {
    return `<button type='button' data-bs-target="#projCarousel" data-bs-slide-to=${num} aria-label="Slide ${num}" id="indic${num}"></button>`
}

function get_past_proj(proj) {
    return `<div class="col pastProj mb-3 h-100" data-l="${proj.location}" data-d="${proj.description}">
                <div class="card border border-danger red_border bg-image hover-overlay ripple">
<!--                     <div class="bg-image ">-->
                             <img src=${proj.images[0].url} class="card-img w-100" alt="${proj.images[0].description}" id="${proj.name}"/>
                        
<!--                         </div>-->
                    <div class="card-img-overlay text-center d-flex align-items-end justify-content-center">
                        <h3 class="card-title pastProjName grey_out m-3 p-1">
                            ${proj.name}
                        </h3>
                       
                    </div>

                     <a href="WWDdetail.html?id=${proj.name}">
                          <div class="mask" style="background-color: rgba(120, 120, 120, 0.7)">
                          <div class="card-img-overlay text-center d-flex align-items-end justify-content-center">
                        <h3 class="card-title pastProjName grey_out m-3 p-1">
                            ${proj.name}
                        </h3>
                       
                    </div>
                    
</div>
                     </a>
                     
                </div>
<button type="button" class="btn btn-primary btn-sm proj hide" data-l="${proj.name}">Edit</button>
                        <button type="button" class="btn btn-danger btn-sm projDelete hide" data-l="${proj.name}">Delete</button>
            </div>
    `
}

function get_pub_dis(item) {
    return `<section class="pub_dis_sect mt-2" data-x="${item.citation}">
                <div class="row pub_dis align-items-center mb-2" data-x="${item.citation}">
                <div class="col-lg-9 col-sm-12">
                    <p>${item.citation}</p>
                </div>
                <div class="col-lg-3 col-sm-3">
                    <a class="btn btn-outline-danger" href="${item.url}">Link</a>
                    <button type="button" class="btn btn-primary cit hide" data-l="${item.citation}">Edit</button>
                    <button type="button" class="btn btn-danger citDelete hide" data-l="${item.citation}">Delete</button>
                </div>
            </div>
            <hr class="pub_dis_line">
        </section>`
}

let curProjList = []
$.getJSON("data/currentProj2.json", () => {
    console.log("file loaded");
}).done((data) => {
    let count = 0;
    for (const proj of data) {
        curProjList.push(proj)
        const carouselObj = get_carousel_item(proj, count);
        $('#carousel_inner').append(carouselObj);
        const indic = get_carousel_indic(count);
        $('#carousel_indicators').append(indic);
        count += 1;
    }
    $('#num0').addClass('active')
    $('#indic0').addClass('active')
})

$.getJSON("data/pastProj.json", () => {
    console.log("past projects loaded")
}).done((data) => {
    for (const proj of data) {
        const card = get_past_proj(proj);
        $('#pastProjList').append(card)
    }
    // $('img').on('click', function () {
    //     // console.log($(this).attr('value'));
    //     const proj = $(this).attr('id');
    //     console.log(proj)
    //     location.href = "WWDdetail.html?id=" + proj;
    // })
    $('.proj').on('click', function () {
        // console.log($(this).attr('value'));
        const proj = $(this).attr('data-l');
        $.post('/set_proj_id', {id: proj}).done((data) => {
            if (data.message === "success") {
                location.href = "/edit_proj"
            }
        })
    })
    $('.projDelete').on('click', function () {
        // console.log($(this).attr('value'));
        const proj = $(this).attr('data-l');
        console.log(proj)
        $.post('/delete_item', {name: proj}).done(
            (data) => {
                console.log(data)
                if(data.message=== "success") {
                    location.href="/whatwedo"
                }
                else {
                    location.reload();
                }
            }
        )
    })
})



$('#newProj').on('click', function () {
    // console.log($(this).attr('value'));
    const proj = $(this).attr('data-l');
    $.post('/set_proj_id', {id: proj}).done((data) => {
        if (data.message === "success") {
            location.href = "/edit_proj"
        }
    })
})

$('#newCit').on('click', function () {
    // console.log($(this).attr('value'));
    const proj = $(this).attr('data-l');
    $.post('/set_pub_dis_cit', {id: proj}).done((data) => {
        if (data.message === "success") {
            location.href = "/edit_pub_dis"
        }
    })
})


$.getJSON("data/pubs.json", () => {
    console.log("publications loaded")
}).done((data) => {
    for (const pub of data) {
        const item = get_pub_dis(pub);
        $('#publicationList').append(item)
    }
    $('.cit').on('click', function () {
        // console.log($(this).attr('value'));
        const proj = $(this).attr('data-l');
        // console.log(proj)
        $.post('/set_pub_dis_cit', {id: proj}).done((data) => {
            if (data.message === "success") {
                location.href = "/edit_pub_dis"
            }
        })
    })
})

$.getJSON("data/dissertations.json", () => {
    console.log("dissertations loaded")
}).done((data) => {
    for (const dis of data) {
        const item = get_pub_dis(dis);
        $('#dissertationList').append(item)
    }
    $('.cit').on('click', function () {
        // console.log($(this).attr('value'));
        const proj = $(this).attr('data-l');
        console.log(proj)
        $.post('/set_pub_dis_cit', {id: proj}).done((data) => {
            if (data.message === "success") {
                location.href = "/edit_pub_dis"
            }
        })
    })

    $('.citDelete').on('click', function () {
        // console.log($(this).attr('value'));
        const proj = $(this).attr('data-l');
        $.post('/delete_pubdis', {id: proj}).done(
            (data) => {
                if(data.message=== "success") {
                    location.href="/whatwedo"
                }
                else {
                    location.reload();
                }
            }
        )
    })
})

function search_projs() {
    $('#carousel_indicators').empty();
    $('#carousel_inner').empty();
    const currentSearch = $('#search_proj').val().toLowerCase();
    $.each($('.pastProj'), function () {
        const name = $(this).find('.card-title').text().toLowerCase();
        const location = $(this).attr('data-l').toLowerCase();
        const description = $(this).attr('data-d').toLowerCase();
        const hasWord = name.includes(currentSearch) || location.includes(currentSearch) || description.includes(currentSearch);
        if (hasWord) {
            $(this).show(500)
        } else {
            $(this).slideUp(500)
        }
    })
    let count = 0;
    for (const proj of curProjList) {
        const name = proj.name.toLowerCase();
        //console.log(name)
        const location = proj.location.toLowerCase();
        //console.log(location)
        const description = proj.description.toLowerCase();
        const hasWord = name.includes(currentSearch) || location.includes(currentSearch) || description.includes(currentSearch);
        console.log(hasWord)
        if (hasWord) {
            const carouselObj = get_carousel_item(proj, count);
            console.log(carouselObj)
            $('#carousel_inner').append(carouselObj);
            const indic = get_carousel_indic(count);
            $('#carousel_indicators').append(indic);
            console.log(indic)
            count += 1;
        }
    }
    $('#num0').addClass('active')
    $('#indic0').addClass('active')
    $.getJSON('/get_current_user').done((data) => {
        console.log(data.message)
        if (data.message === 'success') {
            $('#login').remove()
            $('.pastProjName').addClass('smallerText')
        }
        else {
            $('#logout').remove();
            $('.hide').each(function() {
                $(this).remove();
            })
        }
    })
}

function searchCit() {
    console.log("search citations and publications")
    const currentSearch = $('#search_pub').val().toLowerCase();
    $.each($('.pub_dis_sect'), function () {
        const contain = $(this).attr('data-x').toLowerCase();
        console.log(contain)
        const hasWord = contain.includes(currentSearch);
        if (hasWord) {
            $(this).show(500)
        } else {
            $(this).slideUp(500)
        }
    })
}

$('#curProjJump').on('click', function () {
    const section = $(this).attr('data-l');
    // console.log(section)
    const scrollTo = document.getElementById(section)
    // console.log(scrollTo)
    scrollTo.scrollIntoView();
})

$('#pastProjJump').on('click', function () {
    const section = $(this).attr('data-l');
    // console.log(section)
    const scrollTo = document.getElementById(section)
    // console.log(scrollTo)
    scrollTo.scrollIntoView();
})
$('#pubsDisProjJump').on('click', function () {
    const section = $(this).attr('data-l');
    // console.log(section)
    const scrollTo = document.getElementById(section)
    // console.log(scrollTo)
    scrollTo.scrollIntoView();
})

$(document).ready(() => {
    $.getJSON('/get_current_user').done((data) => {
        console.log(data.message)
        if (data.message === 'success') {
            $('#login').remove()
            $('.pastProjName').addClass('smallerText')
        }
        else {
            $('#logout').remove();
            $('.hide').each(function() {
                $(this).remove();
            })
        }
    })
})

