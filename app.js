const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const expressValidator = require('express-validator');
const mongoose = require('mongoose');
const session = require('express-session');
const methodOverride = require('method-override');
require('dotenv').config();

//set up express app
const app = express();

//connect to mongodb
mongoose.connect('mongodb://localhost/allyPoint');
mongoose.Promise = global.Promise;

app.set('views', './app/views');
app.set('view engine', 'ejs');

app.use(cookieParser());

//present user with static content
app.use(express.static('public'));

//initialize body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(expressValidator());

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true
}));

app.use(function(req, res, next) {
	res.locals.loggedUser = req.session.user;
	res.locals.admin = req.session.admin;
	next();
});

app.use(methodOverride('_method'));

//initialize routes
app.use(require('./app/controllers'));

//listen for requests
app.listen(process.env.port || 4000, function(){
	console.log('Now listening for requests');
});

//error handling middleware
app.use(function(err, req, res, next){
	res.status(404).send({err});
});