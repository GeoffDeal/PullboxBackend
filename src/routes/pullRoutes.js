import express from "express";
import {
  addPull,
  changePullAmount,
  checkPull,
  getUserPulls,
  getWeeksPulls,
  removePull,
} from "../controllers/pullContoller.js";
import { validateData } from "../utils/validate.js";
import { pullAmountSchema, pullPostSchema } from "../schemas/pullSchema.js";
import { checkAdmin } from "../utils/authChecks.js";

const router = express.Router();

router.post("/addpull", validateData(pullPostSchema), addPull);

router.patch(
  "/changepullamount/:id",
  validateData(pullAmountSchema),
  changePullAmount
);
router.delete("/removepull/:id", removePull);
router.get("/checkpull", checkPull);
router.get("/getuserpulls", getUserPulls);
router.get("/getweekspulls", checkAdmin, getWeeksPulls);

export default router;
