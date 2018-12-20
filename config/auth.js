module.exports = {
    ensureAuthenticated: function(req, res, next){
        if(req.isAuthenticated()){
            return next();
        }
        req.flash('error_message', 'You have to log-in first');
        req.session.returnTo = req.originalUrl;
        res.redirect('login');
    }
}