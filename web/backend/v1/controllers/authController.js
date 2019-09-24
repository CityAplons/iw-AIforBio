/*exports.signup = function(req, res) {
     res.render('signup');
}*/
exports.signin = function(req, res) {
    res.render('services');
}
exports.analysis = function(req, res) {
    res.render('analysis',{
        name: req.user.name,
        surname: req.user.surname,
        username: req.user.username,
        id: req.user.id
    });
}
exports.logout = function(req, res) {
    req.session.destroy(function(err) {
        res.redirect('/services');
    });
}