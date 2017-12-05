const session = require('express-session');

module.exports = function(req,res,next) {
	if (req.session && req.session.user && req.session.admin)
	    return next();
    else
        res.render('404', { title: 'Oops!', asd: 'You must be an admin to access this page'})
}
