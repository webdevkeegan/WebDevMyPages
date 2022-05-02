$('form').on('submit', function () {
    let errorMessage = null
    // console.log("help")
    $.each($('input,textarea'), function () {
        if (!$(this).val()) {
            console.log($(this))
            console.log($(this).attr('class'))
            console.log($(this).attr('class').includes('required'))
            if ($(this).attr('class').includes('required')|| $(this).parent().find('label') === 'image_url_1' || $(this).parent().find('label') === 'image_desc_1') {
                errorMessage = `${$(this).parent().find('label').text()} cannot be empty`;
                return false
            }
        }
    });
    if (errorMessage !== null) {
        $('#error_message').text(errorMessage);
        return false;
    }
    // $.post('/set_proj_id', {id: ''})
});

function getImageDiv(count) {
    return `<div class="col-sm-12 col-md-6 col-lg-6">
                <div class="mb-3">
                    <label for="image_url_${count}" class="form-label">Image url/src ${count}</label>
                    <input class="form-control" type="text" name="image_url_${count}" id="image_url_${count}">
                </div>
            </div>
            <div class="col-sm-12 col-md-6 col-lg-6">
                   <div class="mb-3">
                        <label for="image_desc_${count}" class="form-label">Image desc ${count}</label>
                        <textarea class="form-control" name="image_desc_${count}" id="image_desc_${count}"></textarea>
                   </div>
                </div>`
}

function getStaffDiv(count) {
    return `<div class="col-sm-12 col-md-6 col-lg-6">
                <div class="mb-3">
                    <label for="staff_name_${count}" class="form-label">Staff Name ${count}</label>
                    <input class="form-control" type="text" name="staff_name_${count}" id="staff_name_${count}">
                </div>
            </div>
            <div class="col-sm-12 col-md-6 col-lg-6">
                <div class="mb-3">
                    <label for="staff_role_${count}" class="form-label">Staff Role ${count}</label>
                    <input class="form-control" type="text" name="staff_role_${count}" id="staff_role_${count}">
                </div>
            </div>`
}

function getPartnerDiv(count) {
    return `<div class="col-sm-12 col-lg-6">
                <div class="mb-3">
                    <label for="partner_img_${count}" class="form-label">Partner ${count} image source</label>
                    <input class="form-control" type="text" name="partner_img_${count}" id="partner_img_${count}">
                </div>
            </div>
            <div class="col-sm-12 col-lg-6">
                <div class="mb-3">
                    <label for="partner_url_${count}" class="form-label">Partner ${count} url</label>
                    <input class="form-control" type="text" name="partner_url_${count}" id="partner_url_${count}">
                </div>
            </div>`
}

function load_form(count) {
    //console.log(getImageDiv(count))
    $('#image_div').append(getImageDiv(count))
    if (count <= 3) {
        $('#partner_div').append(getPartnerDiv(count))
        $('#staff_div').append(getStaffDiv(count))
    }
    else if (count <= 8) {
        $('#staff_div').append(getStaffDiv(count))
    }


}

function load_proj(proj) {
    $('#newOnly').remove();
    $('#name').text(proj.name);
    $('#location').val(proj.location);
    $('#description').val(proj.description);
    $('#cur').val(proj.cur)
    $('#main_link').val(proj.report);
    $('#link2').val(proj.report2);
    $('#link3').val(proj.report3);
    let count = 1
    for (const image of proj.images) {
        if (image.url !== "") {
            let getImageDesc = '#image_desc_' + count.toString()
            let getImageUrl = '#image_url_' + count.toString()
            $(getImageDesc).val(image.description)
            $(getImageUrl).val(image.url)
            count += 1
        }
    }
    count = 1
    for (const staff of proj.staff) {
        if (staff.name !== "") {
            let getStaffName = '#staff_name_' + count.toString()
            let getStaffRole = '#staff_role_' + count.toString()
            $(getStaffName).val(staff.name)
            $(getStaffRole).val(staff.role)
            count += 1
        }
    }
    count = 1
    for (const partner of proj.partners) {
        if (partner.url !== "") {
            let partnerURL = '#partner_url' + count.toString()
            $(partnerURL).val(partner.url)
            let partnerIMG = '#partner_img' + count.toString()
            $(partnerIMG).val(partner.logo)
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
    $.get('/send_proj_id').done((data) => {
        id = data.id
        //console.log(id)
        if(id !== "") {
            $.getJSON('/get_proj_by_id?id=' + id)
                .done((data) => {
                    //console.log(data)
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



