const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Game = require('../models/game');

//GET method for USERS
router.get('/', function(req, res, next){
	User.find({}).then(function(users){
		res.render('users', { title: 'Users', users : users })
	});
});

//GET ONE method for USER (returns all user's friends and that user's info)
router.get('/:id/friendlist', function(req, res, next){
	var result = {};
	User.findOne({_id: req.params.id}).then(function(user){
		if(!user)
			res.status(404).send({error: "The requested resource could not be found (special case)"});
		else
		{
			result.user = user;
			User.find({friend: req.params.id}).then(function(friends){
				if(!friends.length)
					res.render('friendlist', { title: result.user.username, user : user })
					else
					{
						result.friends = friends;
						res.render('friendlist', { title: result.user.username, user : user , friends : friends  })
					}
			}).catch(next);
		}
	}).catch(next);
});

//GET ONE method for USERS (returns one user's data)
router.get('/:id', function(req, res, next){
	var result = {};
	
	User.findOne({_id: req.params.id}).then(function(user){
		if(!user)
			res.status(404).send({error: "The requested resource could not be found (special case)"});
		else
		{
			result.user = user;
			Game.find({_id: user.game}).then(function(games){
				if(!games.length)
					res.render('user', { title: result.user.username, user : user })
					else
					{
						result.games = games;
						res.render('user', { title: result.user.username, user : user, games : games })
					}
			}).catch(next);
			
		}
	}).catch(next);	
});


//POST method for USERS
router.post('/add', function(req, res, next){
	User.create(req.body).then(function(user){
		res.status(201);
		res.send(user);
	}).catch(next);
});

//PUT method for USER (adds a user to a friendlist (both ways))
router.put('/:id/friendlist/add', function(req, res, next){
	if(req.params.id != req.body.friend){
		User.findOne({_id: req.params.id}).then(function(user){
			if(!user)
				res.status(404).send({error: "The requested resource could not be found 1"});
			else{
				User.find({ 
					friend: req.body.friend
				 }).then(function(foundUser){
					if(foundUser && foundUser.length){
						res.status(404).send({error: "Already a friend"});
					}
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
												res.redirect('/users/' + user.id);
										});
									});
							});
						});
					}
				 }); 
			}
		}).catch(next);
	}
	else{
		res.status(404).send({error: "Trying to add yourself as a friend :("});
	}
});


//PUT method for USER (removes a user from a friendlist (both ways))
router.put('/:id/friendlist/remove', function(req, res, next){
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
										res.redirect('/users/' + user.id);
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


//PUT method for USER (adds a user to a friendlist (both ways))
router.put('/:id/game/add', function(req, res, next){
	User.findOne({_id: req.params.id}).then(function(user){
		if(!user)
			res.status(404).send({error: "The requested resource could not be found 1"});
		else{
			User.find({ 
				_id: req.params.id,
				game: req.body.id
				}).then(function(foundUser){
				if(foundUser && foundUser.length){
					res.status(404).send({error: "Already in your list"});
				}
				else{
					User.update(
						{ _id: req.params.id},
						{ $push: {game: req.body.id}}
					).then(function(err){
						if(err.nModified == 0){
							res.status(404).send({error: "Nothing was modified, something went wrong."});
							return;
						}
						User.findOne({_id: req.params.id}).then(function(user3){
							if(!user3)
								res.status(404).send({error: "The requested resource could not be found 3"});
							else
								res.redirect('/games/' + req.body.id);
						});
					});
				}
			}); 
		}
	}).catch(next);
});

//PUT method for USER (removes a user from a friendlist (both ways))
router.put('/:id/game/remove', function(req, res, next){
	User.findOne({_id: req.params.id}).then(function(user){
		if(!user)
			res.status(404).send({error: "The requested resource could not be found 1"});
		else{
			User.update(
				{ _id: req.params.id},
				{ $pull: {game: req.body.id}}
			).then(function(err){
				if(err.nModified == 0){
					res.status(404).send({error: "Nothing was modified, something went wrong."});
					return;
				}
				User.findOne({_id: req.params.id}).then(function(user3){
					if(!user3)
						res.status(404).send({error: "The requested resource could not be found 3"});
					else
						res.redirect('/games/' + req.body.id);
				});
			});
		}
	}).catch(next);
});

//PUT method for USERS
router.put('/edit/:id', function(req, res, next){
	User.findByIdAndUpdate({_id: req.params.id}, req.body).then(function(){
		User.findOne({_id: req.params.id}).then(function(user){
			if(!user)
				res.status(404).send({error: "The requested resource could not be found (special case)"});
			else{
				res.redirect(req.get('referer'));
			}
		});
	}).catch(next);
});

router.get('/edit/:id', function(req, res, next){
	User.findOne({_id: req.params.id}).then(function(user){
		res.render('userEdit', { title: 'Edit user', user : user })
	});
});

//DELETE method for USERS
router.delete('/delete/:id', function(req, res, next){
	User.findByIdAndRemove({_id: req.params.id}).then(function(user){
		if(!user)
			res.status(404).send({error: "The requested resource could not be found (special case)"});
		else
			res.send(user);
	}).catch(next);
});


module.exports = router;