const session = require('express-session');

module.exports = function(req,res,next) {
	if (req.session && req.session.user)
	    return next();
    else
        res.render('404', { title: 'Oops!', asd: 'You must be logged in to access this page'})
}
