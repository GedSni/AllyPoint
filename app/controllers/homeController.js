const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Game = require('../models/game');
const Category = require('../models/category');
let verifyToken = require('../auth/jwt');
let verifyUser = require('../auth/session');
let verifyAdmin = require('../auth/admin');

router.get('/home', function(req, res, next){
	res.render('home', { title: 'Home'})
});

router.get('/panel', verifyToken, verifyUser, verifyAdmin, function(req, res, next){
    Category.find({}).then(function(categories){
		Game.find({}).then(function(games){
            User.find({}).then(function(users){
                res.render('adminPanel', { title: 'Admin panel', categories : categories, games : games, users : users})
            });
        });
	});
});

module.exports = router;