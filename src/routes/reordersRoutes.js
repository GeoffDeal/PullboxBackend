import express from "express";
import { checkAdmin } from "../utils/authChecks.js";
import {
  addReorder,
  changeReorderStatus,
  getCustomerReorders,
  getReorders,
} from "../controllers/reordersController.js";
import { validateData, validateId } from "../utils/validate.js";
import {
  reorderPatchSchema,
  reorderPostSchema,
} from "../schemas/reorderSchema.js";

const router = express.Router();

router.post(
  "/addreorder",
  checkAdmin,
  validateData(reorderPostSchema),
  addReorder
);
router.get("/getreorders/:filter", checkAdmin, getReorders);
router.get(
  "/getcustomerreorders/:id",
  checkAdmin,
  validateId,
  getCustomerReorders
);
router.patch(
  "/changereorderstatus/:id",
  checkAdmin,
  validateData(reorderPatchSchema),
  changeReorderStatus
);

export default router;
