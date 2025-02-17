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
  changePullAmount,
  addSub,
} from "../controllers/userController.js";

const router = express.Router();

router.get("/", getAllUsers);
router.get("/:id", getOneUser);
router.post("/create", createUser);
router.patch("/:id/status", changeUserStatus);
router.patch("/:id/update", updateUser);

//Pull Routes
router.post("/:id/addpull", addPull);
router.patch("/:id/changepullamount", changePullAmount);
router.delete("/:id/removepull", removePull);

//Sub Routes
router.post("/:id/addsub", addSub);
// router.delete("/:id/removesub", );

export default router;
