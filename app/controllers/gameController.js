const express = require('express');
const router = express.Router();
const Game = require('../models/game');
const User = require('../models/user');

//GET method for GAMES
router.get('/', function(req, res, next){
	Game.find({}).then(function(games){
		res.render('games', { title: 'Games', games : games })
	});
});

//GET ONE method for GAME (returns all users filtered by a game and the games info)
router.get('/:id', function(req, res, next){
	var result = {};
	Game.findOne({_id: req.params.id}).then(function(game){
		if(!game)
			res.status(404).send({error: "The requested resource could not be found (special case)"});
		else
		{
			result.game = game;
			User.find({game: req.params.id}).then(function(users){
				if(!users.length)
					res.render('game', { title: result.game.name, game : game, users : users })
					else
					{
						result.users = users;
						console.log(game);
						console.log(users);
						res.render('game', { title: result.game.name, game : game, users : users })
					}
			}).catch(next);
		}
	}).catch(next);
});


//POST method for GAMES
router.post('/add', function(req, res, next){
	Game.create(req.body).then(function(game){
		res.send(game);
	}).catch(next);
});

//PUT method for GAMES
router.put('/edit/:id', function(req, res, next){
	Game.findByIdAndUpdate({_id: req.params.id}, req.body).then(function(){
		Game.findOne({_id: req.params.id}).then(function(game){
			if(!game)
				res.status(404).send({error: "The requested resource could not be found (special case)"});
			else{
				res.render('game', { title: game.name, game : game})
			}
		});
	}).catch(next);
});

router.get('/edit/:id', function(req, res, next){
	Game.findOne({_id: req.params.id}).then(function(game){
		res.render('gameEdit', { title: 'Edit game', game : game })
	});
});

//DELETE method for GAMES
router.delete('/delete/:id', function(req, res, next){
	Game.findByIdAndRemove({_id: req.params.id}).then(function(game){
		if(!game)
			res.status(404).send({error: "The requested resource could not be found (special case)"});
		else
			res.send(game);
	}).catch(next);
});

module.exports = router;