// Imports
import express from "express";
import {
  getAllUsers,
  getOneUser,
  createUser,
  changeUserStatus,
  updateUser,
  addPull,
  removePull,
} from "../controllers/userController.js";

const router = express.Router();

router.get("/", getAllUsers);
router.get("/:id", getOneUser);
router.post("/create", createUser);
router.patch("/:id/status", changeUserStatus);
router.patch("/:id/update", updateUser);
router.post("/:id/addpull", addPull);
router.delete("/:id/removepull", removePull);

export default router;
