import express from "express";
import { ManagerController } from "../../app/http/controllers/admins";

const router = express.Router();

router.get("/", ManagerController.index);
router.get("/all", ManagerController.all);
router.get("/getManagerNoStore", ManagerController.getManagerNoStore);
router.get("/:id", ManagerController.find);
router.post("/", ManagerController.store);
router.put("/:id", ManagerController.update);
router.delete("/:id", ManagerController.delete);

export default router;
