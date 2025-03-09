import express from "express";
import {
  addSub,
  getUserSubs,
  removeSub,
} from "../controllers/subscriptionController.js";
import { validateData, validateId } from "../utils/validate.js";
import { subscriptionPostSchema } from "../schemas/subscriptionSchema.js";

const router = express.Router();
router.post("/addsub", validateData(subscriptionPostSchema), addSub);
router.delete("/removesub/:id", validateId, removeSub);
router.get("/usersubs", getUserSubs);

export default router;
