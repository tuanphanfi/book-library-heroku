var express = require('express');
var router = express.Router();
var nodemailer = require('nodemailer');
//Bring in Models-----------------------
var bookSchema = require('../models/bookSchema');
var userSchema = require('../models/userSchema');

/********************
 * Define the routes
********************/

router.get('/', (req, res, next) => {
    res.locals.user_email = req.cookies.user_email;      
    bookSchema.find({}, (err, bookArray) => {
        if (err) {
            console.log(err);
        } else {
            res.render('index', {
                bookArray,
            });
            console.log("Render index page");
        }
    })
});


router.get('/books', (req, res) => {
    res.locals.user_email = req.cookies.user_email;
    bookSchema.find({}, (err, bookArray) => {
        if (err) {
            console.log(err);
        } else {
            
            res.render('books', {
                bookArray
            });
            console.log(bookArray[0])
            console.log("Render books page")
        }
    })
});


router.post("/books", (req, res) => {

//sorting
    if (req.body.button == "AZ") {
        bookSchema.find({}).sort({
            title: 1
        }).exec((err, bookArray) => {
            res.render("books", {
                bookArray
            });
            console.log("Sorted a-z");
        })
    } else if (req.body.button == "ZA") {
        bookSchema.find({}).sort({
            title: -1
        }).exec((err, bookArray) => {
            res.render("books", {
                bookArray
            });
            console.log("Sorted z-a");
        })
    } else if (req.body.button == "AscYear") {
        bookSchema.find({}).sort({
            year: 1
        }).exec((err, bookArray) => {
            res.render("books", {
                bookArray
            });
            console.log("Sorted asc year");
        })
    } else if (req.body.button == "DesYear") {
        bookSchema.find({}).sort({
            year: -1
        }).exec((err, bookArray) => {
            res.render("books", {
                bookArray
            });
            console.log("Sorted des year");
        })
    }

//searching
    if (req.body.book_search != null) {

        //manually
        var keyword = req.body.book_search.split(" ");
        var include_arr=[];
        var searchType= req.body.searchType;
        bookSchema.find({}, (err, bookArray)=>{
            if(err){
                console.log(err);
            }
            else{
                if(searchType=="all"){
                    for(var i=0; i<bookArray.length;i++){
                        for (var j=0;j<keyword.length;j++){
                            if(bookArray[i]['title'].toLowerCase().includes(keyword[j])|| bookArray[i]['author'].toLowerCase().includes(keyword[j])||bookArray[i]['language'].toLowerCase().includes(keyword[j])||bookArray[i]['year'].toString().toLowerCase().includes(keyword[j])){
                                include_arr[include_arr.length]=bookArray[i];
                            }
    
                        }
    
                    }
                }
                else{
                    for(var i=0; i<bookArray.length;i++){
                        for (var j=0;j<keyword.length;j++){
                            if(bookArray[i][searchType].toString().toLowerCase().includes(keyword[j])){
                                include_arr[include_arr.length]=bookArray[i];
                            }
    
                        }
    
                    }
                }
        if(include_arr==null){
            res.send("No book has the keyword '"+req.body.book_search+"'");
        }
        else{
            res.render("books",{bookArray:include_arr});
        }
            }

        }) 


    }
    
})


//handling each single BOOK
router.get('/book-desc/:id', (req, res) => {
    res.locals.user_email = req.cookies.user_email;
    bookSchema.find({}, (err, bookArray) => {
        if (err) {
            console.log(err);
        } else {
            //Taking book id when an image clicked
            var bookId = req.params.id;

            //Checking if the id is taken
            console.log(bookId);

            res.render('book-desc', {
                bookArray,
                bookId
            });
            console.log("Render book-desc page");
        }
    })
});

router.get('/about', (req, res) => {
    res.locals.user_email = req.cookies.user_email;
    res.render('about');
});

router.get('/contact', (req, res) => {
    res.locals.user_email = req.cookies.user_email;
    res.render('contact');
});


/**********************
**********************
* USER USER USER USER
* USER USER USER USER
**********************
*********************/

/**********************
 * USER LOG-IN REGISTER
 *********************/

router.get('/register', (req, res) => {
    res.render('subs/users/register', );
});

router.post('/register', (req, res) => {

    //Send Email Confirmation
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'medialibrarylamk@gmail.com',
            pass: 'M19LamkFi'
        }
    });

    var mailOptions = {
        from: 'medialibrarylamk@gmail.com',
        to: req.body.email,
        subject: 'Media Library Confirmation',
        text: 'Congratulation! Your account has been created.'
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });

    //Create a new user
        // Push New User Data to Database
    var userData = new userSchema();

    userData.name = req.body.name;
    userData.email = req.body.email;
    userData.password = req.body.password;
    userData.confirmPassword = req.body.confirmPassword;
    userSchema.create(userData);
    res.render('subs/users/registerSuccessful');
});

router.get('/log-in', (req, res) => {
    res.render('subs/users/log-in', );
});

router.post('/log-in', (req, res) => {
    userSchema.find({}, (err, users) => {
        if (err) {
            console.log(err);
        } else {
    
            for(var i = 0; i < users.length; i++){
                if (users[i]['email'] == req.body['user_email'] &&
                users[i]['password'] == req.body['user_password'])
                {
                    res.cookie('user_email', req.body['user_email']);
                    console.log(users[i]);
                    res.redirect('/');        
                } else {
                    console.log('Please correct your email');
                }
            }
        }
    });
});

router.get('/log-out', (req, res) => {
    res.clearCookie('user_email');
    
    res.redirect('/');
});

//user-profile
router.get('/view-profile', (req, res) => {
    const user_email = req.cookies.user_email;    
    userSchema.findOne({'email':user_email}, (err, users) => {
        if (err) {
            console.log(err);
        } else {
            
            const user_password = users['password'];
            res.render('subs/users/user-profile', {user_password, user_email});        
        }
    })
    
})

router.post('/view-profile', (req, res) => {
    const user_email = req.cookies.user_email;    
    userSchema.findOne({'email':user_email}, (err, users) => {
        if (err) {
            console.log(err);
        } else {
            users['password'] = req.body.password;
            users['confirmPassword'] = req.body.password;
            const user_password = users['password'];
            users.save(function (err) {
                if (err)
                {
                    // TODO: Handle the error!
                }
                // res.json('yep');
            });
            res.render('subs/users/user-profile', {user_password, user_email});        
        }
    })
})

//Mounting the module into the main app.js
module.exports = router;