const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
require('dotenv').config();

//set up express app
const app = express();

//listen for requests
app.listen(process.env.port || 4000, function(){
	console.log('Now listening for requests');
});

//connect to mongodb
mongoose.connect('mongodb://localhost/allyPoint');
mongoose.Promise = global.Promise;

//sessions
app.use(session({secret: process.env.SECRET, resave:false, saveUninitialized: true}));

//present user with static content
app.use(express.static('public'));

//initialize body parser
app.use(bodyParser.json());

//initialize routes
var categoryController = require('./app/routes/categoryController');
var countryController = require('./app/routes/countryController');
var gameController = require('./app/routes/gameController');
var userController = require('./app/routes/userController');
var authController = require('./app/auth/auth');
app.use('/', categoryController);
app.use('/', countryController);
app.use('/', gameController);
app.use('/', userController);
app.use('/', authController);


//error handling middleware
app.use(function(err, req, res, next){
	res.status(404).send({error: "The requested resource could not be found"});
});


