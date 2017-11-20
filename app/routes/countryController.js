const express = require('express');
const router = express.Router();
const Country = require('../models/country');
var bodyParser = require('body-parser');

router.use(bodyParser.urlencoded({ extended: true }));

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