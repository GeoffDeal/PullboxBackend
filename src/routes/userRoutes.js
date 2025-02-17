// Imports
import express from "express";
import {
  getAllUsers,
  getOneUser,
  createUser,
  changeUserStatus,
} from "../controllers/userController.js";

const router = express.Router();

router.get("/", getAllUsers);
router.get("/:id", getOneUser);
router.post("/create", createUser);
router.patch("/:id/status", changeUserStatus);

export default router;
