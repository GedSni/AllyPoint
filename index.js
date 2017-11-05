const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
require('dotenv').config();

//set up express app
const app = express();

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
app.use('/api', require('./app/routes/api'));

//error handling middleware
app.use(function(err, req, res, next){
	res.status(404).send({error: "The requested resource could not be found"});
});

//listen for requests
app.listen(process.env.port || 4000, function(){
	console.log('Now listening for requests');
});