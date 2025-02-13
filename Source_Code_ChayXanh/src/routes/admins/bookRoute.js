import express from "express";

import { BookController } from "../../app/http/controllers/admins";

const route = express.Router();

route.get("/", BookController.index);
route.get("/all", BookController.all);
route.post("/change-store", BookController.changeStore);
route.get("/:id", BookController.find);
route.put("/:id", BookController.update);
route.get("/confirm/:id", BookController.confirm);
route.get("/cancel/:id", BookController.cancel);

module.exports = route;
