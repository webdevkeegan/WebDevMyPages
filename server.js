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

const uri = process.env.MONGODB_URI;

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

//below is alana's lists
let pastProjects = [];
let curProjects = [];
let events = [];
let pubs = [];
let dists = [];


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

    ///////**************ALANA SERVER********************************/////

// initializing data

    console.log("Alana - server started at 3000")
    const rawData = fs.readFileSync(__dirname + "/public/data/currentProj2.json");
    curProjects = JSON.parse(rawData);
    const rawDataPast = fs.readFileSync(__dirname + "/public/data/pastProj.json");
    pastProjects = JSON.parse(rawDataPast);
    const rawEvents = fs.readFileSync(__dirname + "/public/data/events.json")
    events = JSON.parse(rawEvents)
    const rawPubs = fs.readFileSync(__dirname + "/public/data/pubs.json")
    pubs = JSON.parse(rawPubs)
    const rawDists = fs.readFileSync(__dirname + "/public/data/dissertations.json")
    dists = JSON.parse(rawDists)
    // console.log(pubs)

//--------------************end of alana listen stuff**************-----------------


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

    peopleList = peopleList.filter((person) => { //make sure no duplicates, remove old service (overwrites)
        if (person.name === req.body.person_to_be_added) {
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

//--------------EDIT PERSON - pre-fill form----------------------------------

let person_id = ''
app.post("/set_person_id", (req, res) => {
    person_id = req.body.personName;
    // console.log("proj id at set, equals: " + proj_id)
    res.send({message: "success", id: person_id})

})
app.get("/send_person_id", (req, res) => {
        // console.log("proj id at send get equals: " + proj_id)
        res.send({message: "success", id: person_id})

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
//------------------------------------------------

//--------------EDIT service - pre-fill form----------------------------------

let service_id = ''
app.post("/set_service_id", (req, res) => {
    service_id = req.body.serviceName;
    // console.log("proj id at set, equals: " + proj_id)
    res.send({message: "success", id: service_id})

})
app.get("/send_service_id", (req, res) => {
    res.send({message: "success", id: service_id})

})

app.get("/get_service_id", (req, res) => {

    const id = req.query.id;

    const service = servicesList.find(service => service.service === id)
    console.log("in server.js: /get_service_id ")
    console.log(service)
    if (service !== undefined) {
        res.send({
            "message": "success",
            "service": service
        })
    } else {
        res.send({
            "message": "error",
            "service": {}
        })
    }
})
//------------------------------------------------


//--------------EDIT partner - pre-fill form----------------------------------

let partner_id = ''
app.post("/set_partner_id", (req, res) => {
    partner_id = req.body.partnerName;
    // console.log("proj id at set, equals: " + proj_id)
    res.send({message: "success", id: partner_id})

})
app.get("/send_partner_id", (req, res) => {
    // console.log("proj id at send get equals: " + proj_id)
    res.send({message: "success", id: partner_id})

})

app.get("/get_partner_id", (req, res) => {

    const id = req.query.id;

    const partner = partnersList.find(partner => partner.link === id)
    console.log("in server.js: /get_partner_id ")
    console.log(partner)
    if (partner !== undefined) {
        res.send({
            "message": "success",
            "partner": partner
        })
    } else {
        res.send({
            "message": "error",
            "partner": {}
        })
    }
})
//------------------------------------------------



//----------------Get welcome page------------------------------------------

app.get("/", function (req, res) {
    res.sendFile(__dirname + "/public/index_welcome.html");
});

app.get("/who_we_are", function (req, res) {
    res.sendFile(__dirname + "/public/who_we_are.html");
});
//------------

///////**************ALANA********************************/////

// what we do
// projects
app.get('/get_proj_by_id', function (req, res) {
    const id = req.query.id;

    const past = pastProjects.find(proj => proj.name === id)
    const cur = curProjects.find(proj => proj.name === id)
    if (cur !== undefined) {
        res.send({
            "message": "success",
            "proj": cur
        })
    } else if (past !== undefined) {
        res.send({
            "message": "success",
            "proj": past
        })
    } else {
        res.send({
            "message": "error",
            "proj": {}
        })
    }
})
app.post("/edit_proj", (req, res) => {
    let name = ''
    if (req.body.nameForm) {
        name = req.body.nameForm;
        console.log(req.body)
        proj_id = name;
    } else {
        name = proj_id
    }
    console.log(req.body)
    const projItem = {
        name: name,
        description: req.body.description,
        location: req.body.location,
        cur: req.body.cur,
        images: [
            {"url": req.body.image_url_1, "description": req.body.image_desc_1},
            {"url": req.body.image_url_2, "description": req.body.image_desc_2},
            {"url": req.body.image_url_3, "description": req.body.image_desc_3},
            {"url": req.body.image_url_4, "description": req.body.image_desc_4},
            {"url": req.body.image_url_5, "description": req.body.image_desc_5},
            {"url": req.body.image_url_6, "description": req.body.image_desc_6},
            {"url": req.body.image_url_7, "description": req.body.image_desc_7},
            {"url": req.body.image_url_8, "description": req.body.image_desc_8},
            {"url": req.body.image_url_9, "description": req.body.image_desc_9},
            {"url": req.body.image_url_10, "description": req.body.image_desc_10}
        ],
        report1: req.body.main_link,
        report2: req.body.link2,
        report3: req.body.link3,
        staff: [
            {"name": req.body.staff_name_1, "role": req.body.staff_role_1},
            {"name": req.body.staff_name_2, "role": req.body.staff_role_2},
            {"name": req.body.staff_name_3, "role": req.body.staff_role_3},
            {"name": req.body.staff_name_4, "role": req.body.staff_role_4},
            {"name": req.body.staff_name_5, "role": req.body.staff_role_5},
            {"name": req.body.staff_name_6, "role": req.body.staff_role_6},
            {"name": req.body.staff_name_7, "role": req.body.staff_role_7},
            {"name": req.body.staff_name_8, "role": req.body.staff_role_8},
        ],
        partners: [
            {"url": req.body.partner_url_1, "logo": req.body.partner_img_1},
            {"url": req.body.partner_url_2, "logo": req.body.partner_img_2},
            {"url": req.body.partner_url_3, "logo": req.body.partner_img_3},
            {"url": req.body.partner_url_4, "logo": req.body.partner_img_4},
            {"url": req.body.partner_url_5, "logo": req.body.partner_img_5},
        ]
        // partners: [
        //     {"url": req.body.part}
        // ]
    }
    const cur = req.body.cur
    console.log(projItem)
    const inCur = curProjects.find(proj => proj.name === name)
    if (cur === "past" && inCur) {
        curProjects = curProjects.filter((proj) => {
            if (proj.name === projItem.name) {
                return false; // to delete
            } else {
                return true; // to keep
            }
        });
        pastProjects.push(projItem);
        const projJSON = JSON.stringify(pastProjects)
        const curProjJSON = JSON.stringify(curProjects)
        fs.writeFile(__dirname + "/public/data/currentProj2.json", curProjJSON, function(err) {
            if (err) {
                res.redirect('/edit_proj')
            }
            else {
                fs.writeFile(__dirname + "/public/data/pastProj.json", projJSON,
                    function (err) {
                        if (err) {
                            res.redirect('/edit_proj');
                        } else {
                            res.redirect('WWDdetail.html?id=' + proj_id);
                        }
                    })
            }
        });
    }
    else if (cur === "current") {
        // const past = pastProjects.find(proj => proj.name === req.body.name)
        const num = curProjects.findIndex(proj => proj.name === name)
        // curProjects.findIndex(num)
        curProjects = curProjects.filter((proj) => {
            if (proj.name === projItem.name) {
                return false; // to delete
            } else {
                return true; // to keep
            }
        });
        curProjects.splice(num, 0, projItem)
        // curProjects.push(projItem);
        const projJSON = JSON.stringify(curProjects)
        fs.writeFile(__dirname + "/public/data/currentProj2.json", projJSON,
            function (err) {
                if (err) {
                    res.redirect('/edit_proj')
                } else {
                    res.redirect('WWDdetail.html?id=' + proj_id);
                }
            })
    } else {
        const num = pastProjects.findIndex(proj => proj.name === name)
        pastProjects = pastProjects.filter((proj) => {
            if (proj.name === projItem.name) {
                return false; // to delete
            } else {
                return true; // to keep
            }
        });
        // pastProjects.push(projItem);
        pastProjects.splice(num, 0, projItem)
        console.log(num)
        // console.log(pastProjects)
        const projJSON = JSON.stringify(pastProjects)
        console.log(proj_id)
        fs.writeFile(__dirname + "/public/data/pastProj.json", projJSON,
            function (err) {
                if (err) {
                    res.redirect('/edit_proj');
                } else {
                    res.redirect('WWDdetail.html?id=' + proj_id);
                }
            })
    }
});
//commented out may 9, 11:30
// app.post("/edit_proj", (req, res) => {
//     let name = ''
//     if (req.body.nameForm) {
//         name = req.body.nameForm;
//         console.log(req.body)
//         proj_id = name;
//     } else {
//         name = proj_id
//     }
//     // console.log(req.body)
//     const projItem = {
//         name: name,
//         description: req.body.description,
//         location: req.body.location,
//         cur: req.body.cur,
//         images: [
//             {"url": req.body.image_url_1, "description": req.body.image_desc_1},
//             {"url": req.body.image_url_2, "description": req.body.image_desc_2},
//             {"url": req.body.image_url_3, "description": req.body.image_desc_3},
//             {"url": req.body.image_url_4, "description": req.body.image_desc_4},
//             {"url": req.body.image_url_5, "description": req.body.image_desc_5},
//             {"url": req.body.image_url_6, "description": req.body.image_desc_6},
//             {"url": req.body.image_url_7, "description": req.body.image_desc_7},
//             {"url": req.body.image_url_8, "description": req.body.image_desc_8},
//             {"url": req.body.image_url_9, "description": req.body.image_desc_9},
//             {"url": req.body.image_url_10, "description": req.body.image_desc_10}
//         ],
//         report1: req.body.main_link,
//         report2: req.body.link2,
//         report3: req.body.link3,
//         staff: [
//             {"name": req.body.staff_name_1, "role": req.body.staff_role_1},
//             {"name": req.body.staff_name_2, "role": req.body.staff_role_2},
//             {"name": req.body.staff_name_3, "role": req.body.staff_role_3},
//             {"name": req.body.staff_name_4, "role": req.body.staff_role_4},
//             {"name": req.body.staff_name_5, "role": req.body.staff_role_5},
//             {"name": req.body.staff_name_6, "role": req.body.staff_role_6},
//             {"name": req.body.staff_name_7, "role": req.body.staff_role_7},
//             {"name": req.body.staff_name_8, "role": req.body.staff_role_8},
//         ],
//         partners: [
//             {"url": req.body.partner_url_1, "logo": req.body.partner_img_1},
//             {"url": req.body.partner_url_2, "logo": req.body.partner_img_2},
//             {"url": req.body.partner_url_3, "logo": req.body.partner_img_3},
//         ]
//         // partners: [
//         //     {"url": req.body.part}
//         // ]
//     }
//     const cur = req.body.cur
//     console.log(projItem)
//     const inCur = curProjects.find(proj => proj.name === name)
//     if (cur === "past" && inCur) {
//         curProjects = curProjects.filter((proj) => {
//             if (proj.name === projItem.name) {
//                 return false; // to delete
//             } else {
//                 return true; // to keep
//             }
//         });
//         pastProjects.push(projItem);
//         const projJSON = JSON.stringify(pastProjects)
//         const curProjJSON = JSON.stringify(curProjects)
//         fs.writeFile(__dirname + "/public/data/currentProj2.json", curProjJSON, function(err) {
//             if (err) {
//                 res.redirect('/edit_proj')
//             }
//             else {
//                 fs.writeFile(__dirname + "/public/data/pastProj.json", projJSON,
//                     function (err) {
//                         if (err) {
//                             res.redirect('/edit_proj');
//                         } else {
//                             res.redirect('WWDdetail.html?id=' + proj_id);
//                         }
//                     })
//             }
//         });
//     }
//     else if (cur === "current") {
//         // const past = pastProjects.find(proj => proj.name === req.body.name)
//         const num = curProjects.findIndex(proj => proj.name === name)
//         // curProjects.findIndex(num)
//         curProjects = curProjects.filter((proj) => {
//             if (proj.name === projItem.name) {
//                 return false; // to delete
//             } else {
//                 return true; // to keep
//             }
//         });
//         curProjects.splice(num, 0, projItem)
//         // curProjects.push(projItem);
//         const projJSON = JSON.stringify(curProjects)
//         fs.writeFile(__dirname + "/public/data/currentProj2.json", projJSON,
//             function (err) {
//                 if (err) {
//                     res.redirect('/edit_proj')
//                 } else {
//                     res.redirect('WWDdetail.html?id=' + proj_id);
//                 }
//             })
//     } else {
//         const num = pastProjects.findIndex(proj => proj.name === name)
//         pastProjects = pastProjects.filter((proj) => {
//             if (proj.name === projItem.name) {
//                 return false; // to delete
//             } else {
//                 return true; // to keep
//             }
//         });
//         // pastProjects.push(projItem);
//         pastProjects.splice(num, 0, projItem)
//         console.log(num)
//         // console.log(pastProjects)
//         const projJSON = JSON.stringify(pastProjects)
//         console.log(proj_id)
//         fs.writeFile(__dirname + "/public/data/pastProj.json", projJSON,
//             function (err) {
//                 if (err) {
//                     res.redirect('/edit_proj');
//                 } else {
//                     res.redirect('WWDdetail.html?id=' + proj_id);
//                 }
//             })
//     }
// });
// app.post("/edit_proj", (req, res) => {
//     let name = ''
//     if (req.body.nameForm) {
//         name = req.body.nameForm;
//         console.log(req.body)
//         proj_id = name;
//     } else {
//         name = proj_id
//     }
//     // console.log(req.body)
//     const projItem = {
//         name: name,
//         description: req.body.description,
//         location: req.body.location,
//         cur: req.body.cur,
//         images: [
//             {"url": req.body.image_url_1, "description": req.body.image_desc_1},
//             {"url": req.body.image_url_2, "description": req.body.image_desc_2},
//             {"url": req.body.image_url_3, "description": req.body.image_desc_3},
//             {"url": req.body.image_url_4, "description": req.body.image_desc_4},
//             {"url": req.body.image_url_5, "description": req.body.image_desc_5},
//             {"url": req.body.image_url_6, "description": req.body.image_desc_6},
//             {"url": req.body.image_url_7, "description": req.body.image_desc_7},
//             {"url": req.body.image_url_8, "description": req.body.image_desc_8},
//             {"url": req.body.image_url_9, "description": req.body.image_desc_9},
//             {"url": req.body.image_url_10, "description": req.body.image_desc_10}
//         ],
//         report1: req.body.main_link,
//         report2: req.body.link2,
//         report3: req.body.link3,
//         staff: [
//             {"name": req.body.staff_name_1, "role": req.body.staff_role_1},
//             {"name": req.body.staff_name_2, "role": req.body.staff_role_2},
//             {"name": req.body.staff_name_3, "role": req.body.staff_role_3},
//             {"name": req.body.staff_name_4, "role": req.body.staff_role_4},
//             {"name": req.body.staff_name_5, "role": req.body.staff_role_5},
//             {"name": req.body.staff_name_6, "role": req.body.staff_role_6},
//             {"name": req.body.staff_name_7, "role": req.body.staff_role_7},
//             {"name": req.body.staff_name_8, "role": req.body.staff_role_8},
//         ],
//         partners: [
//             {"url": req.body.partner_url_1, "logo": req.body.partner_img_1},
//             {"url": req.body.partner_url_2, "logo": req.body.partner_img_2},
//             {"url": req.body.partner_url_3, "logo": req.body.partner_img_3},
//         ]
//         // partners: [
//         //     {"url": req.body.part}
//         // ]
//     }
//     const cur = req.body.cur
//     console.log(projItem)
//     if (cur === "current") {
//         // const past = pastProjects.find(proj => proj.name === req.body.name)
//         const num = curProjects.findIndex(proj => proj.name === name)
//         // curProjects.findIndex(num)
//         curProjects = curProjects.filter((proj) => {
//             if (proj.name === projItem.name) {
//                 return false; // to delete
//             } else {
//                 return true; // to keep
//             }
//         });
//         curProjects.splice(num, 0, projItem)
//         // curProjects.push(projItem);
//         const projJSON = JSON.stringify(curProjects)
//         fs.writeFile(__dirname + "/public/data/currentProj2.json", projJSON,
//             function (err) {
//                 if (err) {
//                     res.redirect('/edit_proj')
//                 } else {
//                     res.redirect('WWDdetail.html?id=' + proj_id);
//                 }
//             })
//     } else {
//         const num = pastProjects.findIndex(proj => proj.name === name)
//         pastProjects = pastProjects.filter((proj) => {
//             if (proj.name === projItem.name) {
//                 return false; // to delete
//             } else {
//                 return true; // to keep
//             }
//         });
//         // pastProjects.push(projItem);
//         pastProjects.splice(num, 0, projItem)
//         console.log(num)
//         // console.log(pastProjects)
//         const projJSON = JSON.stringify(pastProjects)
//         console.log(proj_id)
//         fs.writeFile(__dirname + "/public/data/pastProj.json", projJSON,
//             function (err) {
//                 if (err) {
//                     res.redirect('/edit_proj');
//                 } else {
//                     res.redirect('WWDdetail.html?id=' + proj_id);
//                 }
//             })
//     }
// });

app.post("/delete_item", (req, res) => {
    const past = pastProjects.find(proj => proj.name === req.body.name)
    const cur = curProjects.find(proj => proj.name === req.body.name)
    if (cur !== undefined) {
        curProjects = curProjects.filter((proj) => {
            if (proj.name === req.body.name) {
                return false; // to delete
            } else {
                return true; // to keep
            }
        });
        const projJSON = JSON.stringify(curProjects)
        fs.writeFile(__dirname + "/public/data/currentProj2.json", projJSON,
            function (err) {
                if (err) {
                    res.redirect('/edit_proj')
                } else {
                    res.redirect('/whatwedo');
                }
            })
    } else {
        pastProjects = pastProjects.filter((proj) => {
            if (proj.name === req.body.name) {
                return false; // to delete
            } else {
                return true; // to keep
            }
        });
        const projJSON = JSON.stringify(pastProjects)
        fs.writeFile(__dirname + "/public/data/pastProj.json", projJSON,
            function (err) {
                if (err) {
                    res.redirect('/edit_proj');
                } else {
                    res.redirect('/whatwedo');
                }
            })
    }
});

app.get("/edit_proj", (req, res) => {
    // const id = req.query.id;
    if (req.isAuthenticated()) {
        // console.log("authenticated")
        //res.sendFile(__dirname + "/src/edit_proj.html?proj=" + id);
        res.sendFile(__dirname + "/src/edit_proj.html");
    } else {
        res.redirect("/login")
    }
    // const past = pastProjects.find(proj => proj.id === id)
})

let proj_id = ''
app.post("/set_proj_id", (req, res) => {
    proj_id = req.body.id;
    res.send({message: "success", id: proj_id})

})

app.get("/send_proj_id", (req, res) => {
    res.send({message: "success", id: proj_id})
    // proj_id = req.body.id;
})

// publication/dissertation

app.get('/get_pubdis_by_id', function (req, res) {
    const id = req.query.id;

    const pub = pubs.find(proj => proj.citation === id)
    const dis = dists.find(proj => proj.citation === id)
    if (pub !== undefined) {
        res.send({
            "message": "success",
            "proj": pub
        })
    } else if (dis !== undefined) {
        res.send({
            "message": "success",
            "proj": dis
        })
    } else {
        res.send({
            "message": "error",
            "proj": {}
        })
    }
})

app.post("/delete_pubdis", (req, res) => {
    const pub = pubs.find(proj => proj.citation === req.body.id)
    const dis = dists.find(proj => proj.citation === req.body.id)
    if (pub !== undefined) {
        pubs = pubs.filter((proj) => {
            if (proj.citation === req.body.id) {
                return false; // to delete
            } else {
                return true; // to keep
            }
        });
        const projJSON = JSON.stringify(pubs)
        fs.writeFile(__dirname + "/public/data/pubs.json", projJSON,
            function (err) {
                if (err) {
                    res.redirect('/edit_pub_dis')
                } else {
                    res.redirect('/whatwedo');
                }
            })
    } else {
        dists = dists.filter((proj) => {
            if (proj.citation === req.body.id) {
                return false; // to delete
            } else {
                return true; // to keep
            }
        });
        const projJSON = JSON.stringify(dists)
        fs.writeFile(__dirname + "/public/data/dissertations.json", projJSON,
            function (err) {
                if (err) {
                    res.redirect('/edit_pub_dis')
                } else {
                    res.redirect('/whatwedo');
                }
            })
    }
});

app.get("/edit_pub_dis", (req, res) => {
    // const id = req.query.id;
    if (req.isAuthenticated()) {
        //res.sendFile(__dirname + "/src/edit_proj.html?proj=" + id);
        res.sendFile(__dirname + "/src/edit_pubdis.html");
    } else {
        res.redirect("/login")
    }
    // const past = pastProjects.find(proj => proj.id === id)
})

let pub_dis_id = ''
app.post("/set_pub_dis_cit", (req, res) => {
    pub_dis_id = req.body.id;
    res.send({message: "success", id: pub_dis_id})
})


app.get("/send_pub_dis", (req, res) => {
    res.send({message: "success", id: pub_dis_id})
})

app.post("/edit_pub_dis", (req, res) => {
    let citation = ""
    if (req.body.citation) {
        citation = req.body.citation
        pub_dis_id = citation;
    } else {
        citation = pub_dis_id
    }
    const projItem = {
        url: req.body.url,
        citation: citation,
        pub_dis: req.body.pub_dis
    }
    if (req.body.pub_dis === "pub") {
        const num = pubs.findIndex(event => event.citation === citation)
        pubs = pubs.filter((pub) => {
            if (pub.citation === projItem.citation) {
                return false; // to delete
            } else {
                return true; // to keep
            }
        });
        pubs.splice(num, 0, projItem)
        const pubJSON = JSON.stringify(pubs)
        fs.writeFile(__dirname + "/public/data/pubs.json", pubJSON,
            function (err) {
                if (err) {
                    res.redirect('/edit_pub_dis')
                } else {
                    res.redirect('/whatwedo');
                }
            })
    } else {
        const num = dists.findIndex(event => event.citation === citation)
        dists = dists.filter((dis) => {
            if (dis.citation === projItem.citation) {
                return false; // to delete
            } else {
                return true; // to keep
            }
        });
        // dists.push(projItem);
        dists.splice(num, 0, projItem)
        const distJSON = JSON.stringify(dists)
        fs.writeFile(__dirname + "/public/data/dissertations.json", distJSON,
            function (err) {
                if (err) {
                    res.redirect('/edit_pub_dis')
                } else {
                    res.redirect('/whatwedo');
                }
            })
    }
});

app.get("/world", function (req, res) {
    res.sendFile(__dirname + "/public/world.html");
});

app.get('/get_event_by_id', function (req, res) {
    const id = req.query.id;

    const event = events.find(event => event.name === id)
    if (event !== undefined) {
        res.send({
            "message": "success",
            "event": event
        })
    } else {
        res.send({
            "message": "error",
            "event": {}
        })
    }
})


let event_id = ''
app.post("/set_event_id", (req, res) => {
    event_id = req.body.id;
    res.send({message: "success", id: event_id})
})


app.get("/send_event_id", (req, res) => {
    res.send({message: "success", id: event_id})
})


app.get("/edit_event", (req, res) => {
    if (req.isAuthenticated()) {
        res.sendFile(__dirname + "/src/edit_event.html");
    } else {
        res.redirect("/login")
    }
})


app.post("/edit_event", (req, res) => {
    let name = ""
    console.log(req.body)
    if (req.body.nameForm) {
        name = req.body.nameForm
        event_id = name;
    } else {
        name = event_id
    }
    const eventItem = {
        name: name,
        description: req.body.description,
        date: req.body.date,
        images: [
            {"url": req.body.image_url_1, "description": req.body.image_desc_1},
            {"url": req.body.image_url_2, "description": req.body.image_desc_2},
            {"url": req.body.image_url_3, "description": req.body.image_desc_3},
            {"url": req.body.image_url_4, "description": req.body.image_desc_4},
            {"url": req.body.image_url_5, "description": req.body.image_desc_5}
        ]
    }
    const num = events.findIndex(event => event.name === name)
    console.log(eventItem)
    events = events.filter((event) => {
        if (event.name === eventItem.name) {
            return false; // to delete
        } else {
            return true; // to keep
        }
    });
    events.splice(num, 0, eventItem)
    const eventJSON = JSON.stringify(events)
    fs.writeFile(__dirname + "/public/data/events.json", eventJSON,
        function (err) {
            if (err) {
                res.redirect('/edit_event')
            } else {
                res.redirect('/event_detail.html?id=' + event_id);
            }
        })
});


app.post("/delete_event", (req, res) => {
    events = events.filter((event) => {
        if (event.name === req.body.id) {
            return false; // to delete
        } else {
            return true; // to keep
        }
    });
    const eventJSON = JSON.stringify(events)
    fs.writeFile(__dirname + "/public/data/events.json", eventJSON,
        function (err) {
            if (err) {
                res.redirect('/edit_event')
            } else {
                res.redirect('/world');
            }
        })
});
// send files
app.get("/", function (req, res) {
    res.sendFile(__dirname + "/public/index_welcome.html");
});

app.get("/whatwedo", function (req, res) {
    res.sendFile(__dirname + "/public/whatWeDoOverview.html");
});


//---------------Eli's section-------------------------------

//not that data validator allow you to check these fields are inputted correctly by user
const blogSchema = {
    title: {
        type: String,
        required: [true, "Title cannot be empty"] //this message not returned to front end, returned in terminal
    },
    thumbnail: String,
    date: {
        type: String,
        validate: {
            validator: function (value) {
                //returns true if value in correct format, otherwise returns false
                return /\d{4}-\d{2}-\d{2}/.test(value) //regular expression -- d stands for digit (0-9)
            },
            message: "Date Format must be yyyy-mm-dd"
        },
        category: {
            type: String,
            required: [true, "Category cannot be empty"]
        }
    },
    overview: String
}

const Blog = mongoose.model('Blog', blogSchema);

app.get('/blog', function (req, res) {
    res.sendFile(__dirname + "/public/blog.html");
});

//Get all blogs in the db
app.get("/get_all_blogs", function (req, res) {
    Blog.find(function (err, data) {
        if (err) {
            res.send({
                "message": "internal database error",
                "data": []
            });
        } else {
            res.send({
                "message": "success",
                "data": data.slice(0, 5)
            })
        }
    });
});

// Get blog by _id
app.get('/get_blog_by_id',
    function (req, res) {
        // console.log(req.query.blog_id);
        Blog.find({"_id": req.query.blog_id}, function (err, data) {
            if (err || data.length === 0) {
                res.send({
                    "message": "internal database error",
                    "data": {}
                });
            } else {
                res.send({
                    "message": "success",
                    "data": data[0]
                })
            }
        });
    });

//Save the blog to the database
app.post("/save_blog", (req, res) => {

    //create blog object to save -- make sure keys are same as schema
    const blog = {
        title: req.body.title,
        thumbnail: req.body.thumbnail,
        date: req.body.date,
        category: req.body.category,
        overview: req.body.overview
    }
    console.log(req.body._id);
    if (req.body._id) {
        //update existed blog
        Blog.updateOne({_id: req.body._id},
            {$set: blog},
            //validate matches schema
            {runValidators: true},
            (err, info) => {
                //if update is wrong, same redirect
                if (err) {
                    res.redirect('/edit_blog.html?error_message=' + err["message"] + "&input="  //will display error from back end message (from mongoose schema)
                        + JSON.stringify(blog) + "&blog_id=" + req.body._id) // & input... saves temp data
                } else {
                    res.redirect("/blog_blog.html?blog_id=" + req.body._id) //go to individual blog_detail page after creating a new blog
                }
            }
        )


    } else {
        //create new blog

        //create schema
        const nm = new Blog(blog);
        nm.save((err, new_blog) => {
            //new_blog is the blog object being saved to database.
            //Need to return it to callback function so the auto generated id will be saved

            if (err) {
                console.log(err);
                // res.send("Database error")

                //if something is wrong, stay editing blog -- stay here
                res.redirect('/edit_blog.html?error_message=' + err["message"] + "&input="  //will display error from back end message (from mongoose schema)
                    + JSON.stringify(blog)) // & input... saves temp data
            } else {
                console.log(new_blog._id)
                res.redirect("/blog_blog.html?blog_id=" + new_blog._id) //go to individual blog_detail page after creating a new blog
            }

        });

    }


});

// Delete blog by id
app.post('/delete_blog_by_id', (req, res) => {
    Blog.deleteOne(
        {"_id": req.body._id},//match from blog_detail.js
        {},
        (err) => {
            if (err) {
                res.send({
                    "message": "data base deletion error"
                })
            } else {
                res.send({
                    "message": "success"
                })
            }
        }
    )
});


// Delete a list of blogs by id
app.post('/delete_blog_by_ids', (req, res) => {
    console.log(req.body._ids) //check server can see list of ids to be deleted from blog.js
    Blog.deleteMany(
        {"_id": {$in: req.body._ids}}, //$in is mongoose operator
        {},
        (err) => {
            if (err) {
                res.send({
                    "message": "database delete multiple error"
                })
            } else {
                res.send({
                    "message": "success"
                })
            }
        }
    )
});

// Get blogs by keyword and min max rating
//comes from blog.js
app.get("/get_blogs_by_filters", (req, res) => {
    console.log(req.query.search_key) //note: if post then use boy, if get then use query
    const sk = req.query.search_key;

    Blog.find({
            $or: [
                {title: {$regex:sk}},
                {overview:{$regex:sk}}
            ]
        },
        (err,data)=>{
            if(err){
                console.log("search error")
                res.send({
                    "message":"error",
                    "data":[]
                })
            }else{
                console.log(data)
                res.send({
                    "message":"success",
                    "data":data
                })
            }
        }

    );

});