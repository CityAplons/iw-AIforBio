let express = require('express');
let router = express.Router();

let coreController = require('./controllers/coreController.js');
router.get('/', coreController.home);
router.get('/about', coreController.about);
router.get('/services', coreController.services);

/*
router.get('/analysis',isLoggedIn, authController.dashboard);
router.get('/logout',authController.logout);
router.post('/services', passport.authenticate('local-signup', {
        successRedirect: '/analysis',
        failureRedirect: '/services'
    })
);*/
/*
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())    
        return next();         
    res.redirect('/');
}
function isNotLoggedIn(req, res, next) {
    if (!req.isAuthenticated())    
        return next();         
    res.redirect('/dashboard');
}*/

module.exports = router;