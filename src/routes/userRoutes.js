// Imports
import express from "express";
import {
  getAllUsers,
  getOneUser,
  createUser,
} from "../controllers/userController.js";

const router = express.Router();

router.get("/", getAllUsers);
router.get("/:id", getOneUser);
router.post("/create", createUser);

export default router;
