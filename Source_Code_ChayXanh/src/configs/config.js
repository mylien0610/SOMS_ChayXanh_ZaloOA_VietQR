const baseUrlAdmin = "/admin";
const baseUrlCustomer = "/";

const adminRoutes = {
  base: baseUrlAdmin,
  url: {
    home: {
      path: `/`,
      child: {
        index: "/",
      },
    },
    store: {
      path: "/stores",
      child: {
        index: "/",
      },
    },
    table: {
      path: `/tables`,
      child: {
        index: "/",
      },
    },
    staff: {
      path: "/staffs",
      child: {
        index: "/",
      },
    },
    voucher: {
      path: "/vouchers",
      child: {
        index: "/",
      },
    },
    setting: {
      path: "/settings",
      child: {
        index: "/",
      },
    },
    customer: {
      path: "/customers",
      child: {
        index: "/",
      },
    },
    food: {
      path: "/foods",
      child: {
        index: "/",
      },
    },
    category: {
      path: "/categories",
      child: {
        index: "/",
      },
    },
    typeOfFood: {
      path: "/type-of-food",
      child: {
        index: "/",
      },
    },
    orderFood: {
      path: "/order-food",
      child: {
        index: "/",
      },
    },
    order: {
      path: "/order",
      child: {
        index: "/",
      },
    },
    orderHistory: {
      path: "/order-history",
      child: {
        index: "/",
      },
    },
    manager: {
      path: "/managers",
      child: {
        index: "/",
      },
    },
    book: {
      path: "/books",
      child: {
        index: "/",
      },
    },
  },
};

const customerRoutes = {
  base: baseUrlCustomer,
  home: { index: `${baseUrlCustomer}` },
};

const session = {
  secret: "keyboard cat",
  resave: false,
  saveUninitialized: false,
};

export { session, adminRoutes, customerRoutes };
