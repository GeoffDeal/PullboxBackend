// Imports
import express from "express";
import {
  getAllUsers,
  getOneUser,
  createUser,
  changeUserStatus,
  updateUser,
} from "../controllers/userController.js";

const router = express.Router();

router.get("/", getAllUsers);
router.get("/:id(\\d+)", getOneUser);
router.post("/create", createUser);
router.patch("/status/:id", changeUserStatus);
router.patch("/update/:id", updateUser);

export default router;
