import express from "express";
import { addSub, removeSub } from "../controllers/subscriptionController.js";

const router = express.Router();

router.post("/addsub/:id/", addSub);
router.delete("/removesub/:id/", removeSub);

export default router;
