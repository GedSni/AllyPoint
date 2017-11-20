var express = require('express');
var router = express.Router();
let verifyToken = require('../auth/auth');

router.use('/categories', verifyToken, require('./categoryController'));
router.use('/countries', verifyToken, require('./countryController'));
router.use('/games', verifyToken, require('./gameController'));
router.use('/users', verifyToken, require('./userController'));
router.use('/user', require('./loginController'));

module.exports = router;