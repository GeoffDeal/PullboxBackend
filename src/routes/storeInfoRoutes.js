import express from "express";
import { readInfo } from "../controllers/storeInfoController.js";

const router = express.Router();

router.get("/", readInfo);

export default router;
