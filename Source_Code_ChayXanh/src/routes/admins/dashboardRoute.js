import express from "express";

import { DashboardController } from "../../app/http/controllers/admins";

import { adminRoutes } from "../../configs";

const route = express.Router();
const urlPage = adminRoutes.url.home;

route.get(urlPage.child.index, BrandController.index);

export default route;
