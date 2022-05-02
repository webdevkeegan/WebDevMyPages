const express = require("express");
const fs = require('fs');
const app = express();

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static(__dirname + "/public"));


//--------------login stuff---------------------------------------------

const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const passportLocalMongoose = require('passport-local-mongoose');

app.use(express.static(__dirname + "/public"));

//Initialize passport
app.use(session({
    secret: "MyLittleSecretThatIdontWantOthersToKnow",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

//Configure Mongoose - give database name "hurdlDB"
mongoose.connect('mongodb://localhost:27017/hurdlDB', {useNewUrlParser: true, useUnifiedTopology: true});

//create user schema
const userSchema = new mongoose.Schema({
    username: { // must use exact spelling for username so mongoose recognizes its a username
        type: String,
        unique: true,
        require: true,
        minlength: 3
    },
    password: {  //use exact spelling
        type: String,
        require: true
    }
})

userSchema.plugin(passportLocalMongoose);
const User = mongoose.model('User', userSchema);

passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser())
//---------------------------------------------


//--------------get current user route---------------------------------------------

app.get('/get_current_user', function (req, res) {

    //check if user is authenticated yet
    if (req.isAuthenticated()) {
        res.send({
            message: "success",
            data: req.user
        })
    } else {
        res.send({
            message: "user not found",
            data: {}
        })
    }
});
//---------------------------------------------


//--------------get register page---------------------------------------------
// app.get('/register', (req, res) => {
//     if (req.query.error) {
//         res.redirect("/register.html?error=" + req.query.error);
//     } else {
//         //direct to registration page
//         res.redirect("/register.html");
//     }
// }); // returns register page

app.get('/register', (req, res) => {
    if (req.isAuthenticated()) {
        res.sendFile(__dirname + '/src/register.html')
    }
        // if (req.query.error) {
    //     res.redirect("/register.html?error=" + req.query.error);
    else {
        res.redirect("/login");
    }
}); // returns register page


//--------------post to actually register the user---------------------------------------------

// creates a new user. hashes and salts password
app.post('/register', (req, res) => {
    const newUser = {
        username: req.body.username,
    }
    User.register(newUser, req.body.password, (err, user) => { // adds user to database checks if username is unique and stuff
        if (err) {
            //console.log(err);
            res.redirect('/register/?error=' + err); //redirects to the get above, to if req.query.error
        } else {
            //console.log(user);
            const authenticate = passport.authenticate('local')
            authenticate(req, res, () => {
                res.redirect("/")
            })
        }
    })
});
//---------------------------------------------


//--------------get login page---------------------------------------------

app.get('/login', (req, res) => {
    if (req.query.error) {
        res.redirect("/login.html?error=" + req.query.error);
    } else {

        //take them to the login page
        res.redirect("/login.html");
    }
});
//---------------------------------------------


//--------------post to log the user in if they login corerctly---------------------------------------------

app.post('/login', (req, res) => {
    const user = new User({
        username: req.body.username,
        password: req.body.password
    });
    req.login(user, (err) => {
        if (err) {
            res.redirect("/login?error=database error")
        } else {
            const authenticate = passport.authenticate('local', {
                successRedirect: "/",
                failureRedirect: "/login?error=username and password do not match or username does not exist"
            })
            authenticate(req, res);
        }
    })
});
//---------------------------------------------


//--------------get logout page---------------------------------------------

app.get('/logout', (req, res) => {
    req.logout();

    //redirect back to home page
    res.redirect("/");
});
//---------------------------------------------


//---------------repopulate json data files with current values-----------------------------------------
app.listen(3000, function () {
    console.log("server started at 3000")

    //everytime restart server, parse through json list

    //use to edit partners
    const rawDataPartners = fs.readFileSync(__dirname + "/public/data/partnersData.json")
    partnersList = JSON.parse(rawDataPartners);
    console.log(partnersList)

    //use to edit services
    const rawDataServices = fs.readFileSync(__dirname + "/public/data/servicesProvided.json")
    servicesList = JSON.parse(rawDataServices);
    console.log(servicesList)

    //use to edit people
    const rawDatapeople = fs.readFileSync(__dirname + "/public/data/people.json")
    peopleList = JSON.parse(rawDatapeople);
    console.log(peopleList)

    //use to edit aboutUs
    const rawDataAboutUs = fs.readFileSync(__dirname + "/public/data/aboutUs.json")
    aboutUsList = JSON.parse(rawDataAboutUs);
    console.log(peopleList)


});

//---------------edit aboutUs-----------------------------------------

//--------------get methods for editing aboutUs--------------
app.get("/new-aboutUs", (req, res) => {
    // const id = req.query.id;
    // console.log(req.query)
    if (req.isAuthenticated()) {
        // console.log("authenticated")
        //res.sendFile(__dirname + "/src/edit_proj.html?proj=" + id);
        res.sendFile(__dirname + "/src/edit_aboutUs.html");
    } else {
        res.redirect("/login")
    }
    // const past = pastProjects.find(proj => proj.id === id)
})



let aboutUsList = [];
//making the form
app.post('/new-aboutUs', (req, res) => {
    console.log(req.body.text_to_be_added); //prints in terminal

    //make dictionary
    const aboutUsItem = { //note: all transferred as string!
        "description": req.body.text_to_be_added
    }
    aboutUsList = [];
    aboutUsList.push(aboutUsItem) //push new service to list

    //convert to json
    const aboutUsJSON = JSON.stringify(aboutUsList);
    // const appendItem =JSON.stringify(serviceItem);


    //writes json string into file
    fs.writeFile(__dirname + "/public/data/aboutUs.json", aboutUsJSON,
        function (err) {
            //function is waiting for event
            if (err) { //if error occurs, make note
                console.log("JSON writing failed");
            } else {

                res.redirect('/'); //will always go to right location
            }
        });
});
//------------------------------------------------


//---------------Add new service-----------------------------------------

//--------------get methods for editing service--------------
app.get("/new-service", (req, res) => {
    // const id = req.query.id;
    // console.log(req.query)
    if (req.isAuthenticated()) {
        // console.log("authenticated")
        //res.sendFile(__dirname + "/src/edit_proj.html?proj=" + id);
        res.sendFile(__dirname + "/src/edit_who_we_are_services.html");
    } else {
        res.redirect("/login")
    }
    // const past = pastProjects.find(proj => proj.id === id)
})




let servicesList = [];
//making the form
app.post('/new-service', (req, res) => {
    console.log(req.body.service_to_be_added); //prints in terminal

    //make dictionary
    const serviceItem = { //note: all transferred as string!
        "service": req.body.service_to_be_added,
        "description": req.body.description_of_service
    }

    servicesList = servicesList.filter((service) => { //make sure no duplicates, remove old service (overwrites)
        if (service.service === req.body.service_to_be_added) {
            return false;
        } else {
            return true;
        }

    });

    servicesList.push(serviceItem) //push new service to list

    //convert to json
    const serviceJSON = JSON.stringify(servicesList);
    // const appendItem =JSON.stringify(serviceItem);


    //writes json string into file
    fs.writeFile(__dirname + "/public/data/servicesProvided.json", serviceJSON,
        function (err) {
            //function is waiting for event
            if (err) { //if error occurs, make note
                console.log("JSON writing failed");
            } else {

                res.redirect('/who_we_are'); //will always go to right location
            }
        });
});
//------------------------------------------------


//---------------Add new person-----------------------------------------

//--------------get methods for editing person--------------
app.get("/new-person", (req, res) => {
    // const id = req.query.id;
    // console.log(req.query)
    if (req.isAuthenticated()) {
        // console.log("authenticated")
        //res.sendFile(__dirname + "/src/edit_proj.html?proj=" + id);
        res.sendFile(__dirname + "/src/edit_who_we_are_people.html");
    } else {
        res.redirect("/login")
    }
    // const past = pastProjects.find(proj => proj.id === id)
})


let peopleList = [];
//making the form
app.post('/new-person', (req, res) => {
    console.log(req.body.name); //prints in terminal

    //make dictionary
    const peopleItem = { //note: all transferred as string!
        "name": req.body.person_to_be_added,
        "title": req.body.title_to_be_added,
        "department": req.body.department_to_be_added,
        "contact": req.body.contact_to_be_added,
        "profile_picture": req.body.picture_to_be_added,
        "bio": req.body.bio_to_be_added
        //UPDATE THIS
    }

    peopleList = peopleList.filter((service) => { //make sure no duplicates, remove old service (overwrites)
        if (service.service === req.body.person_to_be_added) {
            //UPDATE THIS
            return false;
        } else {
            return true;
        }

    });

    peopleList.push(peopleItem) //push new service to list

    //convert to json
    const peopleJSON = JSON.stringify(peopleList);
    // const appendItem =JSON.stringify(serviceItem);


    //writes json string into file
    fs.writeFile(__dirname + "/public/data/people.json", peopleJSON,
        function (err) {
            //function is waiting for event
            if (err) { //if error occurs, make note
                console.log("JSON writing failed");
            } else {

                res.redirect('/who_we_are'); //will always go to right location
            }
        });
});

//------------------------------------------------

//---------------Add new partner-----------------------------------------

//--------------get methods for editing partner--------------
app.get("/new-partner", (req, res) => {
    // const id = req.query.id;
    // console.log(req.query)
    if (req.isAuthenticated()) {
        // console.log("authenticated")
        //res.sendFile(__dirname + "/src/edit_proj.html?proj=" + id);
        res.sendFile(__dirname + "/src/edit_partners.html");
    } else {
        res.redirect("/login")
    }
    // const past = pastProjects.find(proj => proj.id === id)
})


let partnersList = [];
//making the form
app.post('/new-partner', (req, res) => {
    console.log(req.body.partner_to_be_added); //prints in terminal

    //make dictionary
    const partnerItem = { //note: all transferred as string!
        "name": req.body.partner_to_be_added,
        "link": req.body.partner_url,
        "image": req.body.partner_logo
    }

    partnersList = partnersList.filter((partner) => { //make sure no duplicates, remove old service (overwrites)
        if (partner.link === req.body.partner_url) {
            return false;
        } else {
            return true;
        }

    });

    partnersList.push(partnerItem) //push new service to list

    //convert to json
    const partnersJSON = JSON.stringify(partnersList);
    // const appendItem =JSON.stringify(serviceItem);


    //writes json string into file
    fs.writeFile(__dirname + "/public/data/partnersData.json", partnersJSON,
        function (err) {
            //function is waiting for event
            if (err) { //if error occurs, make note
                console.log("JSON writing failed");
            } else {

                res.redirect('/'); //will always go to right location
            }
        });
});
//------------------------------------------------


//-----------------delete single service-------------------------------

app.post('/delete-service', (req, res) => {

    //how to delete a service from list
    servicesList = servicesList.filter((service) => { //each service in the list, will stay in list if filter(service) returns True
        console.log("GIRLL app.post /delete-service" + service.service);
        console.log("GIRLL app.post /delete-service" + req.body.service);
        if (service.service === req.body.service) {

            return false;
        } else {
            return true;
        }

    });

    const deleteServicesJSON = JSON.stringify(servicesList);

    fs.writeFile(__dirname + "/public/data/servicesProvided.json", deleteServicesJSON,
        function (err) {
            if (err) {
                console.log("File writing error")
                console.log(err);
            } else { //else writing is successful
                res.redirect("/who_we_are") //send back to homepage
            }
        });

});

//------------------------------------------------


//-----------------delete single person-------------------------------

app.post('/delete-person', (req, res) => {

    //how to delete a service from list
    peopleList = peopleList.filter((person) => { //each service in the list, will stay in list if filter(service) returns True
        console.log("GIRLL app.post /delete-person" + person.name);
        console.log("GIRLL app.post /delete-person" + req.body.person);
        if (person.name === req.body.person) {

            return false;
        } else {
            return true;
        }

    });

    const deletePersonJSON = JSON.stringify(peopleList);

    fs.writeFile(__dirname + "/public/data/people.json", deletePersonJSON,
        function (err) {
            if (err) {
                console.log("File writing error")
                console.log(err);
            } else { //else writing is successful
                res.redirect("/who_we_are") //send back to homepage
            }
        });

});

//------------------------------------------------

//-----------------delete single partner-------------------------------

app.post('/delete-partner', (req, res) => {

    //how to delete a service from list
    partnersList = partnersList.filter((partner) => { //each service in the list, will stay in list if filter(service) returns True
        console.log("GIRLL app.post /delete-partner" + partner.link);
        console.log("GIRLL app.post /delete-partner" + req.body.partner);
        if (partner.link === req.body.partner) {

            return false;
        } else {
            return true;
        }

    });

    const deletePartnersJSON = JSON.stringify(partnersList);

    fs.writeFile(__dirname + "/public/data/partnersData.json", deletePartnersJSON,
        function (err) {
            if (err) {
                console.log("File writing error")
                console.log(err);
            } else { //else writing is successful
                res.redirect("/") //send back to homepage
            }
        });

});

//------------------------------------------------


let person_id = ''
app.post("/set_person_id", (req, res) => {
    person_id = req.body.personName;
    // console.log("proj id at set, equals: " + proj_id)
    res.send({message: "success", id: person_id})

})
app.get("/send_person_id", (req, res) => {
        // console.log("proj id at send get equals: " + proj_id)
        res.send({message: "success", id: person_id})
        //console.log(pub_dis_id)

    // const id = req.query.id;
    //
    // const person = peopleList.find(person => person.name === id)
    // console.log(person)
    // if (person !== undefined) {
    //     res.send({
    //         "message": "success",
    //         "person": person
    //     })
    // } else {
    //     res.send({
    //         "message": "error",
    //         "event": {}
    //     })
    // }
})

app.get("/get_person_id", (req, res) => {

    const id = req.query.id;

    const person = peopleList.find(person => person.name === id)
    console.log("in server.js: /get_person_id ")
    console.log(person)
    if (person !== undefined) {
        res.send({
            "message": "success",
            "person": person
        })
    } else {
        res.send({
            "message": "error",
            "person": {}
        })
    }
})

//----------------Get welcome page------------------------------------------

app.get("/", function (req, res) {
    res.sendFile(__dirname + "/public/index_welcome.html");
});

app.get("/who_we_are", function (req, res) {
    res.sendFile(__dirname + "/public/who_we_are.html");
});
//------------






