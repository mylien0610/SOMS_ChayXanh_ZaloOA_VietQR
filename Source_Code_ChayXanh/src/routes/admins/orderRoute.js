import express from "express";

import { OrderController } from "../../app/http/controllers/admins";

const route = express.Router();

route.get("/", OrderController.index);
route.get("/average-revenue", OrderController.getAverageRevenuePerDay);
route.get("/send-otp", OrderController.sendCodeOtpPointMember);
route.post("/verify-otp", OrderController.verifyOtp);
route.get("/detail/:id", OrderController.getDetail);
route.get("/:id", OrderController.show);
route.get("/getOrder/:orderId", OrderController.getOrder);
route.get("/:orderId/addVoucher/:voucherId", OrderController.addVoucher);
route.get("/remove/:orderId", OrderController.removeVoucher);
route.get("/checkout/:orderId", OrderController.checkout);
route.post("/checkout/:orderId", OrderController.confirmOrderPayment);
route.get("/add/:tableId/:productId", OrderController.addProduct);
route.get("/:orderId/:tableId/:productId", OrderController.updateOrderDetail);

export default route;
