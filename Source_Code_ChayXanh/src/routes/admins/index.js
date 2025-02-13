import express from "express";
import {
  passLocals,
  checkLogin,
  checkStore,
} from "../../app/http/middlewares/admins";
import { DashboardController } from "../../app/http/controllers/admins";
import { AuthController } from "../../app/http/controllers/admins";
import { OrderController } from "../../app/http/controllers/admins";

// Route
import staffRoute from "./staffRoute";
import storeRoute from "./storeRoute";
import categoryRoute from "./categoryRoute";
import typeOfFoodRoute from "./typeOfFoodRoute";
import tableRoute from "./tableRoute";
import voucherRoute from "./voucherRoute";
import productRoute from "./productRoute";
import customerRoute from "./customerRoute";
import managerRoute from "./managerRoute";
import orderRoute from "./orderRoute";
import bookRoute from "./bookRoute";

// Config
import { adminRoutes } from "../../configs";

const route = express.Router();

// Auth route
route.get("/login", AuthController.index);
route.post("/signup", AuthController.signup);

// Check user login
route.use(checkLogin);

// Middleware handle pass local
route.use(passLocals);

route.get("/logout", AuthController.logout);
route.post("/change-pass", AuthController.changePassword);

// Choice store
route.get("/choice-store", AuthController.choiceStore);
route.get("/save-choice-store/:id", AuthController.saveChoiceStore);

// Check choice store
route.use(checkStore);

// Save data use & store
route.use((req, res, next) => {
  res.locals.user = req.session.user;
  res.locals.store = req.session.store;
  next();
});

// Dashboard route
route.get("/", DashboardController.index);
// User route
route.use(adminRoutes.url.staff.path, staffRoute);
// Store route
route.use(adminRoutes.url.store.path, storeRoute);
// Category route
route.use(adminRoutes.url.category.path, categoryRoute);
// Type of food route
route.use(adminRoutes.url.typeOfFood.path, typeOfFoodRoute);
// Table route
route.use(adminRoutes.url.table.path, tableRoute);
// Voucher route
route.use(adminRoutes.url.voucher.path, voucherRoute);
// Product route
route.use(adminRoutes.url.food.path, productRoute);
// Customer route
route.use(adminRoutes.url.customer.path, customerRoute);
// Manager route
route.use(adminRoutes.url.manager.path, managerRoute);
// Order route
route.use(adminRoutes.url.order.path, orderRoute);
// Book route
route.use(adminRoutes.url.book.path, bookRoute);

// Order History
route.get("/order-history", OrderController.history);
route.get("/order-history-data", OrderController.historyData);

export default route;
