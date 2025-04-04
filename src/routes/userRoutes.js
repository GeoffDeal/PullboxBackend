// Imports
import express from "express";
import {
  getOneUser,
  createUser,
  changeUserStatus,
  updateUser,
  getAllCustomers,
} from "../controllers/userController.js";
import { validateData, validateId } from "../utils/validate.js";
import {
  userCreateSchema,
  userStatusSchema,
  userUpdateSchema,
} from "../schemas/userSchema.js";

const router = express.Router();

router.get("/customers", getAllCustomers);
router.get("/:id(\\d+)", validateId, getOneUser);
router.post("/create", validateData(userCreateSchema), createUser);
router.patch(
  "/status/:id",
  validateId,
  validateData(userStatusSchema),
  changeUserStatus
);
router.patch(
  "/update/:id",
  validateId,
  validateData(userUpdateSchema),
  updateUser
);

export default router;
