import express from "express";
import {
  createNotification,
  deleteNotification,
  getRecentNotifications,
} from "../controllers/notificationController.js";
import { validateData, validateId } from "../utils/validate.js";
import { notificationPostSchema } from "../schemas/notificationSchema.js";

const router = express.Router();

router.post(
  "/createnotification",
  validateData(notificationPostSchema),
  createNotification
);
router.delete("/deletenotification/:id", validateId, deleteNotification);
router.get("/getnotifications", getRecentNotifications);

export default router;
