import express from "express";
import { checkAdmin } from "../utils/authChecks.js";
import {
  addReorder,
  getCustomerReorders,
  getReorders,
} from "../controllers/reordersController.js";
import { validateData, validateId } from "../utils/validate.js";
import { reorderPostSchema } from "../schemas/reorderSchema.js";

const router = express.Router();

router.post(
  "/addreorder",
  checkAdmin,
  validateData(reorderPostSchema),
  addReorder
);
router.get("/getreorders", checkAdmin, getReorders);
router.get(
  "/getcustomerreorders/:id",
  checkAdmin,
  validateId,
  getCustomerReorders
);

export default router;
