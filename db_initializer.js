const mongoose = require('mongoose');

const fs = require('fs');
const rawdata = fs.readFileSync(__dirname + "/data.json");
const jsonList = JSON.parse(rawdata);

// console.log(jsonList);

mongoose.connect('mongodb://localhost:27017/hurdlDB',
    {useNewUrlParser: true}, function () {
        console.log("db connection successful");
    });

const blogSchema = {
    title: String,
    thumbnail: String,
    date: String,
    category: String,
    overview: String
}

const Blog = mongoose.model('Blog', blogSchema);

const blogList = []

jsonList.forEach(function (blog) {
    blogList.push({
        "title": blog["title"],
        "thumbnail": "http://image.tmdb.org/t/p/w342" + blog["thumbnail"],
        "date": blog["date"],
        "category": blog["category"],
        "overview": blog["overview"]
    })
});

Blog.insertMany(blogList, {}, function (err) {
    if (err) {
        console.log(err);
    } else {
        console.log("all data saved");
        mongoose.connection.close();
    }
});