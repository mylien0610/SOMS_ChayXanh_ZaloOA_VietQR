function checkLogin(req, res, next) {
  // Check session user
  if (!req.session.customer) {
    return res.redirect("/login");
  }
  next();
}

export default checkLogin;
