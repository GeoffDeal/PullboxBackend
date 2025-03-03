import express from "express";
import {
  addSub,
  getUserSubs,
  removeSub,
} from "../controllers/subscriptionController.js";

const router = express.Router();
router.post("/addsub", addSub);
router.delete("/removesub/:id", removeSub);
router.get("/usersubs", getUserSubs);

export default router;
