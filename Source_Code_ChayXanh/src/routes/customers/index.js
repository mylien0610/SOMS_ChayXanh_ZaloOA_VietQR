import express from "express";
const route = express.Router();
const homeRoute = require("./homeRoute");
const orderRoute = require("./orderRoute");
const { AuthController } = require("../../app/http/controllers/customers");
const { checkLogin } = require("../../app/http/middlewares/customers");

route.get("/login", AuthController.login);
route.post("/login", AuthController.submitLogin);
route.get("/register", AuthController.register);
route.get("/forgot-password", AuthController.forgotPassword);
route.post("/forgot-password", AuthController.submitForgotPassword);
route.post("/sign-up", AuthController.signup);

// Save data customer
route.use((req, res, next) => {
  res.locals.customer = req.session.customer;
  next();
});

route.use("/", homeRoute);

route.get("/logout", checkLogin, AuthController.logout);
route.get("/profile", checkLogin, AuthController.profile);
route.use("/order", checkLogin, orderRoute);

export default route;
