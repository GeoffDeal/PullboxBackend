import express from "express";
import {
  addPull,
  changePullAmount,
  checkPull,
  getUserPulls,
  getWeeksPulls,
  removePull,
} from "../controllers/pullContoller.js";
import { validateId } from "../utils/validate.js";

const router = express.Router();

router.post("/addpull", addPull);
router.patch("/changepullamount/:id", validateId, changePullAmount);
router.delete("/removepull/:id", validateId, removePull);
router.get("/checkpull", checkPull);
router.get("/getuserpulls", getUserPulls);
router.get("/getweekspulls", getWeeksPulls);

export default router;
