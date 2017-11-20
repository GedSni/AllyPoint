const jwt = require('jsonwebtoken');

module.exports = function(req,res,next) {
    var token = req.body.token || req.query.token || req.headers['authorization'];
      if (token) {
      // verifies secret and checks exp
          jwt.verify(token, 'my_secret_key', function(err, decoded) {
              if (err) { //failed verification.
                  return res.json({"error": "Verification failed"});
              }
              req.decoded = decoded;
              next(); //no error, proceed
          });
      } else {
          // forbidden without token
          return res.status(403).send({
              "error":"Verification failed"
          });
      }
}