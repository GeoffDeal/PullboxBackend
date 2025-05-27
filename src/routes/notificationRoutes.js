import express from "express";
import {
  createNotification,
  deleteNotification,
  getRecentNotifications,
} from "../controllers/notificationController.js";
import { validateData } from "../utils/validate.js";
import { notificationPostSchema } from "../schemas/notificationSchema.js";
import { checkAdmin } from "../utils/authChecks.js";

const router = express.Router();

router.post(
  "/createnotification",
  checkAdmin,
  validateData(notificationPostSchema),
  createNotification
);
router.delete("/deletenotification/:id", checkAdmin, deleteNotification);
router.get("/getnotifications", getRecentNotifications);

export default router;
