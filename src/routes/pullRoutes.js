import express from "express";
import {
  addPull,
  changePullAmount,
  removePull,
} from "../controllers/pullContoller.js";

const router = express.Router();

router.post("/addpull/:id", addPull);
router.patch("/changepullamount/:id", changePullAmount);
router.delete("/removepull/:id", removePull);

export default router;
