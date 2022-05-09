function fillblog(blog) {
    $('#title').val(blog.title);
    $('#thumbnail').val(blog.thumbnail);
    $('#date').val(blog.date);
    $('#category').val(blog.category);
    $('#overview').val(blog.overview);
}

function onCancel() {
    if(blog_id){
        //come from detail page
        location.href='/blog_blog.html?blog_id='+blog_id;
    }else{
        //come from homepage
        location.href='/';
    }

}

//same as from blog detail js
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const errorMessage = urlParams.get('error_message'); //load error message
const blog = JSON.parse( urlParams.get('input'));
const blog_id=urlParams.get('blog_id')

$('form').on('submit', function () {
    if ($('#overview').val().length<10){
        $('#error_message').text("Overview must be at least 10 characters");
        return false;
    }
    if(blog_id){ //if blog not null
        $('form').append(()=>{
            const input = $('<input>')
                .attr('name','_id')
                .attr('value',blog_id)
            return input;
        });
        // console.log($('form'));
        // return false
    }
});

//when the user input is rejected, laod the last input
if(errorMessage){
    fillblog(blog);
    $('#error_message').text(errorMessage);

}



//when blog id is not null (updating the existed blog) and there is no error message, query database to load blog from db
if(blog_id && !errorMessage){ //true if not null
    $.getJSON('/get_blog_by_id?blog_id='+blog_id).done((data)=>{
        if(data['message']==='success'){
            console.log(data.data) //from server.js
            fillblog(data.data)
        }
    })     //use this get route to receive json object on detail page

}

