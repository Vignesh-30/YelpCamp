const express = require('express');
const router = express.Router();
const passport = require('passport');
const user = require('../controllers/users');
const catchAsync = require('../utilities/CatchAsync');
const { storeReturnTo } = require('../middleware');

router.get('/register', user.registerPage)

router.get('/login', user.loginPage)


router.get('/logout', user.logoutUser);

router.post('/register', catchAsync(user.registerUser));

router.post('/login', storeReturnTo, passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), user.loginUser)



module.exports = router;