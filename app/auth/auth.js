const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const session = require('express-session');
const User = require('../models/user');
var bodyParser = require('body-parser');

router.use(bodyParser.urlencoded({ extended: true }));

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

  module.exports = router;