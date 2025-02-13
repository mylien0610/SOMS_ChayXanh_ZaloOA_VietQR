import { adminRoutes as routes } from "../../../../configs";

function passLocals(req, res, next) {
  const pathUrls = req.originalUrl.split("/");
  const currentUrl = pathUrls[2] ? pathUrls[2] : "/";

  const menu = [
    {
      path: routes.url.home.path,
      title: "Phân tích",
      icon: `fa-solid fa-chart-line`,
      tag: "Cửa hàng",
      isActive: routes.url.home.path === currentUrl,
      display: [1, 2].includes(req.session.user.roleId),
    },
    {
      path: routes.url.table.path,
      title: "Danh sách bàn ăn",
      icon: `fa fa-table`,
      tag: "Cửa hàng",
      isActive: routes.url.table.path === "/" + currentUrl,
      display: [1].includes(req.session.user.roleId),
    },

    {
      path: routes.url.order.path,
      title: "Quản lý bàn ăn",
      icon: `fa-regular fa-newspaper`,
      tag: "Cửa hàng",
      isActive: routes.url.order.path === "/" + currentUrl,
      display: [1, 2, 3].includes(req.session.user.roleId),
    },
    {
      path: routes.url.orderHistory.path,
      title: "Hóa đơn bán hàng",
      icon: `fa-solid fa-money-bills`,
      tag: "Cửa hàng",
      isActive: routes.url.orderHistory.path === "/" + currentUrl,
      display: [1, 2, 3].includes(req.session.user.roleId),
    },
    {
      path: routes.url.book.path,
      title: "Quản lý đặt bàn",
      icon: `fa-solid  fa-house-flood-water-circle-arrow-right`,
      tag: "Cửa hàng",
      isActive: routes.url.book.path === "/" + currentUrl,
      display: [1, 2, 3].includes(req.session.user.roleId),
    },
    { 
      path: routes.url.store.path,
      title: "Quản lý chi nhánh",
      icon: `fa fa-shop`,
      tag: "Quản lý chung",
      isActive: routes.url.store.path === "/" + currentUrl,
      display: [1].includes(req.session.user.roleId),
    },
    {
      path: routes.url.food.path,
      title: "Quản lý món ăn", 
      icon: `fa fa-utensils`,
      tag: "Quản lý chung",
      isActive: routes.url.food.path === "/" + currentUrl,
      display: [1].includes(req.session.user.roleId),
    },
    // {
    //   path: routes.url.typeOfFood.path,
    //   title: "Quản lý loại món ăn",
    //   icon: `fa fa-font-awesome`,
    //   tag: "Quản lý chung",
    //   isActive: routes.url.typeOfFood.path === "/" + currentUrl,
    //   display: [1].includes(req.session.user.roleId),
    // },
    {
      path: routes.url.category.path,
      title: "Quản lý danh mục",
      icon: `fa-solid fa-clipboard-list`,
      tag: "Quản lý chung",
      isActive: routes.url.category.path === "/" + currentUrl,
      display: [1].includes(req.session.user.roleId),
    },

    {
      path: routes.url.voucher.path,
      title: "Quản lý khuyến mãi",
      icon: `fa-regular fa-percent`,
      tag: "Quản lý chung",
      isActive: routes.url.voucher.path === "/" + currentUrl,
      display: [1].includes(req.session.user.roleId),
    },
    {
      path: routes.url.manager.path,
      title: "Cửa hàng trưởng",
      icon: `fa-solid fa-user-lock`,
      tag: "Quản lý tài khoản",
      isActive: routes.url.manager.path === "/" + currentUrl,
      display: [1].includes(req.session.user.roleId),
    },
    {
      path: routes.url.customer.path,
      title: "Quản lý khách hàng",
      icon: `fa fa-users`,
      tag: "Quản lý tài khoản",
      isActive: routes.url.customer.path === "/" + currentUrl,
      display: [1, 2].includes(req.session.user.roleId),
    },
    {
      path: routes.url.staff.path,
      title: "Quản lý nhân viên",
      icon: `fa-solid fa-clipboard-user`,
      tag: "Quản lý tài khoản",
      isActive: routes.url.staff.path === "/" + currentUrl,
      display: [1, 2].includes(req.session.user.roleId),
    },
  ];

  // Menu Admin pass to view
  res.locals.menu = menu;
  res.locals.baseUrl = routes.base;
  res.locals.currentUrl = currentUrl;

  next();
}

export default passLocals;
