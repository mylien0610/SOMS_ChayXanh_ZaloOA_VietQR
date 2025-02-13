class DashboardController {
  // [GET] /admin/dashboard
  index(req, res) {
    if (req.session.user.roleId == 3) {
      return res.redirect("/admin/order");
    }
    res.render("admins/pages/dashboard/index", {
      layout: "admins/layouts/main-layout",
      title: "Dashboard",
    });
  }
}

export default new DashboardController();
