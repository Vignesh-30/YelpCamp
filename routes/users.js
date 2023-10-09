const express = require('express');
const router = express.Router();
const passport = require('passport');
const user = require('../controllers/users');
const catchAsync = require('../utilities/CatchAsync');
const { storeReturnTo } = require('../middleware');

router.route('/register')
    .get(user.registerPage)
    .post(catchAsync(user.registerUser))

router.route('/login')
    .get(user.loginPage)
    .post(storeReturnTo, passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), user.loginUser)

router.get('/logout', user.logoutUser);

module.exports = router;