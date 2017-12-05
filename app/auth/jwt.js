const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = function(req,res,next) {
    var token = req.cookies.token;
    if (token) {
        jwt.verify(token, process.env.JWT_SECRET , function(err, decoded) {
            if (err) {
            res.render('404', { title: 'Oops!', asd: 'Token is invalid'})
            }
            req.decoded = decoded;
            next();
        });
    } else {
        res.render('404', { title: 'Oops!', asd: 'Token is invalid'})
    }
}