import express from "express";
import {
  readAdjustments,
  updateAdjustments,
} from "../controllers/priceAdjustmentController.js";

const router = express.Router();

router.get("/", readAdjustments);
router.put("/updateadjustments", updateAdjustments);

export default router;
