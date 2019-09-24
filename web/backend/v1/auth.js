let express = require('express');
let router = express.Router();
let passport  = require('passport');

let authController = require('./controllers/authController.js');
//router.get('/signup', authController.signup);
router.get('/services',isNotLoggedIn, authController.signin);
router.get('/analysis',isLoggedIn, authController.analysis);
router.get('/logout',authController.logout);
/*router.post('/signup', passport.authenticate('local-signup', {
        successRedirect: '/dashboard',
        failureRedirect: '/signup'
    })
);*/
router.post('/services', passport.authenticate('local-signin', {
        successRedirect: '/analysis',
        failureRedirect: '/services',
        failureFlash: true
    })
);

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())    
        return next();         
    res.redirect('/services');
}
function isNotLoggedIn(req, res, next) {
    if (!req.isAuthenticated())    
        return next();
    else         
        res.redirect('/analysis');
}

module.exports = router;