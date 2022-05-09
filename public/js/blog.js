function get_blog_object(blog, idx) {
    return `<li class="list-group-item" data-m="${blog._id}">
                <div class="row ${idx % 2 === 0 ? 'even_row' : 'odd_row'}">
                    <div class="col-lg-3 imgDiv " >
                        <img class="blog_poster" src="${blog.thumbnail}" width="200px">
                    </div>
                    <div class="col-lg-6 infoDiv" >
                        <h2 class="blog_title">${blog.title}</h2>
                    </div>
                    <div class="col-lg-6 infoDiv" >
                        <h2 class="blog_date">${blog.date}</h2>
                    </div>
                    <div class="col-lg-3 d-flex justify-content-end buttonDiv">
                        <input type="checkbox" class="check_box" value="${blog._id}">
                    </div>
                </div>
          </li>`
}

function showList(blogs) {
    $('#blog_list').empty();
    blogs.forEach((blog, idx) => {
        $('#blog_list').append(get_blog_object(blog, idx));
    });

    $('.imgDiv,.infoDiv').on('click', function () { //select image div and and info div so checkbox not affected
        const blog_id = $(this).parents('li').attr('data-m');
        location.href = "blog_blog.html?blog_id=" + blog_id;
    });
}

// showList([{
//     "title": "Minari",
//     "thumbnail": "http://image.tmdb.org/t/p/w342/9Bb6K6HINl3vEKCu8WXEZyHvvpq.jpg",
//     "date": "2021-02-12", "overview": "test blog review"
// }])

$.getJSON("/get_all_blogs")
    .done(function (data) {
        if (data.message === "success") {
            showList(data.data);
        }
    });

function addNewBlog(){
    //front end navigate to page
    location.href="edit_blog.html"; //note that fields are empty since we are adding a new blog, no need to load old info

}

function onDeleteSelected(){
    //select all blog ids
    const blogIDs=[];

    //for each loop jquery
    $.each($("#blog_list input:checked"),function(){//finds all checked checkboxes - doesn't select "select all checkbox"
        const blogID = $(this).attr('value') //this is checkbox
        blogIDs.push(blogID); //add blog to id list
    });
    console.log(blogIDs); //use this to test is list being created correctly
    if(blogIDs){//if list not empty
        $.post('/delete_blog_by_ids',{"_ids":blogIDs}).done(()=>{ // post matches server.js -- make sur eto post the list not the indiv id
            //after post, we want to refresh the page
            location.reload();
        })
    }
}

function onSelectAll(){
    const isChecked=$('#select_all').prop('checked');
    $('#blog_list .check_box').prop("checked",isChecked) //if select all  button is checked, check all check boxes
}

function searchBlog(){ //sends to backend
    $.getJSON("/get_blogs_by_filters",{ //this is get instead of post since it is not supposed to change data, just wants to read
        search_key:$("#search_box").val(),
    }).done((data)=>{
        showList(data.data)
    });
}