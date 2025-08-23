import express from "express";
import { checkAdmin } from "../utils/authChecks.js";
import { addReorder } from "../controllers/reordersController.js";
import { validateData } from "../utils/validate.js";
import { reorderPostSchema } from "../schemas/reorderSchema.js";

const router = express.Router();

router.post(
  "/addreorder",
  checkAdmin,
  validateData(reorderPostSchema),
  addReorder
);

export default router;
