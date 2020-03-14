let mod = require('../models/artistData');
//var passwordHash = require('password-hash');

exports.signup = function(req,res,next) {
    console.log("signup page method\n");

    let email = req.body.email;
    let password = req.body.pass;

    //let hashedPassword = passwordHash.generate(password);

    let signupres = mod.signup(email, password);
    signupres.then((data) => {
        let accId = data.rows.id;
        let login = mod.login(accId); //save login date/time



        //localStorage.setItem("currentuser", JSON.stringify(accId));
        //console.log("\n\nUPDATED LOCAL STORANGE!!!\n\n")

        res.redirect(301, "/home");
    });
}

exports.login = function(req,res,next) {
    let email = req.body.email;
    let password = req.body.pass;
    //let hashedPassword = passwordHash.generate(password);

    let auth = mod.authenticate(email, password);
    auth.then((data) => {
        let success = data.rows.length > 0;
        console.log("authenticated\n");

        if(success){
            let accId = data.rows[0].id;
            let login = mod.login(accId); //save login date/time
            console.log("login date saved with " +  accId + "\n");

            //localStorage.setItem("currentuser", JSON.stringify(accId));
            //console.log("\n\nUPDATED LOCAL STORANGE!!!\n\n")

            res.redirect(301, "/home");
        }
    });
}



exports.logout = function(req,res,next) {
    console.log("logout\n");
    let id = req.params.id;
    let logout = mod.logout(id);
    
    logout.then((data) => {
        res.redirect(301, "/");
    });
}


exports.loadPage = function(req, res, next){
    //res.redirect(301, "/signup");

    
    //TODO IMPORTANT: SAVE THE ACCID OF LAST LOGIN IN LOCAL STORAGE OF BROWSER. THEN PASS THAT TO CHECKLOGIN.
    //if they do incognito, or clear cache, then they just get the login page! :)
    
    
    //let id = JSON.parse(localStorage.getItem("currentuser"));

    // if(id){
    //     let isLoggedIn = mod.checkLogin();

    //     isLoggedIn.then((data) => {
    //         console.log(data.rows);    
    //     });

    // } else{
        res.render('initial', {
            title: "Artist Directory",
            initialCSS: true
        });
    // }
    

    
    //check if logged in
    //if logged in
    //load homepage

    //if its been over 30min since last login (or no login by this acc ID,) then load login page
}



exports.getAllArtists = function(req,res,next) {
    let artists = mod.getall();

    artists.then((data) => {
        res.render('home', { 
            artists: data.rows, 
            artistsCSS: true,
            pageTitle: 'Artist Directory', 
            heading: 'Artist Directory' 
        });
    });
}



exports.addArtist = function(req, res, next){
    var url = req.body.avatar;
    var na = req.body.name;
    var descr = req.body.description;

    var artist = {
        name: na,
        description: descr,
        avatar: url
    };
    
    let add = mod.addArtist(artist);

    add.then((data) => {
        res.redirect(301, "/home");
    });
    
}


exports.deleteArtist = function(req, res, next){
    let id = req.params.id;
    let del = mod.deleteArtist(id);

    if(del){
        del.then((data) => {
            res.redirect(301, "/home");
        });
    }
}


exports.search = function(req, res, next){
    let input = req.body.name;

    let query = mod.search(input);
    if(query){
        query.then((data) => {
            
            //wipes out the input search text, which is confusing for user!!!!!!!
            res.render('home', { 
                artists: data.rows, 
                artistsCSS: true,
                pageTitle: 'Artist Directory', 
                heading: 'Artist Directory' 
            });
        });
    }
}

// exports.peopleAddForm = function(req,res,next) {
//     res.render('peopleadd' ,{formsCSS: true});
// }

// exports.getPeople = function(req,res,next) {
//     let id = req.params.id;
//     let People = mod.getpeople(id);
//     People.then( (data) => {
//         res.render('people', {people: data.rows[0], peopleCSS: true});
//     });
// }

// exports.peopleAdd = function(req,res,next) {
//    let p_name = req.body.name;
//    let p_about = req.body.about;
//    let p_imageURL = req.body.url;

//    let pOject = {
//       name: p_name,
//       about: p_about,
//       url: p_imageURL
//    }

//    mod.add(pOject);
//    res.redirect(301, '/peoples');
// }