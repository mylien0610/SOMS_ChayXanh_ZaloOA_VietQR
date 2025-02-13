const express = require("express");

const route = express.Router();

const { OrderController } = require("../../app/http/controllers/customers");

route.get("/", OrderController.index);
route.post("/booking", OrderController.submitBooking);
route.get("/order-history", OrderController.orderHistory);

module.exports = route;
