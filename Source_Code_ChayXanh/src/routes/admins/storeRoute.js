import express from "express";

import { StoreController } from "../../app/http/controllers/admins";

const router = express.Router();

router.get("/", StoreController.index);
router.get("/all", StoreController.all);
router.post("/", StoreController.store);
router.get("/getstoreNotCurrentStore", StoreController.getStoreNotCurrentStore);
router.get(
  "/unassigned-staffs/:storeId/:userId",
  StoreController.unassignedStaffs
);
router.post("/add-staffs", StoreController.addStaffs);
router.get("/:id", StoreController.find);
router.put("/:id", StoreController.update);
router.delete("/:id", StoreController.delete);

export default router;
