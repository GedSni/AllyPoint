var express = require('express');
var router = express.Router();
let verifyToken = require('../auth/jwt');
let verifyUser = require('../auth/session');

router.use('/categories', verifyUser, verifyToken, require('./categoryController'));
router.use('/countries', verifyUser, verifyToken, require('./countryController'));
router.use('/games', verifyUser, verifyToken, require('./gameController'));
router.use('/users', verifyUser, verifyToken, require('./userController'));
router.use('/user', require('./loginController'));
router.use('/', require('./homeController'));

module.exports = router;