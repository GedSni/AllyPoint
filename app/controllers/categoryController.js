const express = require('express');
const router = express.Router();
const Category = require('../models/category');

//GET method for CATEGORIES
router.get('/', function(req, res, next){
	Category.find({}).then(function(categories){
		res.send(categories);
	});
});

//GET ONE method for CATEGORIES (returns all games in a category)
router.get('/:id', function(req, res, next){
	var result = {};
	Category.findOne({_id: req.params.id}).then(function(category){
		if(!category)
			res.status(404).send({error: "The requested resource could not be found"});
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
router.post('/add', function(req, res, next){
	Category.create(req.body).then(function(category){
		res.send(category);
	}).catch(next);
});

//PUT method for CATEGORIES
router.put('/edit/:id', function(req, res, next){
	Category.findByIdAndUpdate({_id: req.params.id}, req.body).then(function(){
		Category.findOne({_id: req.params.id}).then(function(category){
		if(!category)
				res.status(404).send({error: "The requested resource could not be found"});
			else
				res.send(category);
		});
	}).catch(next);
});

//DELETE method for CATEGORIES
router.delete('/delete/:id', function(req, res, next){
	Category.findByIdAndRemove({_id: req.params.id}).then(function(category){
		if(!category)
			res.status(404).send({error: "The requested resource could not be found"});
		else
			res.send(category);
	}).catch(next);
});

module.exports = router;