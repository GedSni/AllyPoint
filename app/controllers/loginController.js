const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/user');

//REGISTER (POST USER)
router.post('/register', function(req, res){
	User.create(req.body).then(function(user){
		res.status(201);
		res.send(user);
	}).catch(next);
});

//LOGIN
router.post('/login', function(req, res){
	var username = req.body.username;
	var password = req.body.password;
	
	User.findOne({username: username, password: password}, function(err, user){
		if(err)
			return res.status(404).send({error: "Logic credentials incorrect"});
		if(!user)
			return res.status(404).send({error: "The requested resource could not be found"});
		
		const token = jwt.sign({ user }, 'my_secret_key');
		res.json({
			token: token
		});
    });
});
    
module.exports = router;