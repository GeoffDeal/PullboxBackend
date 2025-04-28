import express from "express";
import { readInfo, writeInfo } from "../controllers/storeInfoController.js";
import { checkAdmin } from "../utils/authChecks.js";

const router = express.Router();

router.get("/", readInfo);
router.put("/updateinfo", checkAdmin, writeInfo);

export default router;
