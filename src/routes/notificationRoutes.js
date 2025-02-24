import express from "express";
import {
  createNotification,
  deleteNotification,
  getRecentNotifications,
} from "../controllers/notificationController.js";

const router = express.Router();

router.post("/createnotification", createNotification);
router.delete("/deletenotification/:id", deleteNotification);
router.get("/getnotifications", getRecentNotifications);

export default router;
