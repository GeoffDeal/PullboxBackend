// Imports
import express from "express";
import {
  getAllUsers,
  getOneUser,
  createUser,
  changeUserStatus,
  updateUser,
} from "../controllers/userController.js";
import { validateData } from "../utils/validate.js";
import { userCreateSchema, userStatusSchema } from "../schemas/userSchema.js";

const router = express.Router();

router.get("/", getAllUsers);
router.get("/:id(\\d+)", getOneUser);
router.post("/create", validateData(userCreateSchema), createUser);
router.patch("/status/:id", validateData(userStatusSchema), changeUserStatus);
router.patch("/update/:id", updateUser);

export default router;
