exports.home = function(req, res) {
    res.render('index');
}
exports.about = function(req, res) {
   res.render('about');
}
exports.services = function(req, res) {
    res.render('services', {error: req.flash('error')});
 }
/*
exports.dashboard = function(req, res) {
   res.render('dashboard',{
       username: req.user.username,
       id: req.user.id
   });
}
exports.logout = function(req, res) {
   req.session.destroy(function(err) {
       res.redirect('/');
   });
}*/