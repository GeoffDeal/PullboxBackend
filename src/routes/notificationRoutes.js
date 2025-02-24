import express from "express";
import { createNotification } from "../controllers/notificationController.js";

const router = express.Router();

router.post("/createnotification", createNotification);

export default router;
