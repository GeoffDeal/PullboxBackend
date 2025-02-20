import express from "express";
import {
  addSub,
  removeSub,
  subsToPulls,
} from "../controllers/subscriptionController.js";

const router = express.Router();

router.post("/addsub", addSub);
router.delete("/removesub/:id", removeSub);

router.get("/substopulls", subsToPulls); //Temp for testing

export default router;
