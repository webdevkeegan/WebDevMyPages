let blog = {
    "title": "Blog title",
    "thumbnail": "img/placeholder.jpg",
    "date": "2021-01-01",
    "category": "Category",
    "overview": "blog overview"
}

function load_blog(blog) {
    $('#title').text(blog.title);
    $('#date').text(blog.date);
    $('#overview').text(blog.overview);
    $('#category').text(blog.category);
    $('#thumbnail').attr('src', blog.thumbnail);
}
// load_blog(blog);


//basically creates this: http://localhost:3000/blog_detail.html?blog_id=62445e242ef39718e6e47bc8
//essentially adds blog_id parameter to url
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const blog_id = urlParams.get('blog_id'); //load blog id
console.log(blog_id);


$(document).ready(function () {
    if (blog_id) { //if downloaded correctly, success
        $.getJSON('/get_blog_by_id?blog_id=' + blog_id)
            .done(function (data) {
                if (data["message"] === "success") {
                    blog = data["data"];
                    load_blog(blog);
                }
            });
    }
});

function onEdit() {
    location.href = "/edit_blog.html?blog_id="+blog_id;
}

//create new blog doesn't have id parameter (so to check if editing, check if this paramter is null)

function onDelete(){
    //post only changes db backend
    $.post('/delete_blog_by_id',{_id:blog_id}).done( //so need to use done
        (data)=>{ //data here is object with message
            //need to give callback
            if(data.message==="success"){
             //want to navaigate back to home page
                location.href='/blog.html'
            }
            else{
                //handling database error
            }
        }
    )



}