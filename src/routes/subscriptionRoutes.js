import express from "express";
import {
  addSub,
  checkSub,
  getUserSubs,
  removeSub,
} from "../controllers/subscriptionController.js";
import { validateData } from "../utils/validate.js";
import { subscriptionPostSchema } from "../schemas/subscriptionSchema.js";

const router = express.Router();
router.post("/addsub", validateData(subscriptionPostSchema), addSub);
router.delete("/removesub/:id", removeSub);
router.get("/usersubs", getUserSubs);
router.get("/checksub", checkSub);

export default router;
