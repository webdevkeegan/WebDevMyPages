//tbd

const express = require("express");
const fs=require('fs');
const app = express();

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static(__dirname + "/public"));

//---------------repopulate with current values-----------------------------------------
app.listen(3000, function () {
    console.log("server started at 3000")

    //everytime restart server, parse through json list

    //use to edit partners -- NOT DONE YET
    const rawDataPartners=fs.readFileSync(__dirname+"/public/data/partnersData.json")
    partnersList=JSON.parse(rawDataPartners);
    console.log(partnersList)

    //use to edit services -- DID ADD SERVICE
    const rawDataServices=fs.readFileSync(__dirname+"/public/data/servicesProvided.json")
    servicesList=JSON.parse(rawDataServices);
    console.log(servicesList)

    //use to edit people
    const rawDatapeople=fs.readFileSync(__dirname+"/public/data/people.json")
    peopleList=JSON.parse(rawDatapeople);
    console.log(peopleList)


});



//---------------Add new service-----------------------------------------
let servicesList=[];
//making the form
app.post('/new-service',(req,res)=>{
    console.log(req.body.service_to_be_added); //prints in terminal

    //make dictionary
    const serviceItem={ //note: all transferred as string!
        "service": req.body.service_to_be_added,
        "description": req.body.description_of_service
    }

    servicesList = servicesList.filter((service)=>{ //make sure no duplicates, remove old service (overwrites)
        if(service.service===req.body.service_to_be_added){
            return false;
        }else{
            return true;
        }

    });

    servicesList.push(serviceItem) //push new service to list

    //convert to json
    const serviceJSON =JSON.stringify(servicesList);
    // const appendItem =JSON.stringify(serviceItem);


    //writes json string into file
    fs.writeFile(__dirname+"/public/data/servicesProvided.json", serviceJSON,
        function(err){
            //function is waiting for event
            if(err){ //if error occurs, make note
                console.log("JSON writing failed");
            }else{

                res.redirect('/who_we_are'); //will always go to right location
            }
        });
});
//------------------------------------------------

//---------------Add new person-----------------------------------------

let peopleList=[];
//making the form
app.post('/new-person',(req,res)=>{
    console.log(req.body.name); //prints in terminal

    //make dictionary
    const peopleItem={ //note: all transferred as string!
        "name": req.body.person_to_be_added,
        "title": req.body.title_to_be_added,
        "department":req.body.department_to_be_added,
        "contact":req.body.contact_to_be_added,
        "profile_picture":req.body.picture_to_be_added,
        "bio":req.body.bio_to_be_added
        //UPDATE THIS
    }

    peopleList = peopleList.filter((service)=>{ //make sure no duplicates, remove old service (overwrites)
        if(service.service===req.body.person_to_be_added){
            //UPDATE THIS
            return false;
        }else{
            return true;
        }

    });

    peopleList.push(peopleItem) //push new service to list

    //convert to json
    const peopleJSON =JSON.stringify(peopleList);
    // const appendItem =JSON.stringify(serviceItem);


    //writes json string into file
    fs.writeFile(__dirname+"/public/data/people.json", peopleJSON,
        function(err){
            //function is waiting for event
            if(err){ //if error occurs, make note
                console.log("JSON writing failed");
            }else{

                res.redirect('/who_we_are'); //will always go to right location
            }
        });
});

//------------------------------------------------



//-----------------delete single service-------------------------------

app.post('/delete-service',(req,res)=>{

    //how to delete a service from list
    servicesList = servicesList.filter((service)=>{ //each service in the list, will stay in list if filter(service) returns True
        console.log("GIRLL app.post /delete-service"+service.service);
        console.log("GIRLL app.post /delete-service"+req.body.service);
        if(service.service===req.body.service){

            return false;
        }else{
            return true;
        }

    });

    const deleteServicesJSON = JSON.stringify(servicesList);

    fs.writeFile(__dirname+"/public/data/servicesProvided.json", deleteServicesJSON,
        function(err){
            if(err){
                console.log("File writing error")
                console.log(err);
            }else{ //else writing is successful
                res.redirect("/who_we_are") //send back to homepage
            }
        });

});

//------------------------------------------------


//-----------------delete single person-------------------------------

app.post('/delete-person',(req,res)=>{

    //how to delete a service from list
    peopleList = peopleList.filter((person)=>{ //each service in the list, will stay in list if filter(service) returns True
        console.log("GIRLL app.post /delete-person"+person.name);
        console.log("GIRLL app.post /delete-person"+req.body.person);
        if(person.name===req.body.person){

            return false;
        }else{
            return true;
        }

    });

    const deletePersonJSON = JSON.stringify(peopleList);

    fs.writeFile(__dirname+"/public/data/people.json", deletePersonJSON,
        function(err){
            if(err){
                console.log("File writing error")
                console.log(err);
            }else{ //else writing is successful
                res.redirect("/who_we_are") //send back to homepage
            }
        });

});

//------------------------------------------------




app.get("/", function (req, res) {
    res.sendFile(__dirname+"/public/index_welcome.html");
});

app.get("/who_we_are", function (req, res) {
    res.sendFile(__dirname+"/public/who_we_are.html");
});