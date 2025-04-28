import express from "express";
import {
  addPull,
  changePullAmount,
  checkPull,
  getUserPulls,
  getWeeksPulls,
  removePull,
} from "../controllers/pullContoller.js";
import { validateData, validateId } from "../utils/validate.js";
import { pullAmountSchema, pullPostSchema } from "../schemas/pullSchema.js";
import { checkAdmin, checkSignIn } from "../utils/authChecks.js";

const router = express.Router();

router.post("/addpull", checkSignIn, validateData(pullPostSchema), addPull);

router.patch(
  "/changepullamount/:id",
  checkSignIn,
  validateId,
  validateData(pullAmountSchema),
  changePullAmount
);
router.delete("/removepull/:id", checkSignIn, validateId, removePull);
router.get("/checkpull", checkSignIn, checkPull);
router.get("/getuserpulls", checkSignIn, getUserPulls);
router.get("/getweekspulls", checkAdmin, getWeeksPulls);

export default router;
