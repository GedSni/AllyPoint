const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const session = require('express-session');
const User = require('../models/user');
const Game = require('../models/game');
const Category = require('../models/category');
const Country = require('../models/country');

//JWT middleware
function ensureToken(req, res, next) {
  const bearerHeader = req.headers["authorization"];
  if (typeof bearerHeader !== 'undefined') {
    const bearer = bearerHeader.split(" ");
    const bearerToken = bearer[1];
    req.token = bearerToken;
    next();
  } else {
    res.status(403).send({error: "Token undefined"});
  }
}

//REGISTER (POST USER)
router.post('/register', function(req, res){
	User.create(req.body).then(function(user){
		res.status(201);
		res.send(user);
	}).catch(next);
});

//DASHBOARD, session, jwt
router.get('/dashboard', ensureToken, function(req, res){
	jwt.verify(req.token, 'my_secret_key', function(err){
		if(err){
			return res.status(403).send({error: "Token undefined"});
		}
		else{
			if(!req.session.user){
				return res.status(401).send();
			}
			return res.status(200).send("Logged in");
		}
	});	
});

//LOGIN, session, jwt
router.post('/login', function(req, res){
	var username = req.body.username;
	var password = req.body.password;
	
	User.findOne({username: username, password: password}, function(err, user){
		if(err)
			return res.status(500).send({error: "Logic credentials incorrect"});
		if(!user)
			return res.status(404).send({error: "The requested resource could not be found (special case)"});
		
		const token = jwt.sign({ user }, 'my_secret_key');
		req.session.user = user;
		res.json({
			token: token
		});
	});
});

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
	Console.log(req.params.id + " // " + req.body.friend);
	if(req.params.id != req.body.friend){
		User.findOne({_id: req.params.id}).then(function(user){
			if(!user)
				res.status(404).send({error: "The requested resource could not be found (special case)"});
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
							res.status(404).send({error: "The requested resource could not be found (special case)"});
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

//GET method for GAMES
router.get('/games', function(req, res, next){
	Game.find({}).then(function(games){
		res.send(games);
	});
});

//GET ONE method for GAME (returns all users filtered by a game and the games info)
router.get('/games/:id', function(req, res, next){
	var result = {};
	Game.findOne({_id: req.params.id}).then(function(game){
		if(!game)
			res.status(404).send({error: "The requested resource could not be found (special case)"});
		else
		{
			result.game = game;
			User.find({game: req.params.id}).then(function(user){
				if(!user.length)
					res.send(result);
					else
					{
						result.user = user;
						res.send(result);
					}
			}).catch(next);
		}
	}).catch(next);
});


//POST method for GAMES
router.post('/games', function(req, res, next){
	Game.create(req.body).then(function(game){
		res.send(game);
	}).catch(next);
});

//PUT method for GAMES
router.put('/games/:id', function(req, res, next){
	Game.findByIdAndUpdate({_id: req.params.id}, req.body).then(function(){
		Game.findOne({_id: req.params.id}).then(function(game){
			if(!game)
				res.status(404).send({error: "The requested resource could not be found (special case)"});
			else
				res.send(game);
		});
	}).catch(next);
});

//DELETE method for GAMES
router.delete('/games/:id', function(req, res, next){
	Game.findByIdAndRemove({_id: req.params.id}).then(function(game){
		if(!game)
			res.status(404).send({error: "The requested resource could not be found (special case)"});
		else
			res.send(game);
	}).catch(next);
});

//GET method for CATEGORIES
router.get('/categories', function(req, res, next){
	Category.find({}).then(function(categories){
		res.send(categories);
	});
});

//GET ONE method for CATEGORIES (returns all games in a category)
router.get('/categories/:id', function(req, res, next){
	var result = {};
	Category.findOne({_id: req.params.id}).then(function(category){
		if(!category)
			res.status(404).send({error: "The requested resource could not be found (special case)"});
		else
		{
			result.category = category;
			Game.find({category: req.params.id}).then(function(game){
				if(!game.length)
					res.send(result);
					else
					{
						result.game = game;
						res.send(result);
					}
			}).catch(next);
		}
	}).catch(next);
});

//POST method for CATEGORIES
router.post('/categories', function(req, res, next){
	Category.create(req.body).then(function(category){
		res.send(category);
	}).catch(next);
});

//PUT method for CATEGORIES
router.put('/categories/:id', function(req, res, next){
	Category.findByIdAndUpdate({_id: req.params.id}, req.body).then(function(){
		Category.findOne({_id: req.params.id}).then(function(category){
		if(!category)
				res.status(404).send({error: "The requested resource could not be found (special case)"});
			else
				res.send(category);
		});
	}).catch(next);
});

//DELETE method for CATEGORIES
router.delete('/categories/:id', function(req, res, next){
	Category.findByIdAndRemove({_id: req.params.id}).then(function(category){
		if(!category)
			res.status(404).send({error: "The requested resource could not be found (special case)"});
		else
			res.send(category);
	}).catch(next);
});

//GET ONE method for COUNTRIES (returns all users filtered by a country and the country's info)
router.get('/countries/:id', function(req, res, next){
	var result = {};
	Country.findOne({_id: req.params.id}).then(function(country){
		if(!country)
			res.status(404).send({error: "The requested resource could not be found (special case)"});
		else
		{
			result.country = country;
			User.find({country: req.params.id}).then(function(user){
				if(!user.length)
					res.send(result);
					else
					{
						result.user = user;
						res.send(result);
					}
			}).catch(next);
		}
	}).catch(next);
});

//GET method for COUNTRIES
router.get('/countries', function(req, res, next){
	Country.find({}).then(function(countries){
		res.send(countries);
	});
});

//POST method for COUNTRIES
router.post('/countries', function(req, res, next){
	Country.create(req.body).then(function(countries){
		res.send(countries);
	}).catch(next);
});

//PUT method for COUNTRIES
router.put('/countries/:id', function(req, res, next){
	Country.findByIdAndUpdate({_id: req.params.id}, req.body).then(function(){
		Country.findOne({_id: req.params.id}).then(function(countries){
			if(!countries)
				res.status(404).send({error: "The requested resource could not be found (special case)"});
			else
				res.send(countries);
		});
	}).catch(next);
});

//DELETE method for COUNTRIES
router.delete('/countries/:id', function(req, res, next){
	Country.findByIdAndRemove({_id: req.params.id}).then(function(countries){
		if(!countries)
			res.status(404).send({error: "The requested resource could not be found (special case)"});
		else
			res.send(countries);
	}).catch(next);
});


module.exports = router;


//Error handling sample
					
/*function (err, res) {
	console.log('Error=' + err); 
	if (err){
		console.log('Error in fetching games for a specific category' + err);
		return (err);
	}
	console.log('Success in fetching data' + JSON.stringify(res)); 
	response.send(JSON.stringify(res));
}*/
					
//Aggregate sample	
	
/*
db.mycollection.aggregate(
    { $group: { 
        // Group by fields to match on (a,b)
        _id: { a: "$a", b: "$b" },

        // Count number of matching docs for the group
        count: { $sum:  1 },

        // Save the _id for matching docs
        docs: { $push: "$_id" }
    }},

    // Limit results to duplicates (more than 1 match) 
    { $match: {
        count: { $gt : 1 }
    }}
)*/

//Pyramid sample
/*var findRoute = router.route("/find");
var json = {};

findRoute.get(function(req, res) {
  Box.find(function(err, boxes) {
    json.boxes = boxes;

    Collection2.find(function (error, coll2) {
      json.coll2 = coll2;

      Collection3.find(function (error, coll3) {
        json.coll3 = coll3;

        res.json(json);
      }).sort("-size");
    }).sort("-name");
  }).sort("-itemCount");
});*/