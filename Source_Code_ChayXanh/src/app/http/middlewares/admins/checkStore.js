function checkStore(req, res, next) {
    // Check session user
    if (!req.session.store) {
        return res.redirect('/admin/choice-store');
    }
    next();
}

export default checkStore;
