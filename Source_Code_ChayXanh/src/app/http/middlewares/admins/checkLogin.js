function checkLogin(req, res, next) {
    // Check session user
    if (!req.session.user) {
        return res.redirect('/admin/login');
    }
    next();
}

export default checkLogin;
