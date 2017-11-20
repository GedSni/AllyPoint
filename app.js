const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
require('dotenv').config();

//set up express app
const app = express();

//connect to mongodb
mongoose.connect('mongodb://localhost/allyPoint');
mongoose.Promise = global.Promise;

//present user with static content
app.use(express.static('public'));

//initialize body parser
app.use(bodyParser.json());

//initialize routes
app.use(require('./app/controllers'));

//listen for requests
app.listen(process.env.port || 4000, function(){
	console.log('Now listening for requests');
});

//error handling middleware
app.use(function(err, req, res, next){
	res.status(404).send({error: "The requested resource could not be found"});
});