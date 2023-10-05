const User = require('../models/user');

module.exports.registerPage = (req, res, next) => {
    res.render('users/register');
};

module.exports.loginPage = (req, res, next) => {
    res.render('users/login');
};

module.exports.logoutUser = (req, res, next) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        req.flash('success', 'Goodbye!');
        res.redirect('/campgrounds');
    });
};

module.exports.registerUser = async (req, res, next) => {
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
};

module.exports.loginUser = (req, res, next) => {
    req.flash("success", "Welcome to YelpCamp!");
    const redirectUrl = res.locals.returnTo || '/campgrounds';
    res.redirect(redirectUrl);
}