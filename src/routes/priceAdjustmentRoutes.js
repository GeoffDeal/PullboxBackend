import express from "express";
import {
  readAdjustments,
  updateAdjustments,
} from "../controllers/priceAdjustmentController.js";
import { checkAdmin } from "../utils/authChecks.js";

const router = express.Router();

router.get("/", readAdjustments);
router.put("/updateadjustments", checkAdmin, updateAdjustments);

export default router;
