import express from "express";
import { readInfo, writeInfo } from "../controllers/storeInfoController.js";

const router = express.Router();

router.get("/", readInfo);
router.put("/updateinfo", writeInfo);

export default router;
