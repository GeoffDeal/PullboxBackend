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

const router = express.Router();

router.post("/addpull", validateData(pullPostSchema), addPull);
// router.post("/addpull", (req, res) => {
//   console.log("Add pull hit", req.body);
//   res.json({ success: true });
// });
router.patch(
  "/changepullamount/:id",
  validateId,
  validateData(pullAmountSchema),
  changePullAmount
);
router.delete("/removepull/:id", validateId, removePull);
router.get("/checkpull", checkPull);
router.get("/getuserpulls", getUserPulls);
router.get("/getweekspulls", getWeeksPulls);

export default router;
