import express from "express";
import {
  addSub,
  checkSub,
  getUserSubs,
  removeSub,
} from "../controllers/subscriptionController.js";
import { validateData, validateId } from "../utils/validate.js";
import { subscriptionPostSchema } from "../schemas/subscriptionSchema.js";
import { checkSignIn } from "../utils/authChecks.js";

const router = express.Router();
router.post(
  "/addsub",
  checkSignIn,
  validateData(subscriptionPostSchema),
  addSub
);
router.delete("/removesub/:id", checkSignIn, validateId, removeSub);
router.get("/usersubs", checkSignIn, getUserSubs);
router.get("/checksub", checkSignIn, checkSub);

export default router;
