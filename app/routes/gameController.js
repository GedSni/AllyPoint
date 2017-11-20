const express = require('express');
const router = express.Router();
const Game = require('../models/game');
var bodyParser = require('body-parser');

router.use(bodyParser.urlencoded({ extended: true }));

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

module.exports = router;