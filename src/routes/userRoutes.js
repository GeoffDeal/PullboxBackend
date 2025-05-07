// Imports
import express from "express";
import {
  getOneUser,
  createUser,
  changeUserStatus,
  updateUser,
  getAllCustomers,
  changeUserBox,
} from "../controllers/userController.js";
import { validateData, validateId } from "../utils/validate.js";
import {
  userBoxSchema,
  userCreateSchema,
  userStatusSchema,
  userUpdateSchema,
} from "../schemas/userSchema.js";
import { checkAdmin, checkSignIn } from "../utils/authChecks.js";

const router = express.Router();

router.get("/customers", checkAdmin, getAllCustomers);
router.get("/:id", checkSignIn, validateId, getOneUser);
router.post("/create", validateData(userCreateSchema), createUser);
router.patch(
  "/status/:id",
  checkAdmin,
  validateId,
  validateData(userStatusSchema),
  changeUserStatus
);
router.patch(
  "/boxnumber/:id",
  checkAdmin,
  validateId,
  validateData(userBoxSchema),
  changeUserBox
);
router.patch(
  "/update/:id",
  checkSignIn,
  validateId,
  validateData(userUpdateSchema),
  updateUser
);

export default router;
