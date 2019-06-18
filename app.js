// const MongoClient = require("mongodb").MongoClient;
// const uri = "mongodb+srv://admin:Bung4mui@mycherry-lqphn.mongodb.net/test?retryWrites=true&w=majority";
// const client = new MongoClient(uri, { useNewUrlParser: true });
// client.connect(err => {
//   const collection = client.db("test").collection("devices");
//   // perform actions on the collection object

//   db = client.db('books');

//   console.log(db)
//   client.close();
// });


//-------------------------Connect to db via Mongoose----------------------
//get mongoose module----------
var mongoose = require('mongoose');

//debug -- (node:6368) DeprecationWarning: collection.ensureIndex is deprecated. Use createIndexes instead.
//mongoose set
mongoose.set('useCreateIndex', true);

//connect--------
// mongoose.connect('mycherry-lqphn.mongodb.net:27017/myBooks', {useNewUrlParser: true});
// mongoose.connect('mongodb://localhost/myBooks', {useNewUrlParser: true}); //working
mongoose.connect("mongodb+srv://admin:Bung4mui@mycherry-lqphn.mongodb.net/myBooks?retryWrites=true&w=majority/myBooks",{useNewUrlParser: true}) //not working
// mongoose.connect({database:'mycherry-lqphn.mongodb.net:27017/myBooks'}, {useNewUrlParser: true});


//check for errors--------
let database = mongoose.connection;
database.on('error', function(err){
    console.log(err);
});


database.once('open', function(){
    console.log("Connected to database!")
});

//Bring in Models-----------------------
var bookSchema = require('./models/bookSchema');

//-------------------------------------------------------------------------------
/******************
 * Express NPM
 *****************/
//get express module
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

//setting view engine as pug
app.set('view engine', 'pug');
app.use(bodyParser.urlencoded({extended:false}));
app.use(cookieParser());
app.use(express.static('public'));

/*************
    ROUTING        
*************/
var router = require('./routes');
app.use(router);


/*******************
 * HANDLING ERRORS *
 *******************/

app.use((req, res, next) => {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
});

app.use((err, req, res, next) => {
    res.locals.error = err;
    res.status(err.status);
    res.render('subs/error');
});

/*-------------------------------------------------------------------------------------------------------- */
app.listen(8000, (req, res) => {
    console.log("Running on localhost:8000");
})