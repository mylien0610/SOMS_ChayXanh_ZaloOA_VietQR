const express = require("express");

const { HomeController } = require("../../app/http/controllers/customers");

const route = express.Router();

route.get("/", HomeController.index);

module.exports = route;
