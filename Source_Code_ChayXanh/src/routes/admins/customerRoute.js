import express from "express";
import { CustomerController } from "../../app/http/controllers/admins";

const router = express.Router();

router.get("/", CustomerController.index);
router.get("/all", CustomerController.all);
router.get("/check-point-member", CustomerController.checkPointMember);
router.get("/get-order-history/:id", CustomerController.getOrdersHistory);
router.get("/:id", CustomerController.find);
router.post("/", CustomerController.store);
router.put("/:id", CustomerController.update);
router.delete("/:id", CustomerController.delete);

export default router;
