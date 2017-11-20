const express = require('express');
const router = express.Router();
const User = require('../models/user');
var bodyParser = require('body-parser');

router.use(bodyParser.urlencoded({ extended: true }));

//GET method for USERS
router.get('/users', function(req, res, next){
	User.find({}).then(function(users){
		res.send(users);
	});
});


//GET ONE method for USER (returns all user's friends and that user's info)
router.get('/users/:id/friendlist', function(req, res, next){
	var result = {};
	User.findOne({_id: req.params.id}).then(function(user){
		if(!user)
			res.status(404).send({error: "The requested resource could not be found (special case)"});
		else
		{
			result.user = user;
			User.find({friend: req.params.id}).then(function(friend){
				if(!friend.length)
					res.send(result);
					else
					{
						result.friend = friend;
						res.send(result);
					}
			}).catch(next);
		}
	}).catch(next);
});

//GET ONE method for USERS (returns one user's data)
router.get('/users/:id', function(req, res, next){
	User.findOne({_id: req.params.id}).then(function(user){
		if(!user)
			res.status(404).send({error: "The requested resource could not be found (special case)"});
		else
			res.send(user);
	}).catch(next);
});

//POST method for USERS
router.post('/users', function(req, res, next){
	User.create(req.body).then(function(user){
		res.status(201);
		res.send(user);
	}).catch(next);
});

//PUT method for USER (adds a user to a friendlist (both ways))
router.put('/users/:id/friendlist/add', function(req, res, next){
	if(req.params.id != req.body.friend){
		User.findOne({_id: req.params.id}).then(function(user){
			if(!user)
				res.status(404).send({error: "The requested resource could not be found 1"});
			else{
				User.update(
					{ _id: req.params.id},
					{ $push: {friend: req.body.friend}}
				).then(function(err){
					if(err.nModified == 0){
						res.status(404).send({error: "Nothing was modified, something went wrong."});
						return;
					}
					User.findOne({_id: req.body.friend}).then(function(user2){
						if(!user2)
							res.status(404).send({error: "The requested resource could not be found 2"});
						else
							User.update(
								{ _id: req.body.friend},
								{ $push: {friend: req.params.id}}
							).then(function(err){
								if(err.nModified == 0){
									res.status(404).send({error: "Nothing was modified, something went wrong."});
									return;
								}
								User.findOne({_id: req.params.id}).then(function(user3){
									if(!user3)
										res.status(404).send({error: "The requested resource could not be found 3"});
									else
										res.send(user3);
								});
							});
					});
				});
			}
		}).catch(next);
	}
	else{
		res.status(404).send({error: "Trying to add yourself as a friend :("});
	}
});

//PUT method for USER (removes a user from a friendlist (both ways))
router.put('/users/:id/friendlist/remove', function(req, res, next){
	if(req.params.id != req.body.friend){
		User.findOne({_id: req.params.id}).then(function(user){
			if(!user)
				res.status(404).send({error: "The requested resource could not be found (special case)"});
			else{
				User.update(
					{ _id: req.params.id},
					{ $pull: {friend: req.body.friend}}
				).then(function(err){
					if(err.nModified == 0){
						res.status(404).send({error: "Nothing was modified, something went wrong."});
						return;
					}
					User.findOne({_id: req.body.friend}).then(function(user2){
						if(!user2)
							res.status(404).send({error: "The requested resource could not be found (special case)"});
						else
							User.update(
								{ _id: req.body.friend},
								{ $pull: {friend: req.params.id}}
							).then(function(err){
								if(err.nModified == 0){
									res.status(404).send({error: "Nothing was modified, something went wrong."});
									return;
								}
								User.findOne({_id: req.params.id}).then(function(user3){
									if(!user3)
										res.status(404).send({error: "The requested resource could not be found (special case)"});
									else
										res.send(user3);
								});
							});
					});
				});
			}
		}).catch(next);
	}
	else{
		res.status(404).send({error: "Trying to remove yourself"});
	}
});

//PUT method for USERS
router.put('/users/:id', function(req, res, next){
	User.findByIdAndUpdate({_id: req.params.id}, req.body).then(function(){
		User.findOne({_id: req.params.id}).then(function(user){
			if(!user)
				res.status(404).send({error: "The requested resource could not be found (special case)"});
			else
				res.send(user);
		});
	}).catch(next);
});

//DELETE method for USERS
router.delete('/users/:id', function(req, res, next){
	User.findByIdAndRemove({_id: req.params.id}).then(function(user){
		if(!user)
			res.status(404).send({error: "The requested resource could not be found (special case)"});
		else
			res.send(user);
	}).catch(next);
});

module.exports = router;