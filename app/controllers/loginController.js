const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const Country = require('../models/country');
require('dotenv').config();


//REGISTER (POST USER)
router.post('/register', function(req, res, next){
	req.checkBody('username', 'Username required').notEmpty();
	req.checkBody('email', 'E-mail required').notEmpty();
	req.checkBody('password', 'Password required').notEmpty();
	req.checkBody('country', 'Country required').notEmpty();

	req.sanitize('username').escape();
	req.sanitize('username').trim();
	req.sanitize('email').escape();
	req.sanitize('email').trim();
	req.sanitize('password').escape();
	req.sanitize('password').trim();
	req.sanitize('country').escape();
	req.sanitize('country').trim();
	
	var errors = req.validationErrors();

	if (errors) {
		Country.find({}).then(function(countries){
			res.render('register', { title: 'Register', countries : countries, errors: errors})
		});
	}
	else{
		User.findOne({username: req.body.username}).then(function(user2){
			if (user2) { 
				message = {
					"message" : "Credentials are already in use",
					"type" : "Failure"			
				};
				Country.find({}).then(function(countries){
					res.render('register', { title: 'Register', countries : countries, errors: null, message: message})
				});
			}
			else{
				message = {
					"message" : "Registration complete!",
					"type" : "Success"			
				};
				User.create(req.body).then(function(user){
					res.status(201);
					Country.find({}).then(function(countries){
						res.render('register', { title: 'Register', countries : countries, errors: null, message: message})
					});
				}).catch(next);
			}
		});
	}
});

router.get('/register', function(req, res){
	Country.find({}).then(function(countries){
		res.render('register', { title: 'Register', countries : countries, errors: null, message:null})
	});
});

//LOGIN
router.post('/login', function(req, res){

	req.checkBody('username', 'Username required').notEmpty();
	req.checkBody('password', 'Password required').notEmpty();

	req.sanitize('username').escape();
	req.sanitize('username').trim();
	req.sanitize('password').escape();
	req.sanitize('password').trim();

	var errors = req.validationErrors();
	if (errors) {
		res.render('login', { title: 'Login', errors: errors})
	}
	else{
		User.findOne({username: req.body.username, password: req.body.password}).then(function(user){
			if(!user){
				message = {
					"message" : "Credentials are incorrect",
					"type" : "Failure"			
				};
				res.render('login', { title: 'Login', errors: null, message: message})
			}
			else{
				message = {
					"message" : "Logged in!",
					"type" : "Success"			
				};
				const token = jwt.sign({ user }, process.env.JWT_SECRET);
				req.session.user = user;
				if(user.username == 'admin')
					req.session.admin = true;

				res.cookie('token', token);
				res.render('404', { title: 'Success!', asd: 'Logged in successfully'})
			}
		});
	}
});

router.get('/login', function(req, res){
	if(req.session.user && req.session){
		return res.render('404', { title: 'Oops!', asd: 'Already logged in'})
	}
	res.render('login', { title: 'Login',  errors: null, message: null})
});

router.get('/logout', function(req, res){

	if(!req.session.user || !req.session){
		return res.render('404', { title: 'Oops!', asd: 'Not logged in'})
	}
	cookie = req.cookies;
    for (var prop in cookie) {
        if (!cookie.hasOwnProperty(prop)) {
            continue;
        }    
        res.cookie(prop, '', {expires: new Date(0)});
    }
	req.session.destroy();
	return res.render('404', { title: 'Success', asd: 'Logged out successfully!'})
});
    
module.exports = router;