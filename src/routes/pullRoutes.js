import express from "express";
import {
  addPull,
  changePullAmount,
  checkPull,
  removePull,
} from "../controllers/pullContoller.js";

const router = express.Router();

router.post("/addpull", addPull);
router.patch("/changepullamount/:id", changePullAmount);
router.delete("/removepull/:id", removePull);
router.get("/checkpull", checkPull);

export default router;
