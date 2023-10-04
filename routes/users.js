const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../models/user');
const catchAsync = require('../utilities/CatchAsync');
const { storeReturnTo } = require('../middleware');

router.get('/register', (req, res, next) => {
    res.render('users/register');
})

router.get('/login', (req, res, next) => {
    res.render('users/login');
})


router.get('/logout', (req, res, next) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        req.flash('success', 'Goodbye!');
        res.redirect('/campgrounds');
    });
});

router.post('/register', catchAsync(async (req, res, next) => {
    const { email, username, password } = req.body;
    const user = new User({ email, username });
    try {
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, function(err) {
            if (err) { throw err; }
            req.flash('success', "Welcome to YelpCamp!");
            res.redirect('/campgrounds');
          });
        
    } catch (e) {
        req.flash('error', e.message);
        res.redirect('/register');
    }
}))

router.post('/login', storeReturnTo, passport.authenticate('local', { failureFlash:true, failureRedirect: '/login' }), (req, res, next) => {
    req.flash("success", "Welcome to YelpCamp!");
    const redirectUrl = res.locals.returnTo || '/campgrounds';
    res.redirect(redirectUrl);
})



module.exports = router;